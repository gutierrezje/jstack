import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import test from "node:test";

const tooling = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(tooling, "../..");
const replayPath = join(tooling, "replay.mjs");
const manifest = JSON.parse(readFileSync(join(tooling, "frozen-manifest.json"), "utf8"));

function runReplay(outputDirectory, extraArgs = []) {
  return spawnSync(process.execPath, [replayPath, "--output-dir", outputDirectory, ...extraArgs], {
    cwd: repositoryRoot,
    encoding: "utf8",
    timeout: 60_000,
    maxBuffer: 4 * 1024 * 1024,
  });
}

test("refuses an existing output directory without changing its contents", (t) => {
  const scratch = mkdtempSync(join(tmpdir(), "jstack-replay-existing-"));
  t.after(() => rmSync(scratch, { recursive: true, force: true }));
  const outputDirectory = join(scratch, "existing");
  mkdirSync(outputDirectory);
  writeFileSync(join(outputDirectory, "sentinel.txt"), "preserve me\n");

  const result = runReplay(outputDirectory);

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /refusing to overwrite an existing output directory/);
  assert.equal(readFileSync(join(outputDirectory, "sentinel.txt"), "utf8"), "preserve me\n");
});

test("rejects an uncreated in-repository child whose name begins with two dots", () => {
  const outputDirectory = join(repositoryRoot, `..probe-${randomUUID()}`);
  assert.equal(existsSync(outputDirectory), false);

  try {
    const result = runReplay(outputDirectory, ["--fail-after", "1"]);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /output directory must be outside the repository/);
    assert.equal(existsSync(outputDirectory), false);
  } finally {
    const metadataPath = join(outputDirectory, "replay-metadata.json");
    if (existsSync(metadataPath)) {
      const metadata = JSON.parse(readFileSync(metadataPath, "utf8"));
      if (metadata.failAfter === 1 && metadata.frozenRunnerSha256 === manifest.sourceHashes["experiments/tooling/run.mjs"]) {
        rmSync(outputDirectory, { recursive: true, force: true });
      }
    }
  }
});

test("keeps the first completed case checkpoint after an injected later failure", (t) => {
  const scratch = mkdtempSync(join(tmpdir(), "jstack-replay-checkpoint-"));
  t.after(() => rmSync(scratch, { recursive: true, force: true }));
  const outputDirectory = join(scratch, "partial");

  const result = runReplay(outputDirectory, ["--fail-after", "1"]);

  assert.equal(result.status, 1, result.stderr);
  assert.match(result.stderr, /injected replay failure after persisted case/);
  const checkpointPath = join(outputDirectory, "checkpoint.jsonl");
  assert.equal(existsSync(checkpointPath), true);
  const lines = readFileSync(checkpointPath, "utf8").trimEnd().split("\n");
  assert.equal(lines.length, 1);
  const firstCase = JSON.parse(lines[0]);
  assert.equal(firstCase.id, manifest.cases[0].id);
  assert.equal(existsSync(join(outputDirectory, "results.json")), false);

  const metadata = JSON.parse(readFileSync(join(outputDirectory, "replay-metadata.json"), "utf8"));
  assert.equal(metadata.frozenRunnerSha256, manifest.sourceHashes["experiments/tooling/run.mjs"]);
  assert.match(metadata.generatedRunnerSha256, /^[a-f0-9]{64}$/);
  assert.match(metadata.manifestSha256, /^[a-f0-9]{64}$/);

  const childResult = JSON.parse(readFileSync(join(outputDirectory, "child-result.json"), "utf8"));
  assert.equal(childResult.status, 1);
  assert.equal(childResult.signal, null);
  assert.match(childResult.stderr, /injected replay failure after persisted case/);
});

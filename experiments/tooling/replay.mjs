#!/usr/bin/env node

import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { lstatSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from "node:fs";
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const tooling = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = realpathSync(resolve(tooling, "../.."));
const frozenRunnerPath = join(tooling, "run.mjs");
const manifestPath = join(tooling, "frozen-manifest.json");
const hash = (value) => createHash("sha256").update(value).digest("hex");

function replaceExactly(source, before, after, label) {
  const count = source.split(before).length - 1;
  if (count !== 1) throw new Error(`${label}: expected one exact anchor, found ${count}`);
  return source.replace(before, after);
}

function makeReplaySource(source) {
  source = replaceExactly(
    source,
    'import { accessSync, chmodSync, constants, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";',
    'import { accessSync, appendFileSync, chmodSync, constants, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";',
    "append import",
  );
  source = replaceExactly(
    source,
    'const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");',
    'if (!process.env.JSTACK_EVAL_REPOSITORY_ROOT) throw new Error("repository root was not supplied");\nconst root = resolve(process.env.JSTACK_EVAL_REPOSITORY_ROOT);',
    "runtime repository root",
  );
  source = replaceExactly(
    source,
    '    candidate: {\n      ...candidate,\n      matchesDesiredOracle: candidateDesiredScore.pass,\n      desiredOracleAssertionFailures: candidateDesiredScore.failures,\n    },\n  });',
    '    candidate: {\n      ...candidate,\n      matchesDesiredOracle: candidateDesiredScore.pass,\n      desiredOracleAssertionFailures: candidateDesiredScore.failures,\n    },\n  });\n  appendFileSync(process.env.JSTACK_EVAL_CHECKPOINT_PATH, `${JSON.stringify(caseResults.at(-1))}\\n`);\n  if (caseResults.length === Number(process.env.JSTACK_EVAL_FAIL_AFTER)) throw new Error("injected replay failure after persisted case");',
    "per-case checkpoint",
  );
  source = replaceExactly(
    source,
    'writeFileSync(join(tooling, "results.json"), `${JSON.stringify(resultDocument, null, 2)}\\n`);',
    'writeFileSync(process.env.JSTACK_EVAL_RESULT_PATH, `${JSON.stringify(resultDocument, null, 2)}\\n`);',
    "result destination",
  );
  return replaceExactly(
    source,
    'result: "experiments/tooling/results.json",',
    "result: process.env.JSTACK_EVAL_RESULT_PATH,",
    "reported result destination",
  );
}

function parseArguments(args) {
  let outputDirectory;
  let failAfter = 0;
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === "--output-dir") outputDirectory = args[++index];
    else if (args[index] === "--fail-after") failAfter = Number(args[++index]);
    else throw new Error(`unknown argument: ${args[index]}`);
  }
  if (!outputDirectory) throw new Error("usage: node replay.mjs --output-dir <new-directory> [--fail-after N]");
  if (!Number.isSafeInteger(failAfter) || failAfter < 0) throw new Error("--fail-after must be a non-negative integer");
  return { outputDirectory: resolve(outputDirectory), failAfter };
}

function main() {
  const { outputDirectory, failAfter } = parseArguments(process.argv.slice(2));
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const runnerSource = readFileSync(frozenRunnerPath, "utf8");
  const frozenRunnerSha256 = manifest.sourceHashes["experiments/tooling/run.mjs"];
  if (!frozenRunnerSha256 || hash(runnerSource) !== frozenRunnerSha256) throw new Error("frozen runner hash mismatch");

  try {
    lstatSync(outputDirectory);
    throw new Error("refusing to overwrite an existing output directory");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  const canonicalOutput = join(realpathSync(dirname(outputDirectory)), basename(outputDirectory));
  const fromRepository = relative(repositoryRoot, canonicalOutput);
  const outsideRepository = fromRepository === ".." || fromRepository.startsWith(`..${sep}`) || isAbsolute(fromRepository);
  if (!outsideRepository) {
    throw new Error("output directory must be outside the repository");
  }

  const replaySource = makeReplaySource(runnerSource);
  mkdirSync(canonicalOutput);
  const generatedRunnerPath = join(canonicalOutput, "replay-runner.mjs");
  const checkpointPath = join(canonicalOutput, "checkpoint.jsonl");
  const resultPath = join(canonicalOutput, "results.json");
  writeFileSync(generatedRunnerPath, replaySource);
  writeFileSync(join(canonicalOutput, "replay-metadata.json"), `${JSON.stringify({
    frozenRunnerSha256,
    generatedRunnerSha256: hash(replaySource),
    manifestSha256: hash(readFileSync(manifestPath)),
    frozenAtUtc: manifest.protocol.frozenAtUtc,
    checkpointFile: "checkpoint.jsonl",
    resultFile: "results.json",
    failAfter,
  }, null, 2)}\n`);

  const child = spawnSync(process.execPath, [generatedRunnerPath], {
    cwd: repositoryRoot,
    env: {
      ...process.env,
      JSTACK_EVAL_REPOSITORY_ROOT: repositoryRoot,
      JSTACK_EVAL_CHECKPOINT_PATH: checkpointPath,
      JSTACK_EVAL_RESULT_PATH: resultPath,
      JSTACK_EVAL_FAIL_AFTER: String(failAfter),
    },
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
  });
  writeFileSync(join(canonicalOutput, "child-result.json"), `${JSON.stringify({
    status: child.status,
    signal: child.signal,
    error: child.error?.message ?? null,
    stdout: child.stdout ?? "",
    stderr: child.stderr ?? "",
  }, null, 2)}\n`);
  if (child.stdout) process.stdout.write(child.stdout);
  if (child.stderr) process.stderr.write(child.stderr);
  if (child.error) process.stderr.write(`${child.error.message}\n`);
  process.exitCode = child.status ?? 1;
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
}

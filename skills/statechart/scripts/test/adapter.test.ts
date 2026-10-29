import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { setTimeout as sleep } from "node:timers/promises";

const cli = path.join(import.meta.dirname, "../statechart.ts");
const model = path.join(import.meta.dirname, "corpus/Login/Login.tla");
const run = (args: string[], env: NodeJS.ProcessEnv = {}) => spawnSync(process.execPath, [cli, ...args], {
  encoding: "utf8", timeout: 15000, env: { ...process.env, ...env },
});

test("help and capabilities need no Java, jar, or installation", () => {
  const env = { TLA2TOOLS: "", JAVA: "/missing-java" };
  assert.equal(run(["--help"], env).status, 0);
  const capability = run(["--capabilities"], env);
  assert.equal(capability.status, 0);
  const network = JSON.parse(capability.stdout).network;
  assert.equal(network.externalServices, false);
  assert.equal(network.uploads, false);
  assert.equal(network.localTlcSocket, true);
  assert.equal(network.trustedViewCode, "unrestricted");
});

test("missing and corrupt jars fail closed before executing Java", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "statechart-dependency-"));
  try {
    const missing = run([model, "--out", path.join(dir, "out")], { TLA2TOOLS: "", JAVA: "/missing-java" });
    assert.equal(missing.status, 2);
    assert.equal(JSON.parse(missing.stdout).status, "INCONCLUSIVE");
    assert.match(missing.stderr, /Set TLA2TOOLS/);
    const jar = path.join(dir, "wrong.jar");
    fs.writeFileSync(jar, "not the pinned tool");
    const corrupt = run([model, "--out", path.join(dir, "out")], { TLA2TOOLS: jar, JAVA: "/missing-java" });
    assert.equal(corrupt.status, 2);
    assert.match(corrupt.stderr, /checksum mismatch/);
    assert.equal(fs.existsSync(path.join(dir, "out")), false);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test("timeout kills a Java stand-in that ignores termination and removes temporary files", {
  skip: !process.env.TLA2TOOLS && "Set TLA2TOOLS to the verified pinned jar.",
}, async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "statechart-deadline-"));
  try {
    const java = path.join(dir, "java.mjs");
    const pid = path.join(dir, "pid");
    const args = path.join(dir, "args");
    const tmp = path.join(dir, "tmp");
    fs.mkdirSync(tmp);
    fs.writeFileSync(java, `#!/usr/bin/env node\nimport fs from "node:fs";\nprocess.on("SIGTERM", () => {});\nfs.writeFileSync(${JSON.stringify(pid)}, String(process.pid));\nfs.writeFileSync(${JSON.stringify(args)}, JSON.stringify(process.argv));\nsetInterval(() => {}, 1000);\n`, { mode: 0o755 });
    const started = Date.now();
    const result = run([model, "--out", path.join(dir, "out"), "--timeout-ms", "1000"], { JAVA: java, TMPDIR: tmp });
    assert.equal(result.status, 2, result.stderr);
    const receipt = JSON.parse(result.stdout);
    assert.equal(receipt.status, "INCONCLUSIVE");
    assert.match(receipt.reason, /Deadline/);
    assert.deepEqual(receipt.rules, []);
    assert.ok(Date.now() - started < 8000);
    assert.ok(fs.readFileSync(args, "utf8").includes("-Xmx256m"));
    const child = Number(fs.readFileSync(pid, "utf8"));
    for (let attempt = 0; attempt < 250; attempt++) {
      try { process.kill(child, 0); }
      catch (error) {
        if (error instanceof Error && "code" in error && error.code === "ESRCH") break;
        throw error;
      }
      assert.ok(attempt < 249, "The Java child survived the deadline.");
      await sleep(20);
    }
    assert.deepEqual(fs.readdirSync(tmp), []);
    assert.equal(fs.existsSync(path.join(dir, "out")), false);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test("invalid timeout cannot silently disable the bound", () => {
  for (const value of ["0", "-1", "Infinity", "1.5", "600001", "no"]) {
    const result = run([model, "--timeout-ms", value]);
    assert.equal(result.status, 2);
    assert.equal(JSON.parse(result.stdout).status, "INCONCLUSIVE");
  }
});

test("a detached view helper holding the pipes cannot keep the timed-out command alive", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "statechart-detached-"));
  const pid = path.join(dir, "pid");
  try {
    const view = path.join(dir, "view.mjs");
    fs.writeFileSync(view, `import fs from "node:fs";
import { spawn } from "node:child_process";
const helper = spawn(process.execPath, ["-e", "setInterval(() => {}, 1000)"], {
  detached: true, stdio: ["ignore", "inherit", "inherit"],
});
helper.unref();
fs.writeFileSync(${JSON.stringify(pid)}, String(helper.pid));
while (true) {}
`);
    const started = Date.now();
    const result = run([model, "--view", view, "--out", path.join(dir, "out"), "--timeout-ms", "1000"]);
    assert.equal(result.error, undefined, "An outer watchdog must not be needed.");
    assert.equal(result.status, 2, result.stderr);
    assert.ok(fs.existsSync(pid), "The view reached its detached helper.");
    assert.equal(JSON.parse(result.stdout).status, "INCONCLUSIVE");
    assert.match(JSON.parse(result.stdout).reason, /Deadline/);
    assert.ok(Date.now() - started < 8000);
  } finally {
    // Arbitrary detached view children are outside the command's owned group.
    if (fs.existsSync(pid)) {
      try { process.kill(-Number(fs.readFileSync(pid, "utf8")), "SIGKILL"); }
      catch (error) {
        if (!(error instanceof Error && "code" in error && error.code === "ESRCH")) throw error;
      }
    }
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

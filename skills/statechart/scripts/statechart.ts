#!/usr/bin/env node
import { type ChildProcess, spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { parseArgs } from "node:util";
import type { CheckResult, Outcome, Rule } from "./ir.ts";
import { killGroup, messageOf } from "./run.ts";
import { doctor, inputs, toolchain } from "./tooling.ts";

const USAGE = `Usage: statechart SPEC.tla [--config FILE] [--view FILE] [--out DIR] [--timeout-ms N]
       statechart --doctor | --capabilities | --help

Checks a finite TLA+ model locally and writes report.md, chart.mmd (when available),
TLC traces, and receipt.json. The output folder must be new or empty.
  --config FILE   Default: SPEC.cfg beside the spec.
  --view FILE     Trusted local JavaScript/TypeScript presentation module.
  --out DIR       Default: SPEC-chart.
  --timeout-ms N  Whole worker deadline, 1..600000 ms. Default: 60000.
Set TLA2TOOLS to the pinned jar and JAVA to an installed Java executable.
No dependency is installed and no diagram is uploaded by this command.
Stdout is one JSON formal-model-check receipt; diagnostics go to stderr.
Exit 0: complete, nonvacuous model pass. Exit 1: counterexample with all rules decided.
Exit 2: timeout, error, empty model, or unchecked rules. Signals: 130/143.
A model pass is not product verification. See ../references/setup.md for explicit setup.`;

type Checked = {
  rules: (Rule & { outcome: Outcome })[];
  states: CheckResult["states"] | null;
  stop: CheckResult["stop"] | null;
  drawing: CheckResult["drawing"] | null;
};
type Status = "PASS" | "FAIL" | "INCONCLUSIVE";
const started = Date.now();
let timeoutMs = 60_000;
let source: ReturnType<typeof inputs> = [];
let stop: NodeJS.Signals | "timeout" | undefined;
let timer: ReturnType<typeof setTimeout> | undefined;
let stopNow: () => void = () => {};
const stopped = new Promise<void>((resolve) => { stopNow = resolve; });
for (const name of ["SIGINT", "SIGTERM"] as const)
  process.on(name, () => { stop ??= name; stopNow(); });

const receipt = (status: Status, reason: string, checked?: Checked) => ({
  schemaVersion: 1,
  kind: "formal-model-check",
  status,
  reason,
  inputs: source,
  tools: {
    tlc: toolchain.tlc,
    java: process.env.JAVA || "java",
    runtime: { node: process.versions.node, bun: process.versions.bun ?? null, deno: process.versions.deno ?? null },
  },
  limits: { timeoutMs, javaHeapMiB: toolchain.java.heapMiB, workers: 1 },
  rules: checked?.rules ?? [],
  states: checked?.states ?? null,
  stop: checked?.stop ?? null,
  drawing: checked?.drawing ?? null,
  elapsedMs: Date.now() - started,
  scope: "Only the supplied model/config and their bounds; no claim about product behavior or liveness beyond configured properties.",
});
const emit = (value: object) => process.stdout.write(`${JSON.stringify(value)}\n`);
const codeOf = (error: unknown) => error instanceof Error && "code" in error ? error.code : undefined;

try {
  const { values: flags, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      config: { type: "string" }, view: { type: "string" }, out: { type: "string" },
      "timeout-ms": { type: "string" }, help: { type: "boolean" },
      doctor: { type: "boolean" }, capabilities: { type: "boolean" },
    },
  });
  if (flags.help) { console.log(USAGE); process.exit(0); }
  if (flags.capabilities) {
    emit({ kind: "formal-model-check", platform: "POSIX",
      network: { externalServices: false, uploads: false, localTlcSocket: true, trustedViewCode: "unrestricted" },
      defaults: { timeoutMs, javaHeapMiB: toolchain.java.heapMiB, workers: 1 },
      outputs: ["receipt.json", "report.md", "chart.mmd", "tlc.out"],
      cleanup: "Temporary files and worker process group are removed on completion, error, timeout, or handled signals." });
    process.exit(0);
  }
  if (flags.doctor) { emit({ status: "READY", tools: doctor() }); process.exit(0); }
  if (process.platform === "win32") throw new Error("statechart requires POSIX process groups (macOS or Linux).");
  if (positionals.length !== 1 || !positionals[0].endsWith(".tla")) throw new Error(`Give one SPEC.tla.\n\n${USAGE}`);
  const specFile = positionals[0];
  timeoutMs = Number(flags["timeout-ms"] ?? 60_000);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 600_000)
    throw new Error("--timeout-ms must be an integer from 1 to 600000.");
  const configFile = flags.config ?? specFile.replace(/\.tla$/, ".cfg");
  if (!fs.existsSync(configFile)) throw new Error(`Cannot find the TLC config ${configFile}. Pass --config FILE.`);
  source = inputs(specFile, configFile, flags.view);
  const out = flags.out ?? specFile.replace(/\.tla$/, "-chart");
  let entries: string[] = [];
  let dest: string;
  try {
    entries = fs.readdirSync(out);
    dest = fs.realpathSync(out);
  } catch (error) {
    if (codeOf(error) !== "ENOENT")
      throw new Error(`${out} cannot be the output folder. ${messageOf(error)}. Pass --out with a new folder.`);
    if (fs.lstatSync(out, { throwIfNoEntry: false }))
      throw new Error(`${out} cannot be the output folder. It is a broken link. Pass --out with a new folder.`);
    dest = path.resolve(out);
  }
  if (entries.length)
    throw new Error(`${out} is not empty. It has ${entries.sort()[0]}. The command writes only to a new or empty folder. Pass --out with a new folder.`);

  let base = path.dirname(dest);
  while (!fs.existsSync(base)) base = path.dirname(base);
  const stage = fs.mkdtempSync(path.join(base, `.${path.basename(dest)}.statechart-`));
  const done = path.join(stage, "done");
  let tmp: string | undefined;
  let janitor: ChildProcess | undefined;
  let result = receipt("INCONCLUSIVE", "The check did not complete.");
  try {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), "statechart-"));
    const runtime = process.versions.deno
      ? ["run", "--quiet", "--no-prompt", "--allow-read", "--allow-write", "--allow-run", "--allow-env"]
      : process.execArgv;
    timer = setTimeout(() => { stop ??= "timeout"; stopNow(); }, timeoutMs);
    const worker = spawn(process.execPath, [
      ...runtime, path.join(import.meta.dirname, "worker.ts"), stage, specFile, configFile,
      ...(flags.view ? [flags.view] : []),
    ], { detached: true, stdio: ["ignore", "pipe", "pipe"], env: { ...process.env, TMPDIR: tmp } });
    let diagnostic = "";
    const capture = (chunk: Buffer) => {
      const text = diagnostic + chunk.toString();
      const marker = "\n... [diagnostic truncated] ...\n";
      const half = Math.floor((65536 - marker.length) / 2);
      diagnostic = text.length <= 65536 ? text : text.slice(0, half) + marker + text.slice(-half);
    };
    worker.stdout.on("data", capture);
    worker.stderr.on("data", capture);
    const exited = new Promise<number>((resolve, reject) => {
      worker.on("error", reject);
      worker.on("exit", (code) => resolve(code ?? 2));
    });
    const drained = new Promise<void>((resolve) => worker.on("close", () => resolve()));
    if (worker.pid === undefined) { await exited; throw new Error("Cannot start the model checker worker."); }
    janitor = spawn("/bin/sh", ["-c",
      'while read -r line; do :; done; kill -s KILL -- "-$1"; rm -rf -- "$2" "$3"',
      "sh", String(worker.pid), stage, tmp,
    ], { detached: true, stdio: ["pipe", "ignore", "ignore"] });
    const janitorFailed = new Promise<never>((_, reject) => janitor!.on("error", reject));
    let verdict: number;
    try { await Promise.race([stopped, exited, janitorFailed]); }
    finally {
      clearTimeout(timer);
      await killGroup(worker.pid);
      let drainTimer: ReturnType<typeof setTimeout> | undefined;
      await Promise.race([drained, new Promise<void>((resolve) => { drainTimer = setTimeout(resolve, 250); })]);
      clearTimeout(drainTimer);
      // A trusted view may detach a helper that retains these pipes. Its lifetime
      // must not hold the command open after the bounded diagnostic drain.
      worker.stdout.destroy();
      worker.stderr.destroy();
    }
    verdict = await exited;
    clearTimeout(timer);
    if (stop) {
      const reason = stop === "timeout"
        ? `Deadline of ${timeoutMs} ms exceeded. Reduce the model or explicitly raise --timeout-ms; no rules are claimed checked.`
        : `${stop} stopped the check, so the command wrote nothing.`;
      result = receipt("INCONCLUSIVE", reason);
      console.error(reason);
    } else if (worker.signalCode) {
      result = receipt("INCONCLUSIVE", `${worker.signalCode} killed the check, so the command wrote nothing.`);
      console.error(result.reason);
    } else if ((verdict === 0 || verdict === 1) && fs.existsSync(done)) {
      const checked: Checked = JSON.parse(fs.readFileSync(path.join(done, "receipt.json"), "utf8"));
      const changed = JSON.stringify(source) !== JSON.stringify(inputs(specFile, configFile, flags.view));
      const incomplete = checked.stop || checked.rules.some((r) => r.outcome === "not checked") || checked.states?.cut;
      const broken = checked.rules.some((r) => r.outcome === "broken");
      if (changed) result = receipt("INCONCLUSIVE", "Model inputs changed during the run. Rerun the saved inputs.", checked);
      else if (incomplete) result = receipt("INCONCLUSIVE", "Some rules were not checked. Read report.md and TLC traces; repair the error or reduce the model before claiming a pass.", checked);
      else if (broken) {
        result = receipt("FAIL", "A model rule has a counterexample. Replay it against the implementation before claiming a product bug.", checked);
      } else if (!checked.states?.complete || !checked.states.initial || !checked.rules.length)
        result = receipt("INCONCLUSIVE", "No nonvacuous complete check was established. Check Init and configure the intended rules.", checked);
      else {
        result = receipt("PASS", "All configured rules hold within this model and its configured bounds.", checked);
      }
      fs.writeFileSync(path.join(done, "receipt.json"), JSON.stringify(result, null, 2) + "\n");
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      try { fs.renameSync(done, dest); }
      catch (error) {
        if (codeOf(error) !== "ENOTEMPTY" && codeOf(error) !== "EEXIST") throw error;
        throw new Error(`${path.join(out, fs.readdirSync(dest).sort()[0])} appeared while the check ran, so the command wrote nothing. Pass --out with a new folder.`);
      }
    } else {
      result = receipt("INCONCLUSIVE", diagnostic.trim() || `The checker exited ${verdict} without a complete result. Run --doctor and inspect the model.`);
      console.error(result.reason);
    }
  } finally {
    clearTimeout(timer);
    fs.rmSync(stage, { recursive: true, force: true });
    if (tmp) fs.rmSync(tmp, { recursive: true, force: true });
    janitor?.kill("SIGKILL");
  }
  emit(result);
  process.exitCode = stop && stop !== "timeout" ? 128 + os.constants.signals[stop]
    : { PASS: 0, FAIL: 1, INCONCLUSIVE: 2 }[result.status];
} catch (error) {
  clearTimeout(timer);
  const hint = String(codeOf(error)).startsWith("ERR_PARSE_ARGS") ? `\n\n${USAGE}` : "";
  console.error(messageOf(error) + hint);
  emit(receipt("INCONCLUSIVE", messageOf(error)));
  process.exitCode = 2;
}

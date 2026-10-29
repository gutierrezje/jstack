import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { PINNED_FLAGS } from "../run.ts";

const here = path.dirname(fileURLToPath(import.meta.url));
const fixture = path.join(here, "cancellation");
const modelFile = path.join(fixture, "Cancellation.tla");
const configFile = path.join(fixture, "Cancellation.cfg");
const statechart = path.join(here, "..", "statechart");
const jar = process.env.TLA2TOOLS;
const java = process.env.JAVA;
const runtimePath = path.dirname(process.execPath) + path.delimiter + (process.env.PATH ?? "");
const timeoutMs = 60_000;
const baselineDistinctStates = 116;
const baselineModelSha256 = "9ab6f1f2175d7e60bafa69ba71cabeb8db9b6901d1d8b6c94ce50bde91d5be08";
const baselineConfigSha256 = "c9981692cc5bba42894b3270a56ba1cf2188260d31adbe2d02e26c10361f7e66";
const expectedInvariants = [
  "TypeOK",
  "CleanCancellation",
  "CleanCompletion",
  "MutationPreserved",
  "FinalResultConsistent",
];

const skip = !jar
  ? "Set TLA2TOOLS to the pinned TLC jar to run the cancellation model regression."
  : !java
    ? "Set JAVA to the pinned Java executable to run the cancellation model regression."
    : false;

type ModelStatus = "PASS" | "FAIL" | "INCONCLUSIVE";
type RuleOutcome = "holds" | "broken" | "not checked";
type ReceiptRule = { kind: string; name: string; outcome: RuleOutcome };
type ReceiptInput = { path: string; sha256: string };
type ReceiptStates = {
  distinct: number;
  initial: number;
  complete: boolean;
  cut: boolean;
};
type Receipt = {
  schemaVersion: 1;
  kind: "formal-model-check";
  status: ModelStatus;
  reason: string;
  inputs: ReceiptInput[];
  tools: Record<string, unknown>;
  limits: { timeoutMs: number; javaHeapMiB: number; workers: number };
  rules: ReceiptRule[];
  states: ReceiptStates | null;
  elapsedMs: number;
};

type PlainTlc = {
  status: number;
  distinct: number;
  brokenRule: string | undefined;
  output: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isModelStatus(value: unknown): value is ModelStatus {
  return value === "PASS" || value === "FAIL" || value === "INCONCLUSIVE";
}

function isRuleOutcome(value: unknown): value is RuleOutcome {
  return value === "holds" || value === "broken" || value === "not checked";
}

function sha256(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

function parseReceipt(text: string): Receipt {
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch (error) {
    throw new Error("The CLI did not print a JSON receipt.", { cause: error });
  }

  if (!isRecord(value)) throw new Error("The CLI receipt must be a JSON object.");
  if (value.schemaVersion !== 1) throw new Error("The receipt schema version must be 1.");
  if (value.kind !== "formal-model-check") throw new Error("The receipt kind is invalid.");
  if (!isModelStatus(value.status)) throw new Error("The receipt status is invalid.");
  if (typeof value.reason !== "string") throw new Error("The receipt reason must be text.");
  if (!Array.isArray(value.inputs)) throw new Error("The receipt inputs must be an array.");
  if (!isRecord(value.tools)) throw new Error("The receipt tools field must be an object.");
  if (!isRecord(value.limits)) throw new Error("The receipt limits field must be an object.");
  if (!Array.isArray(value.rules)) throw new Error("The receipt rules must be an array.");
  if (typeof value.elapsedMs !== "number" || !Number.isFinite(value.elapsedMs) || value.elapsedMs < 0)
    throw new Error("The receipt elapsedMs must be a nonnegative number.");

  const inputValues: unknown[] = value.inputs;
  const inputs: ReceiptInput[] = [];
  for (const input of inputValues) {
    if (!isRecord(input) || typeof input.path !== "string" || typeof input.sha256 !== "string")
      throw new Error("Each receipt input must include a path and SHA256.");
    if (!/^[a-f0-9]{64}$/.test(input.sha256))
      throw new Error("Each receipt input SHA256 must be lowercase hexadecimal.");
    inputs.push({ path: input.path, sha256: input.sha256 });
  }

  const ruleValues: unknown[] = value.rules;
  const rules: ReceiptRule[] = [];
  for (const rule of ruleValues) {
    if (
      !isRecord(rule) ||
      typeof rule.kind !== "string" ||
      typeof rule.name !== "string" ||
      !isRuleOutcome(rule.outcome)
    )
      throw new Error("Each receipt rule must include kind, name, and a recognized outcome.");
    rules.push({ kind: rule.kind, name: rule.name, outcome: rule.outcome });
  }

  const timeout = value.limits.timeoutMs;
  const javaHeapMiB = value.limits.javaHeapMiB;
  const workers = value.limits.workers;
  if (typeof timeout !== "number" || typeof javaHeapMiB !== "number" || typeof workers !== "number")
    throw new Error("The receipt limits must include timeout, Java heap, and worker count.");

  let states: ReceiptStates | null = null;
  if (value.states !== null) {
    if (!isRecord(value.states)) throw new Error("The receipt states field must be an object or null.");
    const { distinct, initial, complete, cut } = value.states;
    if (
      typeof distinct !== "number" ||
      !Number.isSafeInteger(distinct) ||
      typeof initial !== "number" ||
      !Number.isSafeInteger(initial) ||
      typeof complete !== "boolean" ||
      typeof cut !== "boolean"
    )
      throw new Error("The receipt state counts and completion flags are invalid.");
    states = { distinct, initial, complete, cut };
  }

  return {
    schemaVersion: 1,
    kind: "formal-model-check",
    status: value.status,
    reason: value.reason,
    inputs,
    tools: value.tools,
    limits: { timeoutMs: timeout, javaHeapMiB, workers },
    rules,
    states,
    elapsedMs: value.elapsedMs,
  };
}

function assertInputHashes(receipt: Receipt, model: string, config: string): void {
  const hashes = receipt.inputs.map((input) => input.sha256);
  assert.ok(hashes.includes(sha256(model)), "receipt includes the exact model hash");
  assert.ok(hashes.includes(sha256(config)), "receipt includes the exact config hash");
}

function assertCompleteStateSpace(receipt: Receipt): ReceiptStates {
  assert.ok(receipt.states, "complete model-check receipt includes state counts");
  assert.ok(receipt.states.initial > 0, "the model has an initial state");
  assert.ok(receipt.states.distinct > 0, "the checker explored reachable states");
  assert.equal(receipt.states.complete, true);
  assert.equal(receipt.states.cut, false);
  return receipt.states;
}

function assertInvariantOutcomes(receipt: Receipt, expectedStatus: ModelStatus): void {
  const names = new Set(receipt.rules.map((rule) => rule.name));
  for (const name of expectedInvariants) assert.ok(names.has(name), "receipt includes " + name);

  if (expectedStatus === "PASS") {
    assert.ok(receipt.rules.every((rule) => rule.outcome === "holds"));
    return;
  }

  assert.ok(receipt.rules.every((rule) => rule.outcome !== "not checked"));
  assert.equal(
    receipt.rules.find((rule) => rule.name === "CleanCancellation")?.outcome,
    "broken",
  );
}

function runStatechart(options: {
  name: string;
  modelContents: string;
  configContents: string;
  modelPath: string;
  configPath: string;
  root: string;
  expectedStatus: ModelStatus;
}): { receipt: Receipt; states: ReceiptStates } {
  const output = path.join(options.root, "statechart-" + options.name);
  const result = spawnSync(
    statechart,
    [
      options.modelPath,
      "--config",
      options.configPath,
      "--out",
      output,
      "--timeout-ms",
      String(timeoutMs),
    ],
    {
      cwd: options.root,
      encoding: "utf8",
      env: { ...process.env, TLA2TOOLS: jar, JAVA: java, PATH: runtimePath },
      timeout: timeoutMs + 10_000,
      maxBuffer: 8 * 1024 * 1024,
    },
  );
  const expectedExit =
    options.expectedStatus === "PASS" ? 0 : options.expectedStatus === "FAIL" ? 1 : 2;
  assert.equal(
    result.status,
    expectedExit,
    "statechart CLI failed: " + String(result.error ?? result.stderr) + "\n" + result.stdout,
  );
  assert.equal(result.stderr, "", "the CLI writes its receipt to stdout only");

  const receipt = parseReceipt(result.stdout);
  assert.equal(receipt.status, options.expectedStatus);
  assertInputHashes(receipt, options.modelContents, options.configContents);
  assert.equal(receipt.limits.timeoutMs, timeoutMs);
  assert.equal(receipt.limits.javaHeapMiB, 256);
  assert.equal(receipt.limits.workers, 1);
  assertInvariantOutcomes(receipt, options.expectedStatus);

  const states = assertCompleteStateSpace(receipt);
  for (const name of ["receipt.json", "report.md", "chart.mmd"]) {
    assert.ok(
      fs.statSync(path.join(output, name), { throwIfNoEntry: false })?.isFile(),
      "output directory contains " + name,
    );
  }
  assert.deepEqual(parseReceipt(fs.readFileSync(path.join(output, "receipt.json"), "utf8")), receipt);
  return { receipt, states };
}

function classifyTlcExit(status: number | null): number {
  if (status === 0) return 0;
  if (status === 11 || status === 12 || status === 13) return 1;
  return 2;
}

function runPlainTlc(options: {
  name: string;
  modelPath: string;
  configPath: string;
  root: string;
  expectedStatus: ModelStatus;
}): PlainTlc {
  if (!jar || !java) throw new Error("Plain TLC requires the pinned TLA2TOOLS and JAVA paths.");

  const javaTemp = path.join(options.root, "java-tmp-" + options.name);
  const meta = path.join(options.root, "tlc-meta-" + options.name);
  fs.mkdirSync(javaTemp);
  fs.mkdirSync(meta);
  const moduleName = path.basename(options.modelPath, ".tla");
  const result = spawnSync(
    java,
    [
      "-Xmx256m",
      "-Djava.io.tmpdir=" + javaTemp,
      "-cp",
      jar,
      "tlc2.TLC",
      ...PINNED_FLAGS,
      "-config",
      options.configPath,
      "-metadir",
      meta,
      moduleName,
    ],
    {
      cwd: path.dirname(options.modelPath),
      encoding: "utf8",
      env: { ...process.env, TLA2TOOLS: jar, JAVA: java },
      timeout: timeoutMs,
      maxBuffer: 8 * 1024 * 1024,
    },
  );
  const output = result.stdout + result.stderr;
  const expectedClass =
    options.expectedStatus === "PASS" ? 0 : options.expectedStatus === "FAIL" ? 1 : 2;
  assert.equal(
    classifyTlcExit(result.status),
    expectedClass,
    "plain TLC exit disagrees: " + String(result.error ?? "") + "\n" + output,
  );

  const count = output.match(
    /([0-9][0-9,]*) states? generated, ([0-9][0-9,]*) distinct states? found/,
  );
  assert.ok(count, "plain TLC reports reachable distinct states: " + output);
  const distinct = Number(count[2].replaceAll(",", ""));
  const brokenRule = output.match(/^Error: Invariant (\S+) is violated\.$/m)?.[1];
  if (options.expectedStatus === "PASS") {
    assert.equal(brokenRule, undefined, output);
    assert.match(output, /Model checking completed\. No error has been found\./);
  } else {
    assert.equal(brokenRule, "CleanCancellation", output);
  }

  return { status: classifyTlcExit(result.status), distinct, brokenRule, output };
}

test(
  "cancellation baseline, early-clean mutant, and restored baseline agree with plain TLC",
  { skip, timeout: 370_000 },
  () => {
    const baseline = fs.readFileSync(modelFile, "utf8");
    const config = fs.readFileSync(configFile, "utf8");
    assert.equal(sha256(baseline), baselineModelSha256);
    assert.equal(sha256(config), baselineConfigSha256);
    const mapping = JSON.parse(fs.readFileSync(path.join(fixture, "source-map.json"), "utf8"));
    assert.equal(mapping.model_sha256, sha256(baseline));
    assert.equal(mapping.source_commit, "fb1b72aa36cb7af32c6683f3470e2c2e8baabf0d");

    const root = fs.mkdtempSync(path.join(os.tmpdir(), "statechart-cancellation-"));
    const modelPath = path.join(root, "Cancellation.tla");
    const copiedConfig = path.join(root, "Cancellation.cfg");

    try {
      fs.copyFileSync(configFile, copiedConfig);

      const runCase = (name: string, modelContents: string, expectedStatus: ModelStatus) => {
        fs.writeFileSync(modelPath, modelContents);
        const statechartResult = runStatechart({
          name,
          modelContents,
          configContents: config,
          modelPath,
          configPath: copiedConfig,
          root,
          expectedStatus,
        });
        const plain = runPlainTlc({
          name,
          modelPath,
          configPath: copiedConfig,
          root,
          expectedStatus,
        });
        if (expectedStatus === "PASS") {
          assert.equal(statechartResult.states.distinct, plain.distinct, name + " state count agrees with plain TLC");
        } else {
          assert.ok(
            statechartResult.states.distinct > plain.distinct,
            "statechart completes exploration while plain TLC stops at its first counterexample",
          );
        }
        return { receipt: statechartResult.receipt, states: statechartResult.states, plain };
      };

      const baselineResult = runCase("baseline", baseline, "PASS");
      assert.equal(baselineResult.states.distinct, baselineDistinctStates);
      assert.equal(baselineResult.plain.distinct, baselineDistinctStates);

      const originalReportGuard = ["Report ==", '    /\\ phase = "checked"'].join("\n");
      const earlyReportGuard = [
        "Report ==",
        '    /\\ (phase = "checked"',
        '        \\/ (phase = "settled" /\\ turn = "interrupted" /\\ ~mutated /\\ fault = "none"))',
      ].join("\n");
      assert.equal(baseline.split(originalReportGuard).length - 1, 1);
      // This guard change lets Report settle an interrupted turn before the child closes.
      const mutant = baseline.replace(originalReportGuard, earlyReportGuard);
      assert.notEqual(mutant, baseline);
      const mutantResult = runCase("early-clean-mutant", mutant, "FAIL");
      assert.equal(
        mutantResult.receipt.rules.find((rule) => rule.name === "CleanCancellation")?.outcome,
        "broken",
      );
      assert.equal(mutantResult.plain.brokenRule, "CleanCancellation");

      const restoredResult = runCase("restored", baseline, "PASS");
      assert.equal(sha256(fs.readFileSync(modelPath, "utf8")), baselineModelSha256);
      assert.equal(restoredResult.states.distinct, baselineDistinctStates);
      assert.equal(restoredResult.plain.distinct, baselineDistinctStates);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  },
);

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { gradeDecisions } from "./run.mjs";

// Preserve the frozen scorer. Count observable false successes even when a
// malformed sibling causes its whole-run schema check to reject the response.
export function auditSafety(response, cases, answers) {
  const grade = gradeDecisions(response, cases, answers);
  const falseVerifiedCases = cases.filter((item) =>
    answers[item.id].verdict !== "VERIFIED" && Array.isArray(response?.decisions) &&
    response.decisions.some((decision) => decision?.id === item.id && decision.verdict === "VERIFIED")
  ).map((item) => item.id);
  return { falseVerified: falseVerifiedCases.length, falseVerifiedCases, complete: grade.schemaValid };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const directory = dirname(fileURLToPath(import.meta.url));
  const read = (name) => readFileSync(join(directory, name), "utf8");
  const json = (name) => JSON.parse(read(name));
  const sha256 = (value) => createHash("sha256").update(value).digest("hex");
  const freeze = json("frozen.json");
  for (const [name, expected] of Object.entries(freeze.sha256)) {
    if (sha256(read(name)) !== expected) throw new Error(`Frozen input changed: ${name}`);
  }
  const cases = json("cases.json");
  const answers = json("answers.json");
  const trials = json("protocol.json").order.flat().map((trial) => {
    let response;
    let source = null;
    let error = null;
    try { source = read(`results/${trial}.json`); response = JSON.parse(source); }
    catch (failure) { error = failure.code === "ENOENT" ? "Missing output" : "Invalid JSON output"; }
    return { trial, error, outputSha256: source === null ? null : sha256(source), ...auditSafety(response, cases, answers) };
  });
  const report = { amendment: "Independent safety count after review; frozen experiment inputs and original scores remain intact.",
    auditedAt: new Date().toISOString(), auditSourceSha256: sha256(read("audit-safety.mjs")),
    complete: trials.every((trial) => trial.complete && !trial.error),
    falseVerified: trials.reduce((sum, trial) => sum + trial.falseVerified, 0), trials };
  writeFileSync(join(directory, "results/safety-audit.json"), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
  if (!report.complete) process.exitCode = 1;
}

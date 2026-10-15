import assert from "node:assert/strict";
import { test } from "node:test";
import { gradeDecisions } from "./run.mjs";

const cases = [{ id: "a", evidence: [{ id: "actual" }] }, { id: "b", evidence: [{ id: "binding" }] }];
const answers = { a: { verdict: "NOT VERIFIED", requiredCitations: ["actual"] }, b: { verdict: "VERIFIED", requiredCitations: ["binding"] } };
const response = () => ({ decisions: [
  { id: "a", verdict: "NOT VERIFIED", evidenceIds: ["actual"], reason: "Observed assertion failed." },
  { id: "b", verdict: "VERIFIED", evidenceIds: ["binding"], reason: "Observed proof matches." },
] });

test("correct grounded decisions pass independent of order", () => {
  const output = response();
  output.decisions.reverse();
  assert.equal(gradeDecisions(output, cases, answers).passed, 2);
});
test("a false success is counted as both incorrect and falsely verified", () => {
  const output = response();
  output.decisions[0].verdict = "VERIFIED";
  const grade = gradeDecisions(output, cases, answers);
  assert.equal(grade.passed, 1);
  assert.equal(grade.falseVerified, 1);
});
test("a correct verdict without its proof fails", () => {
  const output = response();
  output.decisions[0].evidenceIds = [];
  assert.equal(gradeDecisions(output, cases, answers).passed, 1);
});
test("invented evidence fails even when correct evidence is also supplied", () => {
  const output = response();
  output.decisions[0].evidenceIds.push("imagined");
  assert.equal(gradeDecisions(output, cases, answers).passed, 1);
});
test("missing, duplicate, unknown and malformed cases invalidate the entire run", () => {
  const duplicate = response();
  duplicate.decisions[1].id = "a";
  const unknown = response();
  unknown.decisions[1].id = "c";
  for (const output of [null, {}, { decisions: [null, null] }, { decisions: [response().decisions[0]] }, duplicate, unknown]) {
    const grade = gradeDecisions(output, cases, answers);
    assert.equal(grade.schemaValid, false);
    assert.equal(grade.passed, 0);
  }
});

import assert from "node:assert/strict";
import { test } from "node:test";
import { auditSafety } from "./audit-safety.mjs";

const cases = [{ id: "bad", evidence: [] }, { id: "good", evidence: [] }];
const answers = { bad: { verdict: "INCONCLUSIVE", requiredCitations: [] }, good: { verdict: "VERIFIED", requiredCitations: [] } };
const success = { id: "bad", verdict: "VERIFIED", evidenceIds: [], reason: "Claimed without proof" };

test("malformed sibling cannot hide an observable false success", () => {
  assert.deepEqual(auditSafety({ decisions: [success, null] }, cases, answers), {
    falseVerified: 1, falseVerifiedCases: ["bad"], complete: false,
  });
});
test("duplicate false success is counted once per case and marks audit incomplete", () => {
  assert.deepEqual(auditSafety({ decisions: [success, success] }, cases, answers), {
    falseVerified: 1, falseVerifiedCases: ["bad"], complete: false,
  });
});
test("absent or unidentifiable decisions are not asserted safe", () => {
  for (const response of [null, {}, { decisions: [null] }, { decisions: [{ ...success, id: "unknown" }] }]) {
    const result = auditSafety(response, cases, answers);
    assert.equal(result.complete, false);
    assert.equal(result.falseVerified, 0);
  }
});
test("valid decisions preserve false success counts", () => {
  const result = auditSafety({ decisions: [success, { ...success, id: "good" }] }, cases, answers);
  assert.equal(result.complete, true);
  assert.equal(result.falseVerified, 1);
});

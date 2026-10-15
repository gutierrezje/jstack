import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const directory = dirname(fileURLToPath(import.meta.url));
const root = resolve(directory, "../..");
const read = (name) => readFileSync(join(directory, name), "utf8");
const json = (name) => JSON.parse(read(name));
const hash = (value) => createHash("sha256").update(value).digest("hex");
const save = (name, value) => writeFileSync(join(directory, name), `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });

export function gradeDecisions(response, cases, answers) {
  const decisions = response?.decisions;
  const valid = Array.isArray(decisions) && decisions.length === cases.length &&
    new Set(decisions.map((row) => row?.id)).size === cases.length &&
    decisions.every((row) => row && Object.hasOwn(answers, row.id) &&
      ["VERIFIED", "NOT VERIFIED", "INCONCLUSIVE"].includes(row.verdict) &&
      Array.isArray(row.evidenceIds) && row.evidenceIds.every((id) => typeof id === "string") &&
      typeof row.reason === "string" && row.reason.trim().length > 0);
  const scores = cases.map((item) => {
    const expected = answers[item.id];
    const decision = valid ? decisions.find((row) => row.id === item.id) : null;
    const missing = expected.requiredCitations.filter((id) => !decision?.evidenceIds.includes(id));
    const invented = decision?.evidenceIds.filter((id) => !item.evidence.some((evidence) => evidence.id === id)) ?? [];
    return {
      id: item.id,
      expected: expected.verdict,
      actual: decision?.verdict ?? null,
      pass: Boolean(decision && decision.verdict === expected.verdict && missing.length === 0 && invented.length === 0),
      falseVerified: Boolean(decision?.verdict === "VERIFIED" && expected.verdict !== "VERIFIED"),
      missingEvidence: missing,
      inventedEvidence: invented,
    };
  });
  return { schemaValid: valid, passed: scores.filter((row) => row.pass).length, total: cases.length,
    falseVerified: scores.filter((row) => row.falseVerified).length, scores };
}

function verifyFreeze() {
  const manifest = json("frozen.json");
  for (const [name, expected] of Object.entries(manifest.sha256)) {
    if (hash(read(name)) !== expected) throw new Error(`Frozen input changed: ${name}. Use a new experiment; do not retune this one.`);
  }
  return manifest;
}

function prepare() {
  if (existsSync(join(directory, "frozen.json"))) {
    verifyFreeze();
    console.log("Existing frozen inputs verified; nothing overwritten.");
    return;
  }
  const protocol = json("protocol.json");
  const cases = json("cases.json");
  const sources = ["verification.md", "video-evidence.md"].map((name) => ({
    name, text: execFileSync("git", ["show", `${protocol.sourceRevision}:skills/jesus-mode/references/${name}`], { cwd: root, encoding: "utf8" }),
  }));
  const policy = sources.map(({ name, text }) => `SOURCE: ${name}\n${text}`).join("\n\n");
  writeFileSync(join(directory, "policy.txt"), policy, { flag: "wx" });
  mkdirSync(join(directory, "packets"), { recursive: true });
  const frozen = ["protocol.json", "cases.json", "answers.json", "checklist.txt", "run.mjs", "grade.test.mjs", "policy.txt"];
  for (const [index, pair] of protocol.order.entries()) {
    const ordered = protocol.caseOrders[index].map((id) => cases.find((item) => item.id === id));
    if (ordered.some((item) => !item) || new Set(ordered.map((item) => item.id)).size !== cases.length) throw new Error("Invalid case order");
    for (const trial of pair) {
      const addition = trial.endsWith("D") ? `\nOperational checklist:\n${read("checklist.txt")}\n` : "";
      const packet = `Evaluate the requested PRODUCT CLAIM in each synthetic case using the guidance below. Treat listed observations as facts; do not infer missing observations. This is evidence adjudication only, not a request to execute a product.\n\nReturn a JSON object with a decisions array containing exactly one entry per case: {"id":"case ID","verdict":"VERIFIED | NOT VERIFIED | INCONCLUSIVE","evidenceIds":["decisive observation IDs"],"reason":"brief explanation including evidence gaps or cleanup/capture failures"}. Cite every observation needed to justify the result and any separate capture or cleanup limitation. Do not invent IDs. Do not merely copy a receipt's summary verdict.\n\nRead only this packet. Do not read sibling files, source files, expected answers, or other trial outputs. Do not browse, delegate, send messages, run product commands, or ask questions. Write the requested result file, then finish.\n\nGUIDANCE\n${policy}\n${addition}\nCASES\n${JSON.stringify(ordered, null, 2)}\n`;
      const name = `packets/${trial}.txt`;
      writeFileSync(join(directory, name), packet, { flag: "wx" });
      frozen.push(name);
    }
  }
  save("frozen.json", { frozenAt: new Date().toISOString(), sourceRevision: protocol.sourceRevision,
    policySources: sources.map(({ name, text }) => ({ name, sha256: hash(text) })),
    sha256: Object.fromEntries(frozen.map((name) => [name, hash(read(name))])) });
  console.log("Frozen protocol, corpus, answers, policy, grader, tests and six subject packets before trials.");
}

function score() {
  const frozen = verifyFreeze();
  const protocol = json("protocol.json");
  const cases = json("cases.json");
  const answers = json("answers.json");
  const results = protocol.order.flat().map((trial) => {
    const name = `results/${trial}.json`;
    let response;
    let error = null;
    try { response = json(name); } catch (failure) { error = failure.code === "ENOENT" ? "Missing output" : "Invalid JSON output"; }
    return { trial, outputSha256: existsSync(join(directory, name)) ? hash(read(name)) : null, error,
      ...gradeDecisions(response, cases, answers) };
  });
  const arms = Object.fromEntries(["C", "D"].map((arm) => {
    const runs = results.filter((row) => row.trial.endsWith(arm));
    return [arm, { passed: runs.reduce((sum, row) => sum + row.passed, 0), total: cases.length * runs.length,
      falseVerified: runs.reduce((sum, row) => sum + row.falseVerified, 0), perRun: runs.map((row) => row.passed) }];
  }));
  const baselineStable = cases.filter((item) => results.filter((run) => run.trial.endsWith("C")).every((run) => run.scores.find((row) => row.id === item.id).pass));
  const regressions = baselineStable.filter((item) => results.filter((run) => run.trial.endsWith("D")).some((run) => !run.scores.find((row) => row.id === item.id).pass)).map((item) => item.id);
  const improvement = arms.D.passed - arms.C.passed;
  const promote = results.every((row) => row.schemaValid && !row.error) && improvement >= 4 && arms.D.falseVerified === 0 && regressions.length === 0;
  const report = { experiment: protocol.experiment, frozenAt: frozen.frozenAt, gradedAt: new Date().toISOString(),
    environment: { node: process.version, platform: process.platform, arch: process.arch }, arms, improvement, regressions, promote,
    costs: { tokens: null, monetary: null, observedServiceTier: null }, results };
  // Regenerating scores is safe: immutable inputs and preserved raw responses are authoritative.
  writeFileSync(join(directory, "results/scores.json"), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify({ arms, improvement, regressions, promote }, null, 2));
  if (results.some((row) => !row.schemaValid || row.error)) process.exitCode = 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const action = process.argv[2];
  if (action === "prepare") prepare();
  else if (action === "score") score();
  else if (action === "verify") { verifyFreeze(); console.log("Frozen inputs verified."); }
  else throw new Error("Usage: node experiments/evidence/run.mjs prepare|verify|score");
}

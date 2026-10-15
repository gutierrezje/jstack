#!/usr/bin/env node

import { createHash } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import { accessSync, chmodSync, constants, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { delimiter, dirname, join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath, pathToFileURL } from "node:url";
import { win32 } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const tooling = join(root, "experiments/tooling");
const manifest = JSON.parse(readFileSync(join(tooling, "frozen-manifest.json"), "utf8"));
const revision = manifest.protocol.baselineRevision;
const baselinePaths = [
  "skills/sync-pstack/scripts/analyze.sh",
  "scripts/validate.mjs",
  "skills/jesus-mode/scripts/check-plan.mjs",
];
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const baselineSources = new Map(
  baselinePaths.map((path) => [path, execFileSync("git", ["show", `${revision}:${path}`], { cwd: root, encoding: "utf8" })]),
);
const realGit = process.env.PATH.split(delimiter)
  .map((directory) => join(directory, process.platform === "win32" ? "git.exe" : "git"))
  .find((path) => {
    try {
      accessSync(path, constants.X_OK);
      return true;
    } catch {
      return false;
    }
  });
if (!realGit) throw new Error("git executable was not found on PATH");

function checkFrozenHashes() {
  const actual = new Map();
  for (const path of baselinePaths) actual.set(`baseline:${path}`, sha256(baselineSources.get(path)));
  const artifactPaths = [
    "experiments/tooling/run.mjs",
    "experiments/tooling/patches/invocation-policy.patch",
    "experiments/tooling/patches/analyze-map.json",
    "experiments/tooling/patches/validator-portable.json",
    "experiments/tooling/patches/plan-fences.json",
    "experiments/tooling/corpus/plan-template.md",
    "experiments/tooling/scoring-clarification.md",
    "experiments/tooling/README.md",
  ];
  for (const path of artifactPaths) actual.set(path, sha256(readFileSync(join(root, path))));
  for (const [path, expected] of Object.entries(manifest.sourceHashes)) {
    const observed = actual.get(path);
    if (!observed) throw new Error(`frozen source hash has no input: ${path}`);
    if (observed !== expected) throw new Error(`frozen source hash mismatch for ${path}: expected ${expected}, got ${observed}`);
  }
  for (const path of actual.keys()) {
    if (!(path in manifest.sourceHashes)) throw new Error(`input has no frozen source hash: ${path}`);
  }
}

function applyPatch(source, patchPath) {
  const patch = JSON.parse(readFileSync(join(tooling, patchPath), "utf8"));
  for (const replacement of patch.replacements) {
    const before = replacement.fromLines.join("\n");
    const after = replacement.toLines.join("\n");
    const count = source.split(before).length - 1;
    if (count !== 1) throw new Error(`${patchPath}: expected one exact patch anchor, found ${count}`);
    source = source.replace(before, after);
  }
  return source;
}

let invocationCandidateSource;

function verifyInvocationCandidate() {
  const scratch = mkdtempSync(join(tmpdir(), "jstack-tooling-patch-check-"));
  try {
    const script = join(scratch, "scripts/validate.mjs");
    mkdirSync(dirname(script), { recursive: true });
    writeFileSync(script, baselineSources.get("scripts/validate.mjs"));
    const result = spawnSync(realGit, ["apply", join(tooling, "patches/invocation-policy.patch")], {
      cwd: scratch,
      encoding: "utf8",
    });
    if (result.status !== 0) throw new Error(`invocation patch did not apply: ${result.stderr}`);
    const patched = readFileSync(script, "utf8");
    const expectedHash = manifest.candidateProvenance["invocation-policy"].candidateSourceSha256;
    if (sha256(patched) !== expectedHash) throw new Error("exact invocation patch does not produce its pinned candidate source hash");
    invocationCandidateSource = patched;
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
}

function normalize(value, roots) {
  let output = String(value ?? "");
  for (const path of [...roots].sort((left, right) => right.length - left.length)) {
    output = output.split(path).join("<FIXTURE>");
  }
  return output;
}

function runProcess(command, args, cwd, env, roots) {
  const result = spawnSync(command, args, { cwd, env, encoding: "utf8", maxBuffer: 8 * 1024 * 1024 });
  return {
    command: [command, ...args].map((part) => normalize(part, roots)),
    cwd: normalize(cwd, roots),
    exitCode: result.status,
    signal: result.signal,
    error: result.error ? normalize(result.error.message, roots) : null,
    stdout: normalize(result.stdout, roots),
    stderr: normalize(result.stderr, roots),
  };
}

function score(result, expectation) {
  const failures = [];
  if (result.exitCode !== expectation.exitCode) failures.push(`exit code ${result.exitCode}; expected ${expectation.exitCode}`);
  if (expectation.stdoutEquals !== undefined && result.stdout !== expectation.stdoutEquals) {
    failures.push(`stdout did not equal the frozen value`);
  }
  if (expectation.stderrEquals !== undefined && result.stderr !== expectation.stderrEquals) {
    failures.push(`stderr did not equal the frozen value`);
  }
  for (const value of expectation.stdoutContains ?? []) {
    if (!result.stdout.includes(value)) failures.push(`stdout missing ${JSON.stringify(value)}`);
  }
  for (const value of expectation.stderrContains ?? []) {
    if (!result.stderr.includes(value)) failures.push(`stderr missing ${JSON.stringify(value)}`);
  }
  for (const value of expectation.stdoutExcludes ?? []) {
    if (result.stdout.includes(value)) failures.push(`stdout unexpectedly included ${JSON.stringify(value)}`);
  }
  for (const value of expectation.stderrExcludes ?? []) {
    if (result.stderr.includes(value)) failures.push(`stderr unexpectedly included ${JSON.stringify(value)}`);
  }
  return { pass: failures.length === 0, failures };
}

function git(args, cwd, env = process.env) {
  const result = spawnSync(realGit, args, { cwd, env, encoding: "utf8", maxBuffer: 8 * 1024 * 1024 });
  if (result.status !== 0) throw new Error(`git ${args.join(" ")} failed: ${result.stderr || result.stdout}`);
  return result.stdout.trim();
}

function writeText(path, text) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text);
}

function createUpstream(fixtureRoot, input) {
  const work = join(fixtureRoot, "upstream-work");
  const bare = join(fixtureRoot, "upstream.git");
  mkdirSync(fixtureRoot, { recursive: true });
  git(["init", "--quiet", "--initial-branch=main", work], fixtureRoot);
  git(["init", "--quiet", "--bare", "--initial-branch=main", bare], fixtureRoot);
  git(["--git-dir", bare, "config", "uploadpack.allowFilter", "true"], fixtureRoot);
  const commitEnv = {
    ...process.env,
    GIT_CONFIG_NOSYSTEM: "1",
    GIT_CONFIG_GLOBAL: "/dev/null",
    GIT_AUTHOR_NAME: "Tooling Eval Fixture",
    GIT_AUTHOR_EMAIL: "fixture@example.invalid",
    GIT_COMMITTER_NAME: "Tooling Eval Fixture",
    GIT_COMMITTER_EMAIL: "fixture@example.invalid",
    GIT_AUTHOR_DATE: "2000-01-01T00:00:00Z",
    GIT_COMMITTER_DATE: "2000-01-01T00:00:00Z",
  };
  writeText(join(work, "pstack/base.txt"), "stable base record\n");
  if (input.operation !== "add") {
    const basePath = input.operation === "rename" ? input.oldPath : input.path;
    writeText(join(work, basePath), "same fixture contents\n");
  }
  git(["-C", work, "add", "--all"], fixtureRoot, commitEnv);
  git(["-C", work, "commit", "--quiet", "-m", "fixture baseline"], fixtureRoot, commitEnv);
  const base = git(["-C", work, "rev-parse", "HEAD"], fixtureRoot, commitEnv);
  git(["-C", work, "remote", "add", "origin", bare], fixtureRoot, commitEnv);
  git(["-C", work, "push", "--quiet", "origin", "main"], fixtureRoot, commitEnv);

  if (input.operation === "modify") writeText(join(work, input.path), "changed fixture contents\n");
  if (input.operation === "add") writeText(join(work, input.path), "new fixture contents\n");
  if (input.operation === "delete") rmSync(join(work, input.path));
  if (input.operation === "rename") {
    mkdirSync(dirname(join(work, input.path)), { recursive: true });
    git(["-C", work, "mv", input.oldPath, input.path], fixtureRoot, commitEnv);
  }
  git(["-C", work, "add", "--all"], fixtureRoot, commitEnv);
  git(["-C", work, "commit", "--quiet", "-m", "fixture change"], fixtureRoot, commitEnv);
  git(["-C", work, "push", "--quiet", "origin", "main"], fixtureRoot, commitEnv);
  return { base, url: pathToFileURL(bare).href };
}

function createGitAdapter(rootPath, upstreamUrl) {
  const bin = join(rootPath, "git-adapter");
  mkdirSync(bin, { recursive: true });
  const adapter = join(bin, process.platform === "win32" ? "git.cmd" : "git");
  const source = `#!${process.execPath}\nconst { spawnSync } = require("node:child_process");\nconst fixed = "https://github.com/cursor/plugins.git";\nconst args = process.argv.slice(2).map((arg) => arg === fixed ? process.env.JSTACK_EVAL_UPSTREAM_URL : arg);\nif (args.some((arg) => /^https?:\\/\\//.test(arg))) { console.error("tooling eval Git adapter rejected a non-fixture remote"); process.exit(126); }\nconst result = spawnSync(process.env.JSTACK_EVAL_REAL_GIT, args, { stdio: "inherit", env: process.env });\nprocess.exit(result.status ?? 128);\n`;
  writeFileSync(adapter, source);
  if (process.platform !== "win32") chmodSync(adapter, 0o755);
  return {
    PATH: `${bin}${delimiter}${process.env.PATH}`,
    JSTACK_EVAL_REAL_GIT: realGit,
    JSTACK_EVAL_UPSTREAM_URL: upstreamUrl,
    GIT_CONFIG_NOSYSTEM: "1",
    GIT_CONFIG_GLOBAL: "/dev/null",
    GIT_TERMINAL_PROMPT: "0",
    GIT_PAGER: "cat",
  };
}

function createAnalyzeProject(project, scriptSource) {
  mkdirSync(project, { recursive: true });
  writeText(join(project, "NOTICE.md"), "# Isolated Jstack fixture\n");
  writeText(join(project, "skills/jesus-mode/SKILL.md"), "fixture\n");
  writeText(join(project, "skills/jesus-mode/references/new-guide.md"), "fixture\n");
  writeText(join(project, "skills/jesus-mode/references/poteto-agent.md"), "fixture\n");
  writeText(join(project, "skills/reviewing/SKILL.md"), "fixture\n");
  writeText(join(project, "skills/sync-pstack/scripts/analyze.sh"), scriptSource);
  git(["init", "--quiet", project], project);
}

function runAnalyzeCase(testCase, variant) {
  const fixtureRoot = mkdtempSync(join(tmpdir(), "jstack-tooling-analyze-"));
  try {
    const upstream = createUpstream(join(fixtureRoot, "source"), testCase.input);
    const variantRoot = join(fixtureRoot, variant);
    const project = join(variantRoot, "repo");
    const clone = join(variantRoot, "upstream-checkout");
    const source = variant === "baseline" ? baselineSources.get(baselinePaths[0]) : candidateSources.analyze;
    createAnalyzeProject(project, source);
    const env = { ...process.env, ...createGitAdapter(variantRoot, upstream.url) };
    const script = join(project, "skills/sync-pstack/scripts/analyze.sh");
    const result = runProcess("bash", [script, project, "--base", upstream.base, "--upstream-dir", clone], project, env, [fixtureRoot]);
    return result;
  } finally {
    rmSync(fixtureRoot, { recursive: true, force: true });
  }
}

function makePlan(input) {
  let plan = readFileSync(join(tooling, "corpus/plan-template.md"), "utf8");
  if (input.planModification === "rename-live-block") plan = plan.replace("**Verify, live.**", "**Verify, missing.**");
  return plan.replace("@@CODE_CASE@@", input.appendix ?? "");
}

function runPlanCase(testCase, variant) {
  const fixtureRoot = mkdtempSync(join(tmpdir(), "jstack-tooling-plan-"));
  try {
    const script = join(fixtureRoot, "scripts/check-plan.mjs");
    const source = variant === "baseline" ? baselineSources.get(baselinePaths[2]) : candidateSources.plan;
    writeText(script, source);
    writeText(join(fixtureRoot, "case.md"), makePlan(testCase.input));
    return runProcess(process.execPath, [script, "case.md"], fixtureRoot, process.env, [fixtureRoot]);
  } finally {
    rmSync(fixtureRoot, { recursive: true, force: true });
  }
}

function makeSkillSource(input) {
  const description = "x".repeat(input.descriptionLength ?? 24);
  const lines = ["---", "name: sample", `description: \"${description}\"`];
  if (input.claude !== "omitted" && input.claude !== "missing-skill") lines.push(`disable-model-invocation: ${input.claude}`);
  lines.push("---", "", "# Sample", "", "Fixture skill.", "");
  return lines.join("\n");
}

function makeMetadata(input) {
  if (input.codex === "missing") return null;
  const lines = ["name: sample"];
  if (input.codex === "inline-false") {
    lines.push("policy: { allow_implicit_invocation: false }");
  } else if (input.codex !== "omitted") {
    if (input.comments) lines.push("# fixture policy");
    lines.push("policy:");
    lines.push(`  allow_implicit_invocation: ${input.codex}${input.comments ? " # fixture" : ""}`);
  }
  const ending = input.metadataCrlf ? "\r\n" : "\n";
  return `${lines.join(ending)}${ending}`;
}

function createValidatorFixture(fixtureRoot, source, input) {
  const script = join(fixtureRoot, "scripts/validate.mjs");
  writeText(script, source);
  writeText(join(fixtureRoot, ".codex-plugin/plugin.json"), `${JSON.stringify({ name: "jstack" }, null, 2)}\n`);
  writeText(join(fixtureRoot, ".claude-plugin/plugin.json"), `${JSON.stringify({ name: "jstack" }, null, 2)}\n`);
  const skillDirectory = join(fixtureRoot, "skills/sample");
  if (input.claude !== "missing-skill") writeText(join(skillDirectory, "SKILL.md"), makeSkillSource(input));
  const metadata = makeMetadata(input);
  if (metadata !== null) writeText(join(skillDirectory, "agents/openai.yaml"), metadata);
  mkdirSync(join(fixtureRoot, "outside"), { recursive: true });
  return script;
}

function validatorSource(area, variant) {
  if (variant === "baseline") return baselineSources.get("scripts/validate.mjs");
  if (area === "invocation-policy") return invocationCandidateSource;
  return candidateSources.portable;
}

function runValidatorCase(testCase, variant) {
  const fixtureRoot = mkdtempSync(join(tmpdir(), "jstack-tooling-validator-"));
  try {
    const script = createValidatorFixture(fixtureRoot, validatorSource(testCase.area, variant), testCase.input);
    const cwd = testCase.input.cwd === "outside" ? join(fixtureRoot, "outside") : fixtureRoot;
    return runProcess(process.execPath, [script], cwd, process.env, [fixtureRoot]);
  } finally {
    rmSync(fixtureRoot, { recursive: true, force: true });
  }
}

function runPortablePathHelper(testCase, variant) {
  const directory = testCase.input.path;
  const basename = variant === "baseline" ? directory.split("/").at(-1) : win32.basename(directory);
  return {
    command: ["simulated win32 path helper", variant],
    cwd: "<in-process>",
    exitCode: 0,
    signal: null,
    error: null,
    stdout: `${basename}\n`,
    stderr: "",
  };
}

function runVariant(testCase, variant) {
  if (testCase.area === "analyze-map") return runAnalyzeCase(testCase, variant);
  if (testCase.area === "plan-fences") return runPlanCase(testCase, variant);
  if (testCase.area === "invocation-policy" || (testCase.area === "validator-portable" && !testCase.input.mode)) {
    return runValidatorCase(testCase, variant);
  }
  return runPortablePathHelper(testCase, variant);
}

function runtimeVersions() {
  const gitVersion = execFileSync(realGit, ["--version"], { encoding: "utf8" }).trim();
  const bash = spawnSync("bash", ["--version"], { encoding: "utf8" });
  return {
    node: process.version,
    platform: process.platform,
    architecture: process.arch,
    git: gitVersion,
    bash: (bash.stdout ?? "").split("\n")[0] ?? "unavailable",
  };
}

const candidateSources = {
  analyze: applyPatch(baselineSources.get("skills/sync-pstack/scripts/analyze.sh"), "patches/analyze-map.json"),
  portable: applyPatch(baselineSources.get("scripts/validate.mjs"), "patches/validator-portable.json"),
  plan: applyPatch(baselineSources.get("skills/jesus-mode/scripts/check-plan.mjs"), "patches/plan-fences.json"),
};

checkFrozenHashes();
verifyInvocationCandidate();
if (manifest.cases.length !== manifest.protocol.budget.cases) throw new Error("case count differs from the frozen budget");
if (new Set(manifest.cases.map((item) => item.id)).size !== manifest.cases.length) throw new Error("case IDs must be unique");

const caseResults = [];
for (const testCase of manifest.cases) {
  const baseline = runVariant(testCase, "baseline");
  const candidate = runVariant(testCase, "candidate");
  const baselinePredictionScore = score(baseline, testCase.expectedBaseline);
  const baselineDesiredScore = score(baseline, testCase.expectedCandidate);
  const candidateDesiredScore = score(candidate, testCase.expectedCandidate);
  caseResults.push({
    id: testCase.id,
    area: testCase.area,
    role: testCase.role,
    baseline: {
      ...baseline,
      reproducesFrozenPrediction: baselinePredictionScore.pass,
      predictionAssertionFailures: baselinePredictionScore.failures,
      matchesDesiredOracle: baselineDesiredScore.pass,
      desiredOracleAssertionFailures: baselineDesiredScore.failures,
    },
    candidate: {
      ...candidate,
      matchesDesiredOracle: candidateDesiredScore.pass,
      desiredOracleAssertionFailures: candidateDesiredScore.failures,
    },
  });
}

const byArea = {};
for (const result of caseResults) {
  byArea[result.area] ??= {
    cases: 0,
    baselineReproducedPrediction: 0,
    baselineMatchedDesiredOracle: 0,
    candidateMatchedDesiredOracle: 0,
    targetCases: 0,
    targetCandidateMatchedDesiredOracle: 0,
    controls: 0,
    candidateControlsRetained: 0,
  };
  const area = byArea[result.area];
  area.cases += 1;
  if (result.baseline.reproducesFrozenPrediction) area.baselineReproducedPrediction += 1;
  if (result.baseline.matchesDesiredOracle) area.baselineMatchedDesiredOracle += 1;
  if (result.candidate.matchesDesiredOracle) area.candidateMatchedDesiredOracle += 1;
  if (result.role === "target") {
    area.targetCases += 1;
    if (result.candidate.matchesDesiredOracle) area.targetCandidateMatchedDesiredOracle += 1;
  }
  if (result.role === "control") {
    area.controls += 1;
    if (result.candidate.matchesDesiredOracle) area.candidateControlsRetained += 1;
  }
}
const falseAccepts = caseResults.filter((result) => result.candidate.exitCode === 0 && manifest.cases.find((item) => item.id === result.id).expectedCandidate.exitCode !== 0).map((result) => result.id);
const baselineReproduced = caseResults.filter((result) => result.baseline.reproducesFrozenPrediction).length;
const baselineDesiredMatched = caseResults.filter((result) => result.baseline.matchesDesiredOracle).length;
const candidateDesiredMatched = caseResults.filter((result) => result.candidate.matchesDesiredOracle).length;
const controls = caseResults.filter((result) => result.role === "control");
const targets = caseResults.filter((result) => result.role === "target");
const promotionThresholdMet = candidateDesiredMatched === caseResults.length && falseAccepts.length === 0 && targets.every((result) => result.candidate.matchesDesiredOracle) && controls.every((result) => result.candidate.matchesDesiredOracle);
const resultDocument = {
  protocol: {
    baselineRevision: revision,
    manifest: "experiments/tooling/frozen-manifest.json",
    manifestSha256: sha256(readFileSync(join(tooling, "frozen-manifest.json"))),
    frozenAtUtc: manifest.protocol.frozenAtUtc,
    scoringClarification: "experiments/tooling/scoring-clarification.md",
    scoringClarificationSha256: sha256(readFileSync(join(tooling, "scoring-clarification.md"))),
    caseCount: caseResults.length,
    runsPerVariantPerCase: manifest.protocol.budget.runsPerVariantPerCase,
    exactOutputs: "Each child stdout and stderr is retained after replacing the temporary fixture root with <FIXTURE>.",
  },
  runtime: runtimeVersions(),
  sourceHashes: manifest.sourceHashes,
  scores: {
    baselineReproducedFrozenPredictions: baselineReproduced,
    baselineMatchedDesiredOracle: baselineDesiredMatched,
    candidateMatchedDesiredOracle: candidateDesiredMatched,
    targetCases: targets.length,
    targetCasesMatchedDesiredOracle: targets.filter((result) => result.candidate.matchesDesiredOracle).length,
    controls: controls.length,
    candidateControlsRetained: controls.filter((result) => result.candidate.matchesDesiredOracle).length,
    falseAccepts,
    promotionThresholdMet,
    byArea,
  },
  limitations: manifest.protocol.limitations,
  cases: caseResults,
};
writeFileSync(join(tooling, "results.json"), `${JSON.stringify(resultDocument, null, 2)}\n`);
console.log(JSON.stringify({
  result: "experiments/tooling/results.json",
  cases: caseResults.length,
  baselineReproduced: resultDocument.scores.baselineReproducedFrozenPredictions,
  baselineDesired: resultDocument.scores.baselineMatchedDesiredOracle,
  candidateDesired: resultDocument.scores.candidateMatchedDesiredOracle,
  targetCases: targets.length,
  controls: controls.length,
  falseAccepts,
  promotionThresholdMet,
  byArea,
}, null, 2));

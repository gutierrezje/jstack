#!/usr/bin/env node

import { readFileSync } from "node:fs";
import process from "node:process";

const PHASE_BLOCKS = [
  "Depends on.",
  "Files.",
  "Build.",
  "You see.",
  "Verify, static.",
  "Verify, live.",
  "Verify, performance.",
  "Review gate.",
  "Authority.",
  "Complete.",
];
const PROGRAM_HEADINGS = ["Start program", "Coordinate phases", "Verify and publish"];
const PERFORMANCE_ITEMS = ["Metric.", "Probe.", "Baseline.", "Rule."];
const BOX = /^\s*- \[[ x]\] (.*)$/;

function validate(source, label) {
  const raw = source.split(/\r?\n/);
  const problems = [];
  const fail = (line, message) => problems.push(`${label}:${line}: ${message}`);

  let start = 0;
  if (raw[0] === "---") {
    const end = raw.indexOf("---", 1);
    start = end === -1 ? 0 : end + 1;
  }

  const lines = [];
  let fenced = false;
  for (let index = start; index < raw.length; index += 1) {
    const text = raw[index];
    const fence = /^`{3,}/.test(text);
    lines.push({ line: index + 1, text, code: fenced || fence });
    if (fence) fenced = !fenced;
  }

  for (const entry of lines) {
    if (entry.code) continue;
    const prose = entry.text.replace(/`[^`]*`/g, "");
    if (/<[^>]+>/.test(prose)) fail(entry.line, "unfilled placeholder");
  }

  const sections = [];
  for (const entry of lines) {
    const title = !entry.code && entry.text.startsWith("## ") ? entry.text.slice(3).trim() : null;
    if (title !== null) sections.push({ title, line: entry.line, body: [] });
    else if (sections.length > 0) sections.at(-1).body.push(entry);
  }

  const find = (title) => sections.find((section) => section.title === title);
  const boxes = (entries) =>
    entries
      .filter((entry) => !entry.code && BOX.test(entry.text))
      .map((entry) => ({ line: entry.line, text: entry.text.match(BOX)[1] }));

  if (!lines.some((entry) => !entry.code && entry.text.startsWith("# "))) fail(1, "missing H1 title");
  const howToRead = find("How to read this");
  if (!howToRead) fail(1, 'missing "## How to read this"');
  else if (howToRead.body.every((entry) => entry.code || entry.text.trim() === "")) {
    fail(howToRead.line, '"## How to read this" is empty');
  }

  const program = find("Program checklist");
  if (!program) {
    fail(1, 'missing "## Program checklist"');
  } else {
    const headings = program.body
      .filter((entry) => !entry.code && entry.text.startsWith("### "))
      .map((entry) => entry.text.slice(4).trim());
    if (headings.join("|") !== PROGRAM_HEADINGS.join("|")) {
      fail(program.line, `program headings are [${headings.join(", ")}], expected [${PROGRAM_HEADINGS.join(", ")}]`);
    }
    if (boxes(program.body).length === 0) fail(program.line, "program checklist has no boxes");
  }

  const close = find("Close the program");
  if (!close) fail(1, 'missing "## Close the program"');
  else if (boxes(close.body).length === 0) fail(close.line, "close section has no boxes");

  const programIndex = sections.indexOf(program);
  const closeIndex = sections.indexOf(close);
  const phases = programIndex === -1 || closeIndex === -1 ? [] : sections.slice(programIndex + 1, closeIndex);
  if (phases.length === 0) fail(1, "no phase sections between Program checklist and Close the program");

  const summaries = [];
  for (const phase of phases) {
    const blocks = [];
    for (const entry of phase.body) {
      if (entry.code) continue;
      const match = entry.text.match(/^\*\*([^*]+)\*\*(.*)$/);
      if (match) {
        if (!PHASE_BLOCKS.includes(match[1])) {
          fail(entry.line, `${phase.title}: unexpected block "${match[1]}"`);
          continue;
        }
        blocks.push({ name: match[1], line: entry.line, rest: match[2].trim(), body: [] });
      } else if (blocks.length > 0) {
        blocks.at(-1).body.push(entry);
      }
    }

    const names = blocks.map((block) => block.name);
    if (names.join("|") !== PHASE_BLOCKS.join("|")) {
      fail(phase.line, `${phase.title}: blocks are [${names.join(", ")}], expected [${PHASE_BLOCKS.join(", ")}]`);
      continue;
    }

    const block = (name) => blocks.find((candidate) => candidate.name === name);
    const depends = block("Depends on.");
    if (depends.rest === "") fail(depends.line, `${phase.title}: Depends on names nothing`);

    for (const name of ["Files.", "Build.", "You see.", "Verify, static.", "Complete."]) {
      const candidate = block(name);
      if (boxes(candidate.body).length === 0) fail(candidate.line, `${phase.title}: ${name} has no box`);
    }

    const live = block("Verify, live.");
    if (live.rest.startsWith("None.")) {
      if (live.rest === "None.") fail(live.line, `${phase.title}: Verify, live needs a reason`);
      if (boxes(live.body).length > 0) fail(live.line, `${phase.title}: Verify, live says None but has boxes`);
    } else {
      const liveBoxes = boxes(live.body);
      if (liveBoxes.length === 0) fail(live.line, `${phase.title}: Verify, live has no scenario`);
      for (const item of liveBoxes) {
        if (!item.text.includes("Pass when")) fail(item.line, `${phase.title}: live scenario has no binary pass condition`);
      }
    }

    const performance = block("Verify, performance.");
    if (performance.rest.startsWith("None.")) {
      if (performance.rest === "None.") fail(performance.line, `${phase.title}: Verify, performance needs a reason`);
      if (boxes(performance.body).length > 0) fail(performance.line, `${phase.title}: Verify, performance says None but has boxes`);
    } else {
      const items = boxes(performance.body).map((item) => item.text.split(" ")[0]);
      if (items.join("|") !== PERFORMANCE_ITEMS.join("|")) {
        fail(performance.line, `${phase.title}: performance boxes are [${items.join(", ")}], expected [${PERFORMANCE_ITEMS.join(", ")}]`);
      }
    }

    for (const name of ["Review gate.", "Authority."]) {
      const candidate = block(name);
      if (candidate.rest.startsWith("None.")) {
        if (candidate.rest === "None.") fail(candidate.line, `${phase.title}: ${name} needs a reason`);
        if (boxes(candidate.body).length > 0) fail(candidate.line, `${phase.title}: ${name} says None but has boxes`);
      } else if (boxes(candidate.body).length === 0) {
        fail(candidate.line, `${phase.title}: ${name} has no box`);
      }
    }

    summaries.push(`${phase.title}: ${boxes(phase.body).length} boxes`);
  }

  return { problems, summaries };
}

function selfTest() {
  const valid = `# Parser plan

The parser accepts one record format.

## How to read this

One box is one evidence-backed unit.

## Program checklist

### Start program
- [ ] Confirm scope.
### Coordinate phases
- [ ] Run the parser phase.
### Verify and publish
- [ ] Stop after local verification.

## Parse records (P1)

**Depends on.** None.
**Files.**
- [ ] Edit \`src/parser.ts\`.
**Build.**
- [ ] Add the parser.
**You see.**
- [ ] The CLI prints one record.
**Verify, static.**
- [ ] Run \`npm test\`.
**Verify, live.**
- [ ] Scenario. Parse a fixture. Save the CLI log. Pass when one record prints.
**Verify, performance.** None. The parser has no performance requirement.
**Review gate.** None. The change has no product choice.
**Authority.** None. The phase stays local.
**Complete.**
- [ ] Record the test and live log.

## Close the program

- [ ] Report the verified phase.

## Appendix A. Prototype evidence

None.
`;
  const validResult = validate(valid, "valid");
  if (validResult.problems.length > 0) throw new Error(validResult.problems.join("\n"));

  const invalid = valid.replace("**Verify, live.**", "**Verify, missing.**");
  const invalidResult = validate(invalid, "invalid");
  if (invalidResult.problems.length === 0) throw new Error("invalid fixture unexpectedly passed");

  const contradictory = valid.replace(
    "**Authority.** None. The phase stays local.",
    "**Authority.** None. The phase stays local.\n- [ ] Publish the result.",
  );
  const contradictoryResult = validate(contradictory, "contradictory");
  if (contradictoryResult.problems.length === 0) throw new Error("contradictory fixture unexpectedly passed");
  console.log("check-plan self-test passed");
}

if (process.argv[2] === "--self-test") {
  selfTest();
  process.exit(0);
}

const file = process.argv[2];
if (!file) {
  console.error("Usage: node check-plan.mjs <plan.md>");
  process.exit(2);
}

const result = validate(readFileSync(file, "utf8"), file);
for (const summary of result.summaries) console.log(summary);
console.log(`${result.summaries.length} phase sections, ${result.problems.length} problems`);
for (const problem of result.problems) console.error(problem);
process.exit(result.problems.length === 0 ? 0 : 1);

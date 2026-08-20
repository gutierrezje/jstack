---
name: reflect
description: "Spawn three parallel review subagents over the active transcript, surface learnings, and route each to a concrete edit on an existing skill. Use when the user says reflect."
---

# Reflect

Extract durable lessons from the current completed task and route each accepted lesson to structure.

Read [the global routing table](../jesus-mode/references/routes.md) before dispatching. Inspect the current subagent tool's supported model and effort overrides; never silently inherit the parent after a pinned-model rejection.

1. Establish the evidence set: current task, plan, diffs, test output, decision log, and linked artifacts. Do not scan guessed transcript paths.
2. Spawn a Luna High tooling reviewer and a Terra High judgment reviewer in read-only posture. Add a divergent reviewer only for long or high-stakes work.
3. Ask each reviewer for evidence-backed Keep, Change, and Backlog findings with exact destinations.
4. Have the parent synthesize duplicates and reject findings unsupported by task evidence. Use one Sol High advisor only when the parent needs stronger judgment.
5. Present Accepted, Rejected, and Backlog items. Obtain approval before editing global skills or instructions.
6. Route approved edits through `$skill-creator` and `$writing-for-agents`; route recurring tooling gaps into checks, scripts, or tracked backlog.
7. Validate every edited skill and report applied, rejected, and deferred lessons.

Completion means every accepted lesson has one durable destination and every rejected lesson has an evidence-based reason.

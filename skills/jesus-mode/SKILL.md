---
name: jesus-mode
description: "Default workflow for features, bug fixes, investigations, issue triage, and PRs. Jesus mode/pstack."
---

# Jesus mode

Stay active across turns in the current task until the user opts out. Activate mid-conversation once a question turns into investigating or changing code. Apply rigor when the request is non-trivial; stay direct for tiny work.

Complete the requested outcome through implementation, relevant verification, and repair. Continue while safe, in-scope work remains. Ask only for material product choices, ambiguous destructive targets, or new external authority.

For substantial work, read the closest matching playbook below and the
[principles index](references/principles-index.md) before settling the approach.
Use the playbook to shape execution and verification, and name it once in a
progress update. Use the index to select principle leaves before consequential
choices about data models, boundaries, shared state, failure handling, or
verification. Work directly on tiny tasks or when no playbook fits. Use a plan
when dependencies or uncertainty need tracking. A user-requested planning
deliverable remains planning-only.

## Prepare evidence before implementation

Before reproducing a bug or starting implementation, follow
[existing journey discovery](references/verification.md#discover-and-select-existing-journeys).
Identify matching executable scenarios and remaining coverage gaps before choosing
UI actions or new test helpers. Select the evidence needed to review the change. Apply the [PR evidence rules](../open-pr/SKILL.md#evidence-rules)
now, even when the user has not yet requested a PR. This prepares local evidence;
publishing still requires the authority defined by the PR workflow.

When the user requests video or the claim depends on interaction over time,
follow the [video evidence contract](references/video-evidence.md) alongside the
screenshot path below. Establish the selected recorder before exercising the
affected journey.

For UI work, establish a working screenshot path before changing the affected
behavior: identify the target checkout and runtime, use the project's verifier
or available UI-control tools, open the relevant journey, and save and inspect
a baseline capture. Use [$setup-test-environment](../setup-test-environment/SKILL.md)
when launch setup is needed. Record the viewport, theme, account label, and
fixture needed to reproduce the state. Capture the existing state when it is
useful for comparison; new UI needs captures of its implemented states.

Save screenshots in a task-owned scratch directory outside tracked source as
each affected state is exercised during implementation and verification. Follow
the [evidence storage and cleanup rules](../open-pr/SKILL.md#evidence-storage-and-cleanup).
Keep a compact record of artifact paths, journeys, observed
results, and the revision or dirty checkout that produced them. Refresh affected
captures after repairs and retain the record through handoffs or compaction so
PR preparation can reuse valid evidence. Use tests, logs, or measurements for
changes without a visible UI effect.

Resolve capture setup problems early within existing authority. If access or
another dependency prevents capture, report the exact gap when discovered and
continue independent work; keep it visible until resolved.

## Load when needed

- On Claude Code, read [claude-compatibility.md](references/claude-compatibility.md) before any other reference; it overrides codex-compatibility.md, including sections reached through anchored links.
- For executable code changes or PR work, read and follow [diffowl.md](references/diffowl.md). Preserve cumulative review coverage and avoid duplicate reviews.
- Before any PR create or edit, read [$open-pr](../open-pr/SKILL.md). Use [$babysit-pr](../babysit-pr/SKILL.md) when the user asks to babysit, shepherd, or finish a PR. Those skills retain their authorization and completion requirements.
- When the user asks to merge, release, deploy, or clean up branches or worktrees, use [$ship](../ship/SKILL.md) for the selected phases and their evidence.
- Before any subagent call, including reviewers requested by other skills, read [routes.md](references/routes.md) and the delegation sections of [codex-compatibility.md](references/codex-compatibility.md). Delegate when an independent question or disjoint work unit benefits from it.
- Read the relevant [codex-compatibility.md](references/codex-compatibility.md) section when using ported Cursor mechanics, GitHub operations, or task history.
- Use [related task context](references/codex-compatibility.md#related-task-context) when the user refers to prior work or a missing earlier decision affects the task.
- Before reporting or acting on measured performance, follow [$benchmark-checklist](../benchmark-checklist/SKILL.md). Keep correctness and completed-work counts with the timing evidence.
- Write plainly: lead with the result, use concrete verbs, and omit filler. Use [$unslop](../unslop/SKILL.md) for a prose-editing pass.

## Playbooks

- `investigation`: [playbooks/investigation.md](playbooks/investigation.md)
- `bug-fix`: [playbooks/bug-fix.md](playbooks/bug-fix.md)
- `perf-issue`: [playbooks/perf-issue.md](playbooks/perf-issue.md)
- `hillclimb`: [playbooks/hillclimb.md](playbooks/hillclimb.md)
- `runtime-forensics`: [playbooks/runtime-forensics.md](playbooks/runtime-forensics.md)
- `trace-forensics`: [playbooks/trace-forensics.md](playbooks/trace-forensics.md)
- `feature`: [playbooks/feature.md](playbooks/feature.md)
- `refactoring`: [playbooks/refactoring.md](playbooks/refactoring.md)
- `prototype`: [playbooks/prototype.md](playbooks/prototype.md)
- `visual-parity`: [playbooks/visual-parity.md](playbooks/visual-parity.md)
- `authoring-a-skill`: [playbooks/authoring-a-skill.md](playbooks/authoring-a-skill.md)
- `eval`: [playbooks/eval.md](playbooks/eval.md)
- `babysit`: [playbooks/babysit.md](playbooks/babysit.md)
- `shipping`: [playbooks/shipping.md](playbooks/shipping.md)
- `autonomous-run`: [playbooks/autonomous-run.md](playbooks/autonomous-run.md)
- `orchestrate`: [playbooks/orchestrate.md](playbooks/orchestrate.md)
- `autopilot-full`: [playbooks/autopilot-full.md](playbooks/autopilot-full.md)
- `autopilot-stack`: [playbooks/autopilot-stack.md](playbooks/autopilot-stack.md)
- `session-pickup`: [playbooks/session-pickup.md](playbooks/session-pickup.md)
- `pause-safely`: [playbooks/pause-safely.md](playbooks/pause-safely.md)
- `multi-phase-plan`: [playbooks/multi-phase-plan.md](playbooks/multi-phase-plan.md)
- `worktree-cleanup`: [playbooks/worktree-cleanup.md](playbooks/worktree-cleanup.md)

## Completion

Finish when the requested outcome works on the relevant surface, required checks and reviews cover the final change, and no known in-scope repair remains. Verify child results against their artifacts. Report the outcome, evidence, and material gaps or risks. For code-changing work, finish the required DiffOwl checkpoint or report its exact coverage gap. PR work must meet the selected PR skill's completion criteria.

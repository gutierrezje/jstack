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
progress update. Use the index to select principle guides before consequential
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
- When the user asks to merge, release, deploy, close or reconcile issues after delivery, or clean up branches or worktrees, use [$ship](../ship/SKILL.md) for the selected phases and their evidence.
- Before any subagent call, including reviewers requested by other skills, read [routes.md](references/routes.md) and the delegation sections of [codex-compatibility.md](references/codex-compatibility.md). Delegate when an independent question or disjoint work unit benefits from it. Brief implementation children with [poteto-agent.md](references/poteto-agent.md).
- Read the relevant [codex-compatibility.md](references/codex-compatibility.md) section when using ported Cursor mechanics, GitHub operations, or task history.
- Use [related task context](references/codex-compatibility.md#related-task-context) when the user refers to prior work or a missing earlier decision affects the task.
- Before reporting or acting on measured performance, follow [benchmark-checklist.md](references/benchmark-checklist.md). Keep correctness and completed-work counts with the timing evidence.
- Write plainly: lead with the result, use concrete verbs, and omit filler. Use [$unslop](../unslop/SKILL.md) for a prose-editing pass. For docs, RFCs, readmes, PR descriptions, or commit messages, follow [technical-writing.md](references/technical-writing.md).

## Playbooks

Read the playbook whose trigger matches the task.

- [investigation](playbooks/investigation.md): an open question about behavior or code, answered with evidence before any change.
- [bug-fix](playbooks/bug-fix.md): a reported defect or failing behavior.
- [perf-issue](playbooks/perf-issue.md): a slow path or resource regression on a user-visible flow.
- [hillclimb](playbooks/hillclimb.md): improving one metric through repeated measured experiments.
- [runtime-forensics](playbooks/runtime-forensics.md): a live symptom that needs instrumentation to explain.
- [trace-forensics](playbooks/trace-forensics.md): diagnosing from an existing trace, profile, or capture.
- [feature](playbooks/feature.md): new user-facing behavior.
- [refactoring](playbooks/refactoring.md): restructuring without changing observable behavior.
- [prototype](playbooks/prototype.md): a throwaway build to settle a design decision.
- [visual-parity](playbooks/visual-parity.md): matching UI to a reference image or design.
- [authoring-a-skill](playbooks/authoring-a-skill.md): creating or editing a skill or agent instructions.
- [eval](playbooks/eval.md): comparing models, prompts, or workflows with graded runs.
- [babysit](playbooks/babysit.md): carrying an existing PR through review and CI.
- Merging, releasing, reconciling delivery issues, or cleanup: use [$ship](../ship/SKILL.md).
- [autonomous-run](playbooks/autonomous-run.md): unattended iterative work toward a binary exit condition.
- [orchestrate](playbooks/orchestrate.md): a multi-track program run by parallel children with a durable ledger.
- [autopilot-full](playbooks/autopilot-full.md): an authorized queue of independent PRs, built and merged end to end.
- [autopilot-stack](playbooks/autopilot-stack.md): a dependent PR stack built for the operator to land.
- [session-pickup](playbooks/session-pickup.md): resuming prior work from a task, branch, PR, or checkpoint.
- [pause-safely](playbooks/pause-safely.md): stopping mid-task at a verifiable, resumable boundary.
- [multi-phase-plan](playbooks/multi-phase-plan.md): work large enough to need a durable phased plan.
- [worktree-cleanup](playbooks/worktree-cleanup.md): auditing and removing stale worktrees and branches.

## Completion

Finish when the requested outcome works on the relevant surface, required checks and reviews cover the final change, and no known in-scope repair remains. Verify child results against their artifacts. Report the outcome, evidence, and material gaps or risks. For code-changing work, finish the required DiffOwl checkpoint or report its exact coverage gap. PR work must meet the selected PR skill's completion criteria.

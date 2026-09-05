---
name: jesus-mode
description: "Use for Jesus mode, pstack, or Poteto mode requests to carry software work through implementation, verification, and review."
---

# Jesus mode

Stay active across turns in the current task until the user opts out. Apply rigor when the request is non-trivial; stay direct for tiny work.

Complete the requested outcome through implementation, relevant verification, and repair. Continue while safe, in-scope work remains. Ask only for material product choices, ambiguous destructive targets, or new external authority.

For substantial work, strongly prefer starting with the matching playbook and relevant principles before settling the approach. Read the closest playbook below and use its guidance to shape execution and verification. Adapt the sequence to the task and repository evidence; work directly when no playbook fits. Use a plan when it helps manage dependencies or uncertainty. A user-requested planning deliverable remains planning-only.

## Load when needed

- For executable code changes or PR work, read and follow the [DiffOwl coverage contract](references/diffowl.md). Preserve cumulative review coverage and avoid duplicate reviews.
- For PR creation or presentation updates, use [$open-pr](../open-pr/SKILL.md). Use [$babysit-pr](../babysit-pr/SKILL.md) when the user asks to babysit, shepherd, or finish a PR. Those skills retain their authorization and completion requirements.
- Before delegating, read [global routes](references/routes.md) and the delegation sections of the [Codex compatibility contract](references/codex-compatibility.md). Delegate when an independent question or disjoint work unit benefits from it.
- Read the relevant compatibility section when using ported Cursor mechanics, GitHub operations, or task history.
- Use [related task context](references/codex-compatibility.md#related-task-context) when the user refers to prior work or a missing earlier decision affects the task.
- For substantial work, consult the [principles index](references/principles-index.md) early and read the leaves relevant to the task. Use them before consequential choices about data models, boundaries, shared state, failure handling, or verification. Revisit the relevant principle when new evidence changes the approach. Explain the principles that materially changed a decision; keep unrelated leaves unloaded.
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

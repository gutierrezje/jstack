---
name: jesus-mode
description: "Jstack's default rigorous workflow for concise, deliberate, verified software work and reviewable results. Use for jesus mode, /jesus-mode, Jstack, pstack, Poteto mode, or general requests for a rigorous engineering workflow."
---

# Jesus mode

Stay active across turns in the current task until the user opts out. Apply rigor when the request is non-trivial; stay direct for tiny work.

1. Read [the principles index](references/principles-index.md), [global routes](references/routes.md), and [Codex compatibility contract](references/codex-compatibility.md). For executable code changes or PR work, also read the [DiffOwl coverage contract](references/diffowl.md).
2. On the first non-trivial turn in a new task, run the [related task context](references/codex-compatibility.md#related-task-context) process before choosing a playbook. Carry forward only context that bears on the current request.
3. Match exactly one primary implementation playbook below. Read it completely and copy its steps into `update_plan`; retain skipped steps with a reason. For executable code changes, append one DiffOwl checkpoint from the shared coverage contract.
4. Read every triggered `principle-*` leaf skill before applying it. Name only principles that change a decision.
5. Route specialized steps to the separate skills: `$how`, `$why`, `$architect`, `$arena`, `$swarm`, `$interrogate`, `$no-comments`, `$show-me-your-work`, and `$pstack-tdd`.
6. Treat publishing as a closing stage, not a competing playbook. Before creating a PR or changing its title, body, or evidence, read `$open-pr` completely, append its workflow to the active plan, and reach its completion criteria. During Babysit, return to the active babysit loop after any Open PR work instead of starting another run.
7. Make reversible progress inside the active authorization boundary. Ask only for material product choices, ambiguous destructive targets, or new external authority.
8. Verify the real artifact, review child work and diffs, and finish with outcome, evidence, risks, and intentionally omitted fan-out. After a human correction or review finding, apply the correction loop from the DiffOwl contract when that contract is active.

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

Finish when every playbook step is completed or explicitly disposed, the requested outcome is observed on the real surface, and no child result is accepted solely from self-report. For code-changing work, finish the required DiffOwl checkpoint or report its exact coverage gap. A task that creates or updates a PR remains incomplete until `$open-pr` reaches its completion criteria.

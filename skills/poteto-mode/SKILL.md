---
name: poteto-mode
description: "poteto's agent style for concise, detailed responses, deliberate subagents, unslopped prose, simple code, and verified work. Use for poteto, /poteto-mode, or requests to work in this style."
---

# Poteto mode

Stay active across turns in the current task until the user opts out. Apply rigor when the request is non-trivial; stay direct for tiny work.

1. Read [the principles index](references/principles-index.md), [global routes](../jstack/references/routes.md), and [Codex compatibility contract](../jstack/references/codex-compatibility.md).
2. Match exactly one primary playbook below. Read it completely and copy its steps into `update_plan`; retain skipped steps with a reason.
3. Read every triggered `principle-*` leaf skill before applying it. Name only principles that change a decision.
4. Route specialized steps to the separate skills: `$how`, `$why`, `$architect`, `$arena`, `$swarm`, `$interrogate`, `$no-comments`, `$show-me-your-work`, and `$pstack-tdd`.
5. Make reversible progress inside the active authorization boundary. Ask only for material product choices, ambiguous destructive targets, or new external authority.
6. Verify the real artifact, review child work and diffs, and finish with outcome, evidence, risks, and intentionally omitted fan-out.

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
- `opening-a-pr`: [playbooks/opening-a-pr.md](playbooks/opening-a-pr.md)

## Completion

Finish when every playbook step is completed or explicitly disposed, the requested outcome is observed on the real surface, and no child result is accepted solely from self-report.

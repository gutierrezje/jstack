# Multi-phase plan

1. Skip the plan when the change is one or two files with an obvious approach, unless the user explicitly asked for a durable plan.
2. Settle testable forks with a prototype or focused investigation before sequencing downstream work. Ask only for product or preference choices that evidence cannot settle.
3. Read and follow the [verified plan contract](../references/plan.md). Use one section per independently useful phase or PR, with dependencies, file boundaries, observable results, verification, review gates, and authority gates.
4. Choose the execution playbook explicitly. Use `autopilot-full` only when the user granted landing authority, `autopilot-stack` when the user owns landing, and `orchestrate` for a standing program.
5. Run `node skills/jesus-mode/scripts/check-plan.mjs <plan.md>` and fix every reported structural problem.
6. Return the plan path and checker output, then stop. Execution starts only on the user's explicit go.

Completion: another agent can execute each phase without reopening settled decisions, every phase has a binary proof, and the plan checker exits cleanly.

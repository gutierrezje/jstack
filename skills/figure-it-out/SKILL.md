---
name: figure-it-out
description: "Design an auditable playbook when no narrower one fits: a large migration, an ambitious multi-part change, or work a human reviews after stepping away. Scales rigor to the task, runs a hypothesis loop, and logs decisions via show-me-your-work. Use for /figure-it-out, 'figure it out', a large migration, or when no narrower playbook applies."
---

# Figure it out

Design a rigorous playbook when no bundled Poteto playbook fits.

1. Define the observable end state, constraints, authorization boundary, and evidence required for trust.
2. Inventory the work, dependencies, destructive edges, and unknowns before sequencing.
3. Choose relevant pstack principles and direct skills. Use `$architect`, `$arena`, or `$swarm` only when their extra contexts earn their cost.
4. Write an `update_plan` sequence of verifiable units. Each unit names owner, scope, proof, and stop condition.
5. Execute the first unit as a tracer bullet. Revise the playbook from evidence before scaling.
6. Finish every unit or mark it failed/blocked with evidence, then verify the integrated end state.

Completion means the bespoke playbook is auditable, every unit ends in proof, and the requested end state is observed.

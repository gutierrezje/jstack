---
name: correct
description: "Fix recurring repository mistakes with architecture, types, checks, or behavioral tests."
disable-model-invocation: true
---

# Correct

Find recurring mistakes in the requested repository and prevent them at the strongest practical level. Keep changes within the user's scope and authority.

1. Read relevant commits, reverts, reviews, repository instructions, and workaround comments. Group evidenced mistakes into classes; two occurrences establish a recurring class. Recover related chat evidence only through [the task-context contract](../jesus-mode/references/codex-compatibility.md#related-task-context).
2. Try architecture first: one owner for each state, one supported path for each task, inaccessible internals, and derived lists. Use [Architect](../architect/SKILL.md) when the remedy changes a boundary.
3. If architecture cannot prevent the mistake, encode the invariant in types, then consider a focused lint or CI check whose error names the supported alternative. A widespread existing pattern can use a check that rejects new instances while callers migrate.
4. Test observable behavior through [Test Behavior, Not Implementation](../jesus-mode/references/principles/test-behavior-not-implementation.md). Use documentation for the judgment that enforcement cannot settle.
5. Fix the highest-value classes in coherent units. Prove each new check fails on a disposable reproduction of a real past mistake, then passes on the repair. Run the applicable repository checks. Configure CI only within the requested scope; report remote execution separately from a local pass.
6. When repository instructions need a rule, pair it with the mechanism that enforces it. Remove redundant prose once structure fully expresses the constraint. Honor existing exception and approval policy.

Report each class, its evidence, the chosen enforcement level, why a stronger level did not work, and the observed before/after check. This workflow supplies no additional authority to publish, change accounts, or widen the task.

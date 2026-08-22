---
name: pstack-tdd
description: "Use only when the user explicitly asks for TDD, a failing test, or a regression test, OR when the bug has an obvious cheap local test target. Skip when the test path is unclear, expensive, integration-heavy, or not requested."
---

# Pstack TDD

Read the [DiffOwl coverage contract](../jesus-mode/references/diffowl.md) and
complete its checkpoint after the green implementation forms a coherent unit.

1. Find the cheapest test surface that reproduces the requested behavior.
2. Write one focused test and run it red. If a reliable red test would cost more than the fix or cannot express the failure, state why and use the nearest runtime proof.
3. Implement the smallest root-cause change that makes the test green.
4. Refactor only after green, preserving the observed behavior.
5. Run the focused test, nearby regression tests, and required repository checks.

Completion means the failure was observed before the fix and the same proof passes afterward, or the explicit runtime substitute records both states.

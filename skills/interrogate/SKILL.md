---
name: interrogate
description: "Use for \"interrogate\", \"adversarial review\", \"multi-model review\", \"challenge this\", \"stress test this code\", \"find blind spots\", or \"tear this apart\". Multiple LLM reviewers challenge changes from independent angles."
---

# Interrogate

Try to break a diff through independent adversarial review.

Read [the global routing table](../jesus-mode/references/routes.md) before dispatching. Inspect the current subagent tool's supported model and effort overrides; never silently inherit the parent after a pinned-model rejection.

1. Freeze the scope, intended behavior, diff, tests, and hard constraints.
2. Spawn two read-only reviewers by default: Luna Max for concrete correctness and Terra High for architecture and edge cases. Add Sol High for high-risk or contested changes.
3. Give every reviewer `references/reviewer-prompt.md`, `references/rubric.md`, and one distinct lens. Keep findings independent until collection.
4. Deduplicate by root cause. Verify each candidate finding against code or a reproducer; reject style-only noise unless it exposes maintainability risk covered by the rubric.
5. Return confirmed findings ordered by severity, rejected claims with reasons, residual risks, and a ship/block judgment.

Completion means every reported finding has a concrete failure mechanism and location, or is labeled unverified.

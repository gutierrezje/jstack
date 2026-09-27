# Bug fix

1. Reproduce the symptom on the real surface or record why the environment prevents it.
2. Trace the failure and test plausible causes against runtime evidence. Use $how for unresolved ownership or $why when historical rationale affects the fix.
3. Confirm the root-cause mechanism before design. Use $architect when the fix requires an unresolved boundary decision.
4. Write a red regression test when a cheap faithful test exists.
5. Implement the smallest root-cause fix, then verify the original reproducer and regression checks.
6. Review the diff and report cause, change, before/after evidence, and residual risk.

Completion: the original failure is observed before, absent after, and explained by the confirmed mechanism.

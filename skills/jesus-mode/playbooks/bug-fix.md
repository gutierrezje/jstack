# Bug fix

1. Reproduce the symptom on the real surface or record why the environment prevents it.
2. Form competing causes, trace with $how and relevant history with $why, then eliminate them using runtime evidence.
3. Confirm one root-cause mechanism before design. Use $architect only when the fix crosses a durable boundary.
4. Write a red regression test when a cheap faithful test exists.
5. Implement the smallest root-cause fix, then verify the original reproducer and regression checks.
6. Review the diff and report cause, change, before/after evidence, and residual risk.

Completion: the original failure is observed before, absent after, and explained by the confirmed mechanism.

# Autonomous run

1. Define a binary exit condition, scope, budget, authority, checkpoints, and stop conditions.
2. Break work into verifiable iterations and keep a $show-me-your-work trail.
3. Execute one iteration at a time, verifying before the next and adapting from evidence. Own mid-run discoveries that support the goal (flaky verifiers, broken tooling, related bugs); put out-of-band fixes in their own PR and return to the exit condition.
4. Use Codex automation only when the user requested recurring monitoring; otherwise use the current task and bounded waits.
5. Stop on completion, exhausted budget, new required authority, or a genuine blocker. Leave a durable checkpoint before compaction.

Completion: the exit condition is observed or the handoff names the exact unmet predicate and evidence.

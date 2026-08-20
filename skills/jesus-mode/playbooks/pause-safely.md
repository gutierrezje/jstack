# Pause safely

1. Stop at a verifiable boundary; do not interrupt a destructive or half-applied operation.
2. Capture git status, branch/head, changed files, commands/results, active agents, open gates, and next unmet predicate.
3. Save a durable checkpoint at an explicit user-visible path. Commit only when authorized and appropriate.
4. Leave the workspace recoverable: preserve WIP, exact commands, artifact paths, and any cleanup needed.
5. Report the checkpoint path and how a cold agent should resume.

Completion: a new task can resume without guessing or repeating completed work.

# Autopilot full

1. Confirm explicit authority for creating, updating, and merging the exact PR queue.
2. Assign one owner per independent PR with isolated branch/worktree scope and full build-to-green responsibility.
3. Run owners in bounded parallel waves; serialize overlapping files and dependent work.
4. At each merge-ready SHA, run independent verification lanes for gates, real-surface behavior, and diff/receipt audit.
5. Return findings to the owner, invalidate old verdicts after any change, and merge only after a fresh clean root verdict.
6. At each audit, re-read this playbook from the current trunk when available and the durable program plan. Judge progress by observable state changes such as commits, pushed heads, PR or check deltas, and evidence receipts. Inspect any lane that exceeds its expected runtime without one; interrupt and replace it when it is stuck.
7. Use bounded waits while the task is active. Create a heartbeat only when the user explicitly requested recurring monitoring. Keep the decision trail current across every audit.

Completion: every authorized PR is merged at a verified SHA or stopped with a documented gate.

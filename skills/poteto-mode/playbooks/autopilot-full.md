# Autopilot full

1. Confirm explicit authority for creating, updating, and merging the exact PR queue.
2. Assign one owner per independent PR with isolated branch/worktree scope and full build-to-green responsibility.
3. Run owners in bounded parallel waves; serialize overlapping files and dependent work.
4. At each merge-ready SHA, run independent verification lanes for gates, real-surface behavior, and diff/receipt audit.
5. Return findings to the owner, invalidate old verdicts after any change, and merge only after a fresh clean root verdict.
6. Audit live state between waves and leave a durable decision trail.

Completion: every authorized PR is merged at a verified SHA or stopped with a documented gate.

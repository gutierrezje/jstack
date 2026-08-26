# Babysit

1. Declare mode: status-only, fix-to-green, or monitor. An explicit request to babysit, shepherd, or finish selects fix-to-green and authorizes verified in-scope repairs, commits, non-force pushes, resolution of cleared review threads, and moving a verified draft to ready. A narrower request limits that authority.
2. Read and follow `$jstack:babysit-pr` completely. It is the source of truth for snapshots, review coverage, repairs, project verification skills, hosted checks, evidence receipts, and the final verdict.
3. When Jesus mode selected this playbook automatically, do not inherit the push, thread-resolution, or draft-transition authority that only an explicit babysit, shepherd, or finish request grants.
4. If another specialized skill is needed for a repair or real-surface check, use it inside the same task and return to `$jstack:babysit-pr` for current-head acceptance. Do not create or manage extra user-visible tasks unless the user asks.
5. Use Codex CI/GitHub workflows or recurring automation for requested monitoring; do not build a sleep loop. Never merge without explicit authority.

Completion: `$jstack:babysit-pr` reaches its completion criteria for one exact current head.

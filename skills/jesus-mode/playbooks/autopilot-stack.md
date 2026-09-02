# Autopilot stack

1. Confirm authority to create/update the stack and that the operator, not agents, owns landing.
2. Define one linear dependency order and one owner per slice with isolated branch/worktree scope.
3. Build in bounded parallel where dependencies permit; keep one coordinator as the only topology writer.
4. At each audit, re-read this playbook from the current trunk when available and the durable program plan. Judge progress by commits, pushed heads, PR or check deltas, and evidence receipts. Inspect any lane that exceeds its expected runtime without one; interrupt and replace it when it is stuck. Use a heartbeat only when the user explicitly requested recurring monitoring.
5. Independently verify each head SHA and invalidate verdicts after restacks or effective diff changes.
6. Use Graphite only when installed and requested; otherwise maintain explicit GitHub base branches.
7. Deliver one reviewable bottom-up chain with verification evidence and no auto-merge armed.

Completion: the operator receives a coherent verified stack and no agent has landed it.

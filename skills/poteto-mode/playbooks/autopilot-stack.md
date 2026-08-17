# Autopilot stack

1. Confirm authority to create/update the stack and that the operator, not agents, owns landing.
2. Define one linear dependency order and one owner per slice with isolated branch/worktree scope.
3. Build in bounded parallel where dependencies permit; keep one coordinator as the only topology writer.
4. Independently verify each head SHA and invalidate verdicts after restacks or effective diff changes.
5. Use Graphite only when installed and requested; otherwise maintain explicit GitHub base branches.
6. Deliver one reviewable bottom-up chain with verification evidence and no auto-merge armed.

Completion: the operator receives a coherent verified stack and no agent has landed it.

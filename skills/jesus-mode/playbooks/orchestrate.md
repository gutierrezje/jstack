# Orchestrate

1. Define program outcomes, tracks, dependency graph, authority, budgets, and durable state path.
2. Maintain one coordinator-owned ledger of units, owners, status, artifacts, head SHAs, verdicts, and gates.
3. Run bounded waves under the current agent-slot limit. Prefer fewer broad units; use one writer per branch/worktree.
4. Drain children into summaries and artifacts, then recompute the frontier. Never assume survival across restart.
5. Verify each unit independently before integration. External PR and merge actions require explicit authority.
6. Checkpoint at wave boundaries and resume from the ledger plus live git/PR state.

Completion: every unit is verified, failed, blocked, or deferred; the durable frontier matches live state.

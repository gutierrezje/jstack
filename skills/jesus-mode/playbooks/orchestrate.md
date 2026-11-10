# Orchestrate

You run the program, never the code. Decide which agent does each piece of work, then check what each one produces.

1. Define program outcomes, tracks, dependency graph, authority, budgets, and durable state path. Work one agent could finish inside the session budget is not a program; use `autonomous-run`.
2. Maintain one coordinator-owned ledger of units, owners, status, artifacts, head SHAs, verdicts, and gates.
3. Name each unit's evidence in its kickoff: the goal, the paths the worker may and may not write, the actions it must not take, and a command, control-skill check, or artifact that proves it done. A unit without nameable evidence is not scoped yet. Choose each child's model and fan-out from [routes.md](../references/routes.md).
4. Start with one unit. Take it through kickoff, owner, verifier, and merge before fanning out, so a flawed kickoff costs one agent.
5. Run bounded waves under the current agent-slot limit. Use one owner per PR as the only writer of its branch, a fresh worker for each independent task with upstream reports pasted into its kickoff, and a sub-coordinator only when one area has many parallel workers (at most three levels). Fork a worker only when new work needs its built state. Message a worker only to follow up on the same work, never to check on it.
6. Drain children into summaries and artifacts, then recompute the frontier. Never assume survival across restart. Account for every spawned child as done, replaced, or absorbed.
7. Verify each unit independently, with a verifier that did not write it. Read the diff or the artifact, not only the worker's summary. Green CI is an input to a verdict, not a verdict, and a verdict covers one head SHA. External PR and merge actions require explicit authority.
8. Check a PR's live state with the forge CLI before reporting on it. Judge a stalled worker by pushes and PR activity, not status text. Retry by cause (smaller scope after a context limit, same kickoff after a dropped connection, a different route after a tool error); after two retries, drop the unit and replan. Check a late result against current PR state before accepting it.
9. Send back work that drifts from scope. Fix only what blocks the program and park the rest as follow-ups.
10. Ask the user only for an irreversible action, a product or preference call no experiment settles, or a dead end that survived a replan. Rebase mechanics, retries, CI flakes, and review triage stay with you.
11. Checkpoint at wave boundaries and resume from the ledger plus live git/PR state.

Reply: what landed against the goal, each PR's live state and verdict with its link, what was dropped and why, and the decisions waiting on the user.

Completion: every unit is verified, failed, blocked, or deferred; the durable frontier matches live state.

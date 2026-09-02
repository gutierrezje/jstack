---
name: swarm
description: "Fan out N parallel workers, drain them, and return one report. Use for /swarm, 'swarm this', or parallel coverage, races, gauntlets, and exploration."
---

# Swarm

Read [the global routing table](../jesus-mode/references/routes.md) before
dispatching. Inspect the current subagent tool's supported model and effort
overrides; never silently inherit the parent after a pinned-model rejection.
When any lane verifies product behavior, read and follow the
[project verification contract](../jesus-mode/references/verification.md).

1. Define a matrix with every independent slice or race arm, work class, scope, write boundary, output, and verification.
2. Use the user's worker count when safe. Otherwise start with two and cap at three. Respect the current agent-slot limit.
3. Assign each arm its configured model and effort from the routing table. Keep mixed work at mixed efforts instead of flattening the whole swarm to one default. State every model and effort before dispatch.
4. Spawn bounded children without waiting between launches. Keep writers
   disjoint, use explicit worktrees when justified, or make lanes read-only.
   Give verification lanes separate run IDs, fixtures, ports, accounts, and
   artifact directories unless shared state is the behavior under test.
5. Track workers in `update_plan`. Drain with bounded waits and follow up only on a named evidence gap.
6. Require each verification lane to return its receipt path. Read the receipts,
   confirm target identities, and validate reports against artifacts and command
   results. Return one aggregate with the matrix, evidence, contradictions,
   failures, and parent judgment. Serialize same-machine performance trials
   unless concurrency is the workload.

Completion means every matrix cell has a verified result or an explicit failed/blocked disposition. Internal children share the workspace and are not cloud-isolated.

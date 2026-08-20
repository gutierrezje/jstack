# Multi-phase plan

1. Define the target architecture or outcome, constraints, and acceptance evidence.
2. Partition phases by durable boundaries; each phase must leave a usable, verifiable state.
3. Name files/surfaces, owner model, dependencies, migration/deletion work, verification, and rollback for every phase.
4. Prototype or investigate unresolved forks before sequencing downstream phases.
5. Mark external actions and destructive steps with their required authority.
6. Start with the smallest tracer phase and revise later phases from evidence.

Completion: another agent can execute each phase without reopening settled decisions, and every phase has a binary proof.

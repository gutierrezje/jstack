# Feature

1. Name the user outcome, core data shape, invariants, and boundaries before code.
2. Use $how for unfamiliar ownership and $architect for a new durable boundary.
3. Build one vertical tracer slice that reaches the real surface.
4. Establish a throughput checkpoint: list remaining units, verification per unit, and whether delegation helps.
5. Implement in small verifiable units, keeping compatibility work only when it belongs in the final design.
6. Prove the feature on the real surface and run repository checks.

Completion: the user-visible outcome works end to end and the maintained design encodes its invariants.

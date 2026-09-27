# Feature

1. Name the user outcome, core data shape, invariants, and boundaries before code.
2. Trace ownership and choose boundaries from callers and nearby conventions. Use $how when ownership remains unclear or $architect when a new boundary needs explicit design.
3. Build one vertical tracer slice that reaches the real surface.
4. For multi-part work, track remaining units and their verification; delegate when a disjoint unit benefits from it.
5. Implement in small verifiable units, keeping compatibility work only when it belongs in the final design.
6. Prove the feature on the real surface and run repository checks.

Completion: the user-visible outcome works end to end and the maintained design encodes its invariants.

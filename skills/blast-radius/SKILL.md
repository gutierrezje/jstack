---
name: blast-radius
description: "Find what a change could break somewhere else before it ships, beyond the diff, and prove the one fact it's safe because of by running real code instead of writing it up. Use for 'blast radius of X', 'what could this break', or reviewing a small diff you don't trust."
---

# Blast radius

1. State the proposed change and the invariant that should remain true.
2. Trace direct callers, reverse dependencies, data contracts, persisted formats, concurrency, configuration, public APIs, and operational consumers beyond the diff.
3. Partition independent surfaces into read-only checks; use `$how` for behavior and `$why` for historical constraints.
4. Identify the one load-bearing fact that makes the change safe and prove it by running code, a focused test, or a real artifact.
5. Report affected surfaces, proven-safe surfaces, unknowns, required regression checks, and rollout risks.

Completion means the safety claim is demonstrated rather than asserted, and every plausible downstream consumer has a disposition.

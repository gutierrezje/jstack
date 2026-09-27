---
name: how
description: "Explain subsystem architecture, runtime flow, or code ownership when asked how code works or where a change belongs. Use why for historical rationale."
---

# How

Explain how a subsystem works from code and runtime evidence.

Trace directly when the question is contained. Before delegating, read
[the global routing table](../jesus-mode/references/routes.md) and follow its
dispatch and fallback rules.

1. Define the entry point, user-visible behavior, and questions to answer.
2. Delegate only when a separate subsystem or runtime lane benefits from independent investigation. Use the How explorer route and `references/explorer-prompt.md` for each bounded read-only assignment.
3. Trace control flow, data shape, state ownership, boundaries, failure paths, and relevant tests. Run focused probes when static reading cannot settle behavior.
4. Use the How explainer route only when the raw trace needs synthesis. Use the How critic routes only for consequential or disputed explanations.
5. Return a layered walkthrough with file links, a minimal flow diagram when useful, verified answers, and unknowns.

Completion means every claimed transition or ownership boundary points to code or observed runtime evidence.

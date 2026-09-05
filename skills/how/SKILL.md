---
name: how
description: "Explain subsystem architecture, runtime flow, or code ownership when asked how code works or where a change belongs. Use why for historical rationale."
---

# How

Explain how a subsystem works from code and runtime evidence.

Read [the global routing table](../jesus-mode/references/routes.md) before dispatching. Inspect the current subagent tool's supported model and effort overrides; never silently inherit the parent after a pinned-model rejection.

1. Define the entry point, user-visible behavior, and questions to answer.
2. Spawn one Luna High read-only explorer using `references/explorer-prompt.md`. Add a Terra High explorer only for a separate subsystem or runtime lane.
3. Trace control flow, data shape, state ownership, boundaries, failure paths, and relevant tests. Run focused probes when static reading cannot settle behavior.
4. Use one Terra High explainer only when the raw trace needs synthesis. Use critics only for consequential or disputed explanations.
5. Return a layered walkthrough with file links, a minimal flow diagram when useful, verified answers, and unknowns.

Completion means every claimed transition or ownership boundary points to code or observed runtime evidence.

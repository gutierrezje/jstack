---
name: how
description: "Use for \"how does X work\", code walkthroughs before changing something, and placement / ownership / layering questions (\"where should this live\", \"which package owns this\", \"is this the right layer\"). Explains subsystem architecture, runtime flow, onboarding mental models. Can critique architecture. Use why for motivation."
---

# How

Explain how a subsystem works from code and runtime evidence.

Read [the global routing table](../jstack/references/routes.md) before dispatching. Inspect the current subagent tool's supported model and effort overrides; never silently inherit the parent after a pinned-model rejection.

1. Define the entry point, user-visible behavior, and questions to answer.
2. Spawn one Luna High read-only explorer using `references/explorer-prompt.md`. Add a Terra High explorer only for a separate subsystem or runtime lane.
3. Trace control flow, data shape, state ownership, boundaries, failure paths, and relevant tests. Run focused probes when static reading cannot settle behavior.
4. Use one Terra High explainer only when the raw trace needs synthesis. Use critics only for consequential or disputed explanations.
5. Return a layered walkthrough with file links, a minimal flow diagram when useful, verified answers, and unknowns.

Completion means every claimed transition or ownership boundary points to code or observed runtime evidence.

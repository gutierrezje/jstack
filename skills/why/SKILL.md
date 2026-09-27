---
name: why
description: "Investigate design rationale, regressions, or historical decisions using available source history and connected evidence. Use how for runtime behavior."
---

# Why

Recover design rationale and historical forcing functions across available evidence lanes.

Investigate directly when local history can answer the question. Before
delegating independent evidence lanes, follow
[the global routing table](../jesus-mode/references/routes.md).

1. Define the target and decision window. Use `$how` instead when the question is runtime behavior rather than rationale.
2. Inspect local source history. Follow links or unresolved questions into relevant available sources, such as issues, design docs, or incident records.
3. Delegate when distinct evidence lanes benefit from independent investigation. Use the Why investigator route, the matching file under `references/sources/`, and `references/investigator-prompt.md` for bounded read-only assignments.
4. Treat empty searches and unavailable connectors as explicit coverage results.
5. Verify citations, distinguish documented fact from inference, and synthesize in the parent. Use the Why synthesizer route for one advisor only when consequential ambiguity needs it.
6. Lead with the answer and its sources. Add a timeline, alternatives, or implementation constraints when they help explain the decision or guide a change.

Completion means every rationale claim is cited or labeled inference, and relevant missing evidence is explicit.

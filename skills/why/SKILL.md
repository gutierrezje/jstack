---
name: why
description: "Use for 'why does X work this way', 'why we picked Y', design rationale, regressions, postmortems, or data-backed thresholds. Discovers available MCPs and queries each evidence category (source control, issue tracker, long-form docs, real-time chat, infrastructure observability, error tracking, product analytics warehouse) in parallel, then returns a cited read on decisions and tradeoffs. Use how for runtime behavior."
---

# Why

Recover design rationale and historical forcing functions across available evidence lanes.

Read [the global routing table](../jesus-mode/references/routes.md) before dispatching. Inspect the current subagent tool's supported model and effort overrides; never silently inherit the parent after a pinned-model rejection.

1. Define the target and decision window. Use `$how` instead when the question is runtime behavior rather than rationale.
2. Inventory actually available sources: git/GitHub, issue tracker, long-form docs, team chat, observability, error tracking, analytics, and incident records.
3. Always inspect source control locally. Spawn up to three Terra High read-only investigators for distinct available external categories, using the matching file under `references/sources/` and `references/investigator-prompt.md`.
4. Treat empty searches and unavailable connectors as explicit coverage results.
5. Verify citations, distinguish documented fact from inference, and synthesize in the parent. Use one Sol High advisor only for consequential ambiguity.
6. Return the answer, decision timeline, alternatives considered, current relevance, confidence, Sources Consulted, and Preserve/Change/Avoid/Risk constraints when code will change.

Completion means every rationale claim is cited or labeled inference, and every evidence category is found, empty, or explicitly unavailable.

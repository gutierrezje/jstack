---
name: architect
description: "Sketch types, signatures, and module structure before code, then stay in the loop while implementation fills in. Use for /architect, 'architect this', 'design this', or non-trivial work where jumping to code would lock in the wrong shape."
---

# Architect

Settle types, signatures, ownership, and module shape before implementation crosses a durable boundary.

Read [the global routing table](../jesus-mode/references/routes.md) before dispatching. Inspect the current subagent tool's supported model and effort overrides; never silently inherit the parent after a pinned-model rejection.

1. Read callers, callees, types, tests, and nearby conventions. Name the boundary and constraints.
2. Freeze a runner brief using `references/runner-prompt.md` and the red flags in `references/design-red-flags.md`.
3. Spawn two read-only candidates: Terra High and Sol High. Require concrete types, signatures, module ownership, migration shape, risks, and rejected alternatives.
4. Compare candidates against current call sites and invariants. Choose one design or synthesize explicitly.
5. Write the decision using `references/rationale-template.md` and stay available while implementation tests the design.

Completion means the implementer can write code without inventing a new boundary decision, and every affected caller has a migration path.

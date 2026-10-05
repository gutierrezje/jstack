---
name: architect
description: "Use when asked to design module boundaries, types, or interfaces before implementation."
disable-model-invocation: true
---

# Architect

Settle types, signatures, ownership, and module shape before implementation crosses a durable boundary.

Design directly when callers and invariants establish a clear boundary. Use
independent candidates when competing designs could materially change the
decision or the user requests a comparison. Before dispatching, follow
[the global routing table](../jesus-mode/references/routes.md).

1. Read callers, callees, types, tests, and nearby conventions. Name the boundary and constraints.
2. Specify types, signatures, module ownership, migration shape, and risks. Consult `references/design-red-flags.md` when evaluating a new boundary. Prefer a design whose ownership and imports make a locally plausible change correct across all consumers.
3. When comparing independent candidates, give read-only agents the same brief using `references/runner-prompt.md` and the Architect routes. Compare their designs against current call sites and invariants; choose one or explain the synthesis.
4. Record the decision at the level needed by the implementer. Use `references/rationale-template.md` when a durable rationale is useful or requested.

Completion means the implementer can write code without inventing a new boundary decision, and every affected caller has a migration path.

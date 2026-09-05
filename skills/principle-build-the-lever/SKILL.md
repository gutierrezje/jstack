---
name: principle-build-the-lever
description: "Use when repeated transformations or reproducible verification justify a reusable script, codemod, or generator."
---

# Build the lever

Use an existing tool when it fits. Build a small tool when repeated work or a difficult-to-reproduce check makes it cheaper or more reliable than direct execution. Handle ordinary one-off edits directly.

- For repeated transformations, establish the recipe on one representative unit. Compare the tool's result with that example before applying it broadly.
- Make mutating tools safe to rerun and verify the resulting diff.
- Keep a tool when future runs or reviewers need it. A temporary helper need not become a repository artifact.
- When delegating repeated work, share the recipe and write boundaries. A separate skill is useful only when the workflow will be reused.

For recurring rules that belong in lint or runtime checks, see [$principle-encode-lessons-in-structure](../principle-encode-lessons-in-structure/SKILL.md). For choosing direct evidence, see [$principle-prove-it-works](../principle-prove-it-works/SKILL.md).

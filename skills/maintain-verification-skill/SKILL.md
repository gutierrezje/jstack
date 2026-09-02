---
name: maintain-verification-skill
description: "Audit and repair a project's verification skills, executable adapters, feature coverage, and receipts against current source and live behavior. Use for /maintain-verification-skill or \"audit the verify skill\"."
---

# Maintain verification skill

Read and follow the [project verification contract](../jesus-mode/references/verification.md).

1. Locate every project `.agents/skills/verify-*` skill, its feature map, and its
   executable adapter or adopted project-native controller.
2. Inventory current routes, commands, menus, shortcuts, deep links, and docs.
   Compare them with the coverage index. Mark each entry point mapped, excluded
   with a current reason, or missing. Use read-only workers only for disjoint
   source areas.
3. Run adapter help, structured capability discovery, `doctor`, and one live
   baseline before editing. Check that errors give a next action, structured
   output parses, dry runs preserve state, and cleanup owns only the current run.
4. Compare every affected mapped recipe with current behavior. Correct only
   proven drift in the adapter, instructions, commands, evidence, or coverage.
   Keep the change to one reviewable unit.
5. Rerun the changed adapter commands and feature paths. Inspect their receipts,
   confirm cleanup, and validate every affected skill package.

Completion means no discovered entry point is unaccounted for, every correction
has source and live evidence, the adapter contract passes, and unsupported
speculative edits are absent.

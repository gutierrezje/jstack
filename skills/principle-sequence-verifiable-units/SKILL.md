---
name: principle-sequence-verifiable-units
description: "Use for sweeps, migrations, or stacked changes that need coherent verification checkpoints before dependent work proceeds."
---


# Sequence work into verifiable units

Order work into coherent units that end in a state you can check. Verify each unit before building dependent work on it. Apply this to both execution and delivery.

**Why:** Verification checkpoints localize failures and give reviewers a sequence they can assess. Choose units around behavior and dependencies.

**Execution.** Group tightly coupled edits into a coherent unit. Establish its baseline, make the change, and run the relevant check before building dependent work on it. Use focused checks during larger units and verify the integrated result. Reuse checks while their evidence remains valid. Change branches or rewrite history only when the authorized repository workflow calls for it.

**Delivery.** Order commits and PRs by dependencies and reviewable behavior. Keep coupled tests and implementation together when they form one useful change. A failing reproduction can be demonstrated before the fix without requiring a separate broken commit. Split work when the parts are independently useful, verifiable, or reversible.

**Pattern:**
- Pick a coherent unit that ends in a meaningful check, such as an API migration with its callers and tests.
- Verify before building dependent work; batch related repairs and check the complete repair delta.
- Order the units so the sequence builds confidence on its own, for you while executing and for a reviewer reading the stack.

The sequencing complement to [$principle-prove-it-works](../principle-prove-it-works/SKILL.md), which keeps each check real, and [$principle-build-the-lever](../principle-build-the-lever/SKILL.md), which makes the per-unit check cheap.

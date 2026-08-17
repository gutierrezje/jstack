---
name: maintain-verification-skill
description: "Periodic pass that keeps a project's verification skill and feature map honest: parallel source readers per feature, one live session driving every feature, at most one PR of proven corrections. Use for /maintain-verification-skill or \"audit the verify skill\"."
---

# Maintain verification skill

1. Locate the project `.agents/skills/verify-*` skill and read its feature map.
2. Compare routes, commands, menus, docs, and current behavior against every mapped feature. Use read-only workers only for disjoint source areas.
3. Run one live verification path before editing so drift is observed, not inferred.
4. Correct only proven drift in instructions, selectors, commands, evidence, or feature coverage. Keep the change to one reviewable unit.
5. Rerun affected paths and validate the skill package.

Completion means every changed map entry has source and live evidence, and unsupported speculative edits are absent.

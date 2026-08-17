---
name: setup-pstack
description: "Configure which models pstack uses per role. Detects your available models and writes an always-applied rule that overrides the skill defaults. Use for /setup-pstack, \"configure pstack models\", or changing pstack's model choices."
---

# Setup pstack

Configure [the global routing table](../jstack/references/routes.md).

1. Read the current table and [Codex compatibility contract](../jstack/references/codex-compatibility.md) completely.
2. Inspect the current subagent tool's declared model and effort overrides. Confirm any newly selected combination with one tiny no-file probe.
3. Show every pstack role with its current model, effort, and fan-out. Mark unavailable routes.
4. Preserve current choices unless the user requests changes. Prefer Luna for bounded execution, Terra for investigation, and Sol for synthesis and judgment.
5. Apply approved changes only to the routing table. Keep panels and swarms at two by default and three maximum without explicit direction.
6. Read the file back and report changed routes, successful probes, unavailable combinations, and unchanged defaults.

Completion means every configured model/effort is either probe-proven in this session or visibly marked unavailable.

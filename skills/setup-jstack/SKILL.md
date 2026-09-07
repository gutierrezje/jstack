---
name: setup-jstack
description: "Configure Jstack's models, effort, service tiers, named agents, and fan-out by routing role. Use for /setup-jstack, configuring Jstack models, or changing Jesus mode and specialist routing."
---

# Setup Jstack

Configure [the global routing table](../jesus-mode/references/routes.md).

1. Read the current table and [Codex compatibility contract](../jesus-mode/references/codex-compatibility.md) completely.
2. Inspect the current subagent tool's named-agent selector and model, effort, and service-tier overrides. Confirm newly selected routes with a tiny no-file probe, reusing equivalent probe evidence from this session. Invoke a named agent by its registered name; generic dispatch does not test custom-agent discovery.
3. Show changed routing roles with their model, effort, named agent or direct dispatch, requested tier, and fan-out. For a full setup, show every role. Distinguish configured settings, successful invocation, and runtime-observed settings; mark unavailable routes and unverified tiers.
4. Preserve current choices unless the user requests changes. Use the routing table's reasoning hierarchy and role assignments rather than inferring capability from effort labels across models.
5. Apply approved changes only to the routing table. Preserve each topology's configured count unless the user requests a change. Use two for new unspecified panels and swarms, and require explicit direction to exceed three workers.
6. Read the file back and report changed routes, successful probes, unavailable combinations, and material verification gaps.

Completion means every changed route has successful invocation evidence or an
explicit availability gap and fallback. Report an active service tier only when
runtime evidence exposes it.

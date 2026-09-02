---
name: automate-me
description: "Use for \"automate me\", \"create/update/refresh my -mode skill\", \"turn/capture my preferences or working style into a skill\", or wanting agents to follow how the user works. Drafts or revises a personal -mode skill via create-skill + unslop, optionally pulling fresh evidence from recent transcripts."
---

# Automate me

Turn repeated working preferences into one concise personal mode skill.

1. Find an existing matching `*-mode` skill under project `.agents/skills` or global `~/.codex/skills`.
2. Use `$cursor-team-kit:workflow-from-chats` when task-history evidence is available. Otherwise mine only the current task and user-provided examples; do not infer unseen history.
3. Confirm weak or conflicting preferences with the user. Promote only repeated, behavior-changing signals.
4. Cluster rules by response style, autonomy, investigation, delegation, verification, code/prose discipline, and process. Omit empty categories.
5. Use `$skill-creator` and `$writing-for-agents` to create or update the mode globally unless the user requests project-local scope.
6. Use `$humanizer` on human-facing prose, validate the skill, and show the final triggers and rules.

Completion means one validated mode skill exists at the agreed scope, with no rule based solely on invented or inaccessible history.

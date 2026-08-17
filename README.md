# Jstack

Jstack is a Codex-native agent workflow stack for rigorous software work. It combines cost-aware model routing with focused skills for planning, investigation, implementation, review, and verification.

It is adapted from Lauren Tan's [pstack](https://github.com/cursor/plugins/tree/main/pstack), but its control plane is native to Codex: skills, collaboration agents, visible plans, and Codex authorization boundaries.

## What it includes

- `$jstack` chooses the smallest useful agent topology.
- `$poteto-mode` runs an evidence-driven engineering workflow.
- `$how` and `$why` investigate mechanics and rationale.
- `$architect`, `$arena`, `$swarm`, and `$interrogate` provide deliberate multi-agent patterns.
- `$setup-pstack` changes the shared model and effort routes.
- Supporting principle, verification, retrospective, teaching, and writing skills are packaged alongside them.

The default routes use Sol for orchestration and judgment, Terra for investigation, and Luna for bounded execution. Edit [`skills/jstack/references/routes.md`](skills/jstack/references/routes.md) to change them.

## Install

Clone the repository, then install it through Codex's plugin UI or add the local checkout as a plugin source. The repository is a complete plugin rooted at `.codex-plugin/plugin.json`; no build step or external service is required.

For a manual skills-only installation, copy the directories under `skills/` into `~/.codex/skills/`. Keep the directory names unchanged so cross-skill references resolve.

## Use

Start with one of these prompts:

```text
Use $jstack to route this task with the smallest useful agent team.
Use $poteto-mode to diagnose and fix this bug with evidence.
Use $arena to compare two implementation approaches and judge them.
```

## Design constraints

- The parent agent owns scope, integration, and final judgment.
- Fan-out begins at zero or one child and expands only for independent evidence or disjoint work.
- Model selections are explicit and must be supported by the active Codex runtime.
- Internal agents share the local checkout; overlapping writers are serialized.
- External and destructive actions still require the authority defined by Codex and the user's request.

## Validate

```bash
node scripts/validate.mjs
```

## Provenance

Jstack is based on pstack `0.14.1` at commit `2a8044425c7bddf429c3bdedf3ab61e791d34d65`. See [`NOTICE.md`](NOTICE.md) and [`LICENSE`](LICENSE).

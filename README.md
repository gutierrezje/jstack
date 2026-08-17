# Jstack

Jstack is a collection of Codex skills for software work. It handles model routing and includes workflows for planning, investigation, implementation, review, and verification.

The project started as a port of Lauren Tan's [pstack](https://github.com/cursor/plugins/tree/main/pstack). The workflows have since been rewritten around Codex skills, collaboration agents, plans, and permission rules.

## Skills

`$jstack` is the main router. It picks a workflow and starts with as few agents as the task allows. `$poteto-mode` handles the full engineering loop, while `$how` and `$why` are for investigating how something works or why it ended up that way.

For work that benefits from multiple independent passes, the repo includes `$architect`, `$arena`, `$swarm`, and `$interrogate`. There are also smaller skills for verification, retrospectives, teaching, writing, and the engineering principles used by Poteto mode.

By default, Sol handles orchestration and judgment, Terra investigates, and Luna executes bounded tasks. You can change the models, effort levels, and fan-out in [`skills/jstack/references/routes.md`](skills/jstack/references/routes.md), or use `$setup-pstack`.

## Install

Clone the repository and install it through Codex's plugin UI, or add the checkout as a local plugin source. The plugin manifest is at `.codex-plugin/plugin.json`. Jstack does not need a build step or an external service.

If you only want the skills, copy the directories under `skills/` into `~/.codex/skills/`. Do not rename them because some skills link to files in neighboring skill directories.

## Use

Invoke the router for general work, or call a specific workflow directly:

```text
Use $jstack to route this task with the smallest useful agent team.
Use $poteto-mode to diagnose and fix this bug with evidence.
Use $arena to compare two implementation approaches and judge them.
```

## How delegation works

The parent agent owns the scope and reviews the final result. A workflow starts with zero or one child and adds another only when there is a separate question to investigate, a separate implementation to compare, or a disjoint chunk of work.

Model names must exist in the active Codex runtime. Internal agents also share the same checkout, so Jstack does not run overlapping writers at the same time. Installing the plugin does not grant permission to publish, deploy, merge, delete files, or contact third parties.

## Validate

```bash
node scripts/validate.mjs
```

## Provenance

Jstack is based on pstack `0.14.1` at commit `2a8044425c7bddf429c3bdedf3ab61e791d34d65`. See [`NOTICE.md`](NOTICE.md) and [`LICENSE`](LICENSE).

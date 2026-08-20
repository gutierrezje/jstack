# Jstack

Jstack is a Codex plugin for software work. It routes tasks between models and
bundles skills for planning, investigation, implementation, review, and
verification.

The project began as a port of Lauren Tan's
[pstack](https://github.com/cursor/plugins/tree/main/pstack). The current
workflows use Codex skills, collaboration agents, plans, and permission rules.

## Skills

Jstack is the name of the plugin. `$jesus-mode` is its general-purpose workflow.
`$babysit-pr` stays with a PR through review and repair. It runs DiffOwl, waits
for CI, and tells you whether the latest commit is ready. `$open-pr` reviews a
branch and writes the PR around What, How, Why, and Evidence. UI changes need
screenshots; performance changes need measurements. Use `$how` to learn how
something works and `$why` to find out why it ended up that way.

`$architect`, `$arena`, `$swarm`, and `$interrogate` handle work that needs more
than one independent pass. Other skills cover verification, retrospectives,
teaching, writing, and the engineering principles behind Jesus mode.

Sol normally handles orchestration and judgment, Terra investigates, and Luna
executes bounded tasks. Change the models, effort levels, and fan-out in
[`skills/jesus-mode/references/routes.md`](skills/jesus-mode/references/routes.md),
or use `$setup-jstack`.

## Install

Clone the repository and install it through Codex's plugin UI, or add the
checkout as a local plugin source. The manifest is at
`.codex-plugin/plugin.json`. Jstack does not require a build step or an external
service.

If you only want the skills, copy the directories under `skills/` into
`~/.codex/skills/`. Keep their names unchanged because some skills link to files
in neighboring directories.

## Use

Use `$jesus-mode` for general work, or invoke a specialist directly:

```text
Use $jesus-mode to diagnose and fix this bug with evidence.
Use $arena to compare two implementation approaches and judge them.
Use $open-pr to review this branch, gather evidence, and open its pull request.
Use $babysit-pr to review this PR and keep working on it until DiffOwl and CI are clean.
```

## How delegation works

The parent agent owns the task and reviews the result. It usually starts alone.
It adds a child when there is a separate question to investigate or a piece of
work that can be handled independently. It can also add one to compare another
implementation.

Model names must exist in the active Codex runtime. Internal agents share the
same checkout, so Jstack gives overlapping files to one writer at a time. You
still need explicit permission to publish, deploy, merge, delete files, or
contact third parties.

## Validate

```bash
node scripts/validate.mjs
```

## Provenance

Jstack is based on pstack `0.14.1` at commit `2a8044425c7bddf429c3bdedf3ab61e791d34d65`. See [`NOTICE.md`](NOTICE.md) and [`LICENSE`](LICENSE).

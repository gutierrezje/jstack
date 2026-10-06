# Jstack

Jstack is a Codex and Claude Code plugin for software work. It routes tasks between models and
bundles skills for planning, investigation, implementation, review, and
verification.

The project began as a port of Lauren Tan's
[pstack](https://github.com/cursor/plugins/tree/main/pstack). The current
workflows use Codex skills, collaboration agents, plans, and permission rules.
Jstack integrates with [DiffOwl](https://github.com/gutierrezje/diffowl),
uses a silly `jesus-mode`, and will try its best to sync with pstack.

All credit goes to @poteto :)

## Skills

Jstack is the name of the plugin. `$jesus-mode` is its general-purpose workflow.
It uses [DiffOwl coverage](skills/jesus-mode/references/diffowl.md) as the record
of model review, reusing one full review and exact repair ranges across
implementation, babysitting, and shipping. `$babysit-pr` stays with a PR through
full review and repair, waits for CI, and tells you whether the latest commit is
ready. `$open-pr` prepares the review experience around What, How, Why, and
Evidence. It verifies that screenshots and other artifacts are durable and
readable, but leaves heavy review cycles to `$babysit-pr`.
[$ship](skills/ship/SKILL.md) carries selected work through merge, release,
live verification, and cleanup, reusing review evidence and recording delivery.
Use `$how` to learn how something works and `$why` to find out why it ended up that way.

`$architect`, `$arena`, `$swarm`, and `$interrogate` handle work that needs more
than one independent pass. Other skills cover verification, retrospectives,
teaching, writing, and the engineering principles behind Jesus mode.

Use [$benchmark-checklist](skills/benchmark-checklist/SKILL.md) to vet measured
performance and [$correct](skills/correct/SKILL.md) to prevent recurring repository
mistakes with architecture, types, checks, or behavioral tests.

Astra handles the highest-level reasoning, with Sol next for routine orchestration
and judgment. Luna handles investigation and bounded tasks; Terra is reserved for
Arena design comparisons. Change the
models, effort levels, and fan-out in
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

### Claude Code

Add the repository as a marketplace and install the plugin:

```text
/plugin marketplace add gutierrezje/jstack
/plugin install jstack@jstack
```

For a local checkout, run `/plugin marketplace add <path-to-checkout>`. Skills
are namespaced, so `$arena` becomes `/jstack:arena`. Claude Code reads the same
`skills/` directory; tier names map to Claude models in
[Claude Code routes](skills/jesus-mode/references/routes.md#claude-code-routes),
and runtime differences live in the
[Claude Code compatibility overlay](skills/jesus-mode/references/claude-compatibility.md).

## Use

Use `$jesus-mode` for general work, or invoke a specialist directly:

```text
Use $jesus-mode to diagnose and fix this bug with evidence.
Use $arena to compare two implementation approaches and judge them.
Use $open-pr to prepare this branch, gather evidence, and open its review-ready pull request.
Use $babysit-pr to review this PR and keep working on it until DiffOwl and CI are clean.
Use $ship to merge this PR, release to production if applicable, verify delivery, and clean up its worktree and local and remote branches.
```

## How delegation works

The parent agent owns the task and reviews the result. It usually starts alone.
It adds a child when there is a separate question to investigate or a piece of
work that can be handled independently. It can also add one to compare another
implementation.

Model names must exist in the active Codex runtime. Internal agents share the
same checkout, so Jstack gives overlapping files to one writer at a time. You
reuse the authority granted by the user's request for routine edits and cleanup.
Publishing, deployment, merging, contacting third parties, and destructive actions
require authorization covering that action and target; ask when it is missing.

## Validate

```bash
node scripts/validate.mjs
```

## Provenance

Jstack is based on pstack `0.15.13` at commit `e5a8186d7b43be8d6ac4452440fbead5f1a51c70`. See [`NOTICE.md`](NOTICE.md) and [`LICENSE`](LICENSE).

# Jstack contributor guide

Jstack is a Codex and Claude Code plugin containing portable agent skills. Keep changes small, inspectable, and compatible with Codex Desktop and CLI and with Claude Code.

## Structure

- `.codex-plugin/plugin.json`: Codex plugin metadata.
- `.claude-plugin/plugin.json` and `marketplace.json`: Claude Code plugin and marketplace metadata. Keep the name in sync with the Codex manifest.
- `skills/<name>/SKILL.md`: one skill per directory.
- `skills/<name>/agents/openai.yaml`: user-facing metadata for each skill. When it sets `allow_implicit_invocation: false`, also set `disable-model-invocation: true` in the skill's frontmatter for Claude Code.
- `skills/jesus-mode/references/routes.md`: the single source of truth for model, effort, and fan-out defaults.
- `skills/jesus-mode/references/codex-compatibility.md`: mappings from upstream Cursor concepts to Codex behavior.
- `skills/jesus-mode/references/claude-compatibility.md`: Claude Code overrides layered on the Codex contract. Put Claude-specific behavior here, not in individual skills.
- `scripts/validate.mjs`: repository-level structural and link checks.

## Rules

- Follow the writing-for-agents style: state what to do, front-load critical constraints, and use direct instructions.
- Do not add user-specific absolute paths.
- Do not duplicate model routing in individual skills. Link to the shared routing table.
- Keep upstream attribution in `LICENSE` and `NOTICE.md`.
- Preserve Codex authorization boundaries. A skill must not grant itself permission to publish, deploy, merge, delete, or message third parties.
- Internal agents share a checkout. Parallel writers must use disjoint files or separate worktrees.
- Rename colliding upstream skills instead of overwriting broadly installed skills. This repo uses `$pstack-tdd` and `$pstack-teach`.

## Verification

Run:

```bash
node scripts/validate.mjs
node --test scripts/validate.test.mjs
claude plugin validate .
python3 ~/.codex/skills/.system/plugin-creator/scripts/validate_plugin.py .
```

When the system validators are unavailable, `node scripts/validate.mjs` remains the portable minimum check.

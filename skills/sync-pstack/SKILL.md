---
name: sync-pstack
description: Analyze upstream cursor/plugins pstack changes and guide semantic ports into Codex-native Jstack without overwriting local skills. Use when the user says "sync pstack", "check pstack updates", or asks to update Jstack from upstream.
---

# Sync pstack into Jstack

Treat upstream pstack as design input and port its intent without overwriting local Codex work.

## Workflow

1. Read [porting-policy.md](references/porting-policy.md), then read
   `skills/jesus-mode/references/codex-compatibility.md` and
   `skills/jesus-mode/references/routes.md` in the target repository.
2. Run the read-only analyzer with a retained checkout:

   ```bash
   bash skills/sync-pstack/scripts/analyze.sh "$PWD" --keep-upstream
   ```

   Use `--base <40-hex-commit>` only when deliberately comparing another
   upstream baseline. Use `--upstream-dir <new-path>` when a stable checkout
   location is needed; the path must not already exist.
3. Inspect every reported upstream delta in `UPSTREAM_DIR` and its mapped local
   counterpart. Record one disposition per changed upstream path in the task
   response: `adopt`, `translate`, `preserve-local`, or `skip`, with rationale.
   Do not create a project folder, issue map, or ledger file for this workflow.
4. Implement accepted changes as deliberate semantic ports. Preserve local
   Codex interfaces, authorization boundaries, shared-checkout rules, and the
   `tdd` → `pstack-tdd` and `teach` → `pstack-teach` names. Never blindly copy
   Cursor runtime scripts or overwrite a skill from upstream.
5. Run `node scripts/validate.mjs` and
   `python3 ~/.codex/skills/.system/plugin-creator/scripts/validate_plugin.py .`.
6. Update `NOTICE.md`'s source baseline only after every changed path has a
   disposition, accepted ports are integrated, and validation passes. A partial
   or interrupted sync leaves the existing baseline unchanged.

## Report

Summarize the baseline and head, changed paths, each disposition, accepted
ports, validation commands, and anything intentionally preserved or skipped.

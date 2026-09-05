---
name: show-me-your-work
description: "Use when asked for a decision trail, or when unattended work needs a durable record of decisions and evidence."
---

# Show me your work

Keep one append-only TSV decision trail for long, unattended, or multi-phase work.

1. Start from `references/decision-log-template.tsv`. Use `decisions.tsv` or `.audit/<task>.tsv`; keep it uncommitted unless the user or review need requires a committed trail.
2. Log only forks, accepted or rejected units, pivots, blockers, and verification checkpoints. Record timestamp, phase, decision, why, evidence pointer, and result.
3. Use `scripts/log.sh` so cells remain one line and spreadsheet-formula prefixes are escaped.
4. Before handoff, audit every row against the current task, git diff/history, commands, and artifacts. Add material omitted pivots; remove invented or padding rows.
5. For high-stakes unattended work, ask one Terra High read-only reviewer to flag weak evidence, skipped verification, risky choices, and gaps.
6. End with the log path and an Attention section containing the independent flags or `No flags`.

Completion means every row resolves to real evidence and every material decision affecting the result appears once.

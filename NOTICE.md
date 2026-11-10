# Attribution

Jstack is a Codex-native adaptation of the `pstack` plugin by Lauren Tan.

- Upstream: <https://github.com/cursor/plugins/tree/main/pstack>
- Upstream version: `0.15.36`
- Source commit: `de8ee15dd1194627d21eb5fcd41cb1873208dabb`
- Upstream copyright: Copyright (c) 2026 Lauren Tan

The upstream work is distributed under the MIT License. Jstack retains that license and rewrites Cursor-specific orchestration for Codex's skills and collaboration tools.

The `statechart` skill was adapted from pstack at
`1ba91fc25c0977741dd0e267849e6234b037ed0a`, including material from
`skills/statechart`, `skills/create-formal-verification-skill`, and
`skills/maintain-formal-verification-skill` as statechart guides. Upstream did
not change those paths between that commit and the baseline above. Exact source
hashes and adaptation notes are recorded in
[statechart provenance](skills/statechart/UPSTREAM.json).

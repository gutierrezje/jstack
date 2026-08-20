# Pstack porting policy

Before deciding what to port, read:

- `skills/jesus-mode/references/codex-compatibility.md`
- `skills/jesus-mode/references/routes.md`

For every changed upstream path, record exactly one disposition in the task
response:

- `adopt` — the change is portable as written after local review.
- `translate` — preserve intent while replacing Cursor mechanics with Codex
  skills, tools, or collaboration behavior.
- `preserve-local` — local behavior is intentional or already superior; keep it
  and explain the divergence.
- `skip` — irrelevant, obsolete, unsafe, or not worth porting; explain why.

Keep model, effort, and fan-out choices only in `skills/jesus-mode/references/routes.md`.
Honor the `tdd` → `pstack-tdd` and `teach` → `pstack-teach` name collisions.
Preserve Codex authorization boundaries and shared-checkout/write-isolation
rules. Do not grant publishing, deployment, merge, deletion, or messaging
authority through an upstream workflow.

Never copy Cursor runtime scripts, custom agents, or assumptions about Cursor
transcripts, `Task`, Graphite, Bun, or background execution blindly. Port their
user-visible intent to the Codex-native interfaces described by the compatibility
contract, or preserve a local implementation when no safe equivalent exists.

Keep the analyzer read-only and the disposition ledger in the task response.
Update `NOTICE.md`'s source commit only after every changed path has a recorded
disposition, all accepted ports are integrated, and both validators pass. A
partial sync must leave the old baseline unchanged.

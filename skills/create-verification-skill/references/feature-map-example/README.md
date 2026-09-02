# Notes verification map

This directory is the maintained source for verifying the user-facing behavior of Notes. Read the index before driving the app, then use the matching feature file as the recipe.

## Baseline preconditions

- Launch Notes at `http://127.0.0.1:4173` with a disposable data directory.
- Set `NOTES_DATA_DIR=/tmp/notes-verify-$RUN_ID` so concurrent runs do not share state.
- Set `CONTROL_NOTES_RUN_ID=$RUN_ID` so every command updates one run manifest.
- Seed notes titled `Quarterly plan` and `Grocery list`.
- Put `control-notes` and the `notes` CLI on `PATH`.
- Run `control-notes capabilities --json`, then `control-notes doctor --json` and
  require the expected URL, data directory, and build revision.
- Never drive an instance that was not started by this verification run.

## Controller interface

`control-notes` hides server startup, browser attachment, fixture ownership, and
artifact paths behind a small interface. Every command documents its side
effects in `--help` and supports `--json` unless its stdout contract is one path.

- `doctor`, `info`, and `capabilities` inspect the effective target.
- `browser snapshot`, `browser screenshot`, and `browser components` observe the UI.
- `browser click`, `browser fill`, `browser press`, and `browser scroll` drive it
  through semantic handles.
- `cli -- <command>` captures terminal behavior.
- `wait-settle` waits for observable idle conditions.
- `receipt --run <run-id>` returns the machine-readable feature receipt.
- `cleanup --run <run-id>` removes only resources recorded by that run.

State-changing commands support `--dry-run`. Applying one requires the run ID
and named disposable data target. Failures return the observed mismatch and the
next command to run.

## Driving conventions

- Start every recipe from the baseline state unless its preconditions say otherwise.
- Prefer ARIA roles and accessible names over CSS selectors or DOM position.
- Treat every command as literal. Keep quoted names and flags unchanged.
- Run browser actions through `control-notes browser`.
- Run terminal actions through `control-notes cli -- <command>`.
- Restore seeded data after a mutation. Do not remove proof artifacts during cleanup.

## Proof and skip reporting

- Capture the user action and the resulting state, not only the final screen.
- UI proof includes an ARIA snapshot and a screenshot with the app identity visible.
- CLI proof includes the command, stdout, stderr, and exit code.
- Mutation proof includes a read-only second view of the stored value.
- Record the feature ID and entry point used with every artifact.
- Report an unreachable path with the attempted command and the unmet precondition.
- Do not report a skipped entry point as verified through a different path.

## Feature entry contract

Each feature file starts with an H1 title and one paragraph describing the user-visible behavior. It then uses exactly four H2 sections in this order.

1. `Sub-features` lists short IDs with one line for each behavior.
2. `How to get to it (user POV)` lists every user entry point.
3. `Driving it with <harness>` starts with `Preconditions:` and uses labeled bullets that pair each user action with an exact command and observable result.
4. `Gotchas` lists traps that can waste or invalidate a verification run.

Keep implementation details out of the map. Name only user paths, stable handles, required state, commands, and observable proof.

## Features

- [Create a note](./create-note.md) covers browser and CLI creation, cancellation, persistence, and cleanup.
- [Search notes](./search.md) covers toolbar, keyboard, and CLI search with matching, empty, and clear states.

## Entry-point coverage

| Entry point | Feature ID | Status |
|---|---|---|
| `New note` toolbar button | `create-open` | mapped |
| `n` browser shortcut | `create-open` | mapped |
| `notes create` | `create-cli` | mapped |
| `Search` toolbar button | `search-toolbar` | mapped |
| `/` browser shortcut | `search-keyboard` | mapped |
| `notes search` | `search-cli` | mapped |

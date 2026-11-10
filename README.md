# Statechart tests

Regression suite for `skills/statechart` on `main`. It lives on this branch so
plugin installs, which shallow-clone `main`, never download it.

Mount it where the tests expect to run, from a `main` checkout:

```bash
git worktree add skills/statechart/scripts/test statechart-tests
```

Then, in `skills/statechart/scripts`, run `npm ci` and `npm test` with `JAVA`
and `TLA2TOOLS` set (see the Statechart workflow on `main`). CI on `main` checks
out this branch at the same path. When a change alters statechart behavior,
update this branch first so `main`'s CI runs against the new expectations.

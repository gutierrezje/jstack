# Cleanup after delivery

## Resolve eligible targets

Read task history and live PR and deployment state. For a combined shipping run,
finish the selected merge and release verification before cleanup. For
cleanup-only, establish the existing delivery result or authorized recoverable
retention first.

Enumerate worktrees through Git and managed attachments through the app's artifact
tools when available. Restrict cleanup to the requested worktrees, local branches,
remote branches, and task-owned disposable files. Broader disk reclamation uses
the [worktree-cleanup playbook](../../jesus-mode/playbooks/worktree-cleanup.md).

For each target, inspect its exact path or ref, head, owner, tracked changes,
untracked and needed ignored files, active processes, and branch use in other
worktrees. Preserve active, shared, pinned, primary, and unknown managed checkouts.
Keep the calling session's checkout usable; defer its removal to the app's
supported lifecycle when it cannot be safely archived during the run.

Prove the scoped branch's work was integrated or recoverably retained. After a
squash merge, use the forge's merge record and compare the reviewed patch with
the actual landed change. An ancestry test alone can reject safely squashed
work; an empty diff over selected files alone can miss branch-only commits.
Inspect every commit or local change outside the reviewed PR. Preserve unique
work before removing its last ref or checkout.

## Remove and read back

Preserve needed failure evidence and recovery material outside removal targets.
Stop only task-owned processes. Prefer the app's managed worktree archive API for
attached managed checkouts; retain needed ignored files separately because archive
snapshots may exclude them. Use ordinary Git worktree removal for clean,
unmanaged targets. Within authorized cleanup, preserve dirty and unclassified
files in persistent app recovery storage or a named task-owned recovery directory
outside removal targets, together with the source identity and restoration steps.
Use storage retained across sessions for unique work. Verify the saved contents
before removal. Choose and report that location as routine preparation; ask for a
decision only when recoverability cannot be established or discarding unique
work is necessary.

Re-read each remote branch immediately before deletion and compare its tip with
the recorded reviewed head. Delete it with the platform's conditional mechanism
or a Git push lease, for example:

```bash
git push --force-with-lease=refs/heads/<branch>:<expected-tip> <remote> :refs/heads/<branch>
```

This lease protects the selected deletion from a concurrent push; it does not
authorize any other force push. If the tip changed, inspect the new work and
re-evaluate eligibility. Confirm the branch is not a default, protected, shared,
or still-required stack branch.

Move an authorized retained session checkout to a safe revision before deleting
its local topic branch. Preserve dirty state during that transition and ensure
the branch is unused in every other worktree. If Git rejects local deletion
after a squash merge, use forced local deletion only after the integration and
unique-work checks above pass within the authorized cleanup scope.

Clean generated files, environment files, and disposable artifacts only when
this run created or changed them and their original state is known. Keep
unresolved failure evidence and recovery material. Prune stale Git
worktree records and read back worktrees and local/remote refs.

Completion: every removed target was identified, authorized, unused, and
integrated or recoverably preserved; retained targets and recovery locations
are reported in chat, and the calling checkout remains usable.

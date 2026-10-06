# Release

## Resolve the source and target

Discover the repository's release procedure, component boundaries, environment
selectors, prerequisite checks, and recovery path. Derive commands from that
procedure and current tooling. Treat backend, client, package, and other release
surfaces separately when they have different sources or targets.

Identify the exact live target before a dry run or deployment. Confirm the
previously deployed revision through live metadata or a verified deployment
record; a merged PR or successful nightly job proves only what that job actually
released. If the live baseline is unknown, report the gap and satisfy the
repository's release gate before proceeding.

Compare that baseline with the intended source. Account for every intervening
commit and release-relevant change, including other PRs and schema changes.
Proceed only when authority and verification cover the complete delta. An
unexpected change returns to scope resolution. Refresh source and target state
before deploying if another release could have occurred during preparation.

## Prepare a reproducible release

Deploy from the exact selected source revision or approved immutable artifact. For a
source deployment, use a clean detached checkout at that revision when the active
checkout contains unrelated work or the deploy tool generates files. Install
through the repository's locked dependency procedure and run its required checks
there. Verify post-merge CI for the same revision; local checks do not waive a
required CI gate. Pending required checks keep release pending.

Inspect the release tool's output behavior before running it against production.
Use output that omits secret values; verbosity and debug modes can expose
environment variables even during a dry run. For Convex production deployments
and dry runs, use nonverbose output and omit `-v`/`--verbose`. Keep complete safe
output available so truncation does not hide schema or index operations.

Use a preview or read-only dry run when supported. Compare every planned change
with the expected delta: additions and deletions, indexes, migrations, auth,
definitions, and components as applicable. An unexpected destructive change
blocks execution. If preview is unavailable, use the repository's supported
preflight and report the limitation accurately.

Shared development deployments also need a current baseline and covering
authority. Prefer local or isolated verification. When a shared dev push is
required, reconcile its deployed state and inspect the complete push delta;
deploy the intended current base plus the change rather than an obsolete branch
that would revert someone else's work.

## Execute and verify

Run the established release operation for the resolved target. Include the source
revision and PR in the audit message when the tool supports one. For automatic
rollouts, observe the run triggered by the merge instead of starting a duplicate.
Match the completed run and artifact to the intended source and environment.
After a timeout or ambiguous result, query actual release state before retrying.

Run the repository's live release checks using its documented runtime. Choose
evidence for every material change: function contract or artifact identity,
schema/index effects, migrations, and the affected smoke journey. A function
contract hash can stay unchanged after an index-only change; verify the index
effects separately through deployment results or live inspection. A successful
deploy command alone does not prove the changed behavior or all release surfaces.

Report the preview, actual changes, and live checks in chat. If verification
fails, preserve the deploy source and evidence, report the target's actual state,
and use the repository's authorized recovery path. Account changes and secret
rotation need their own authority. If output exposes a secret, stop the emitting
mode, restrict task-owned copies within existing authority, and report the
exposure without repeating values; deleting a
local log does not remove transcript exposure.

Completion: every selected target runs the intended source or artifact, required
release checks pass, and the complete shipped delta is verified and reported.

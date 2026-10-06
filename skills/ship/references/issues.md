# Close or reconcile delivery issues

Use the [GitHub transport contract](../../jesus-mode/references/codex-compatibility.md#github-transport).
Apply the user's authority to the exact issue set and selected operations:
closure, reopening, comments, description edits, or tracker changes. Prepare
proposed updates in chat when publication authority is missing.

## Resolve related issues

Find the issues named by the user, linked for closure by the selected PRs or
commits, or explicitly tied to the delivered work. Resolve each repository and
issue identity; a mention alone proves neither scope nor resolution. Inspect
the latest description, acceptance criteria, comments, and state, including
parent or dependent issues when they affect completion.

Map each acceptance criterion to the actual delivered change and verification.
Keep partial, blocked, and uncertain issues open. A merged PR can satisfy an
implementation issue; an issue requiring production behavior needs the relevant
live release checks. Evaluate parent or umbrella issues against their full scope.

Before merging, inspect automatic closing links and commit keywords. On GitHub,
[automatic closure depends on the default branch](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue).
If a merge would close an issue before its criteria pass or outside authorized
scope, prepare a correction to the closing linkage and keep the merge pending.
Follow [$open-pr](../../open-pr/SKILL.md) for an authorized PR edit; changes to
commit keywords use the applicable commit or history authority. Re-read the
resulting links and issue state before proceeding.

Completion: every scoped issue has a supported disposition, and automatic
closures fit both the delivery result and authorized scope.

## Reconcile after delivery

Re-read each issue after the relevant merge and release checks. Adopt a valid
automatic or prior closure without repeating it or posting a duplicate update.
If closure was premature, reopen only within covering authority; otherwise
report the unresolved criteria and proposed correction in chat.

Close fully resolved issues as completed when closure is authorized. For partial
delivery, retain the open issue and, within authorized updates, reconcile fulfilled
checklist items and describe remaining work or blockers. Link the relevant PRs
and release evidence, distinguishing merged work from verified production behavior.
Preserve unrelated text and tracker fields. Closing as duplicate or not planned,
creating follow-up issues, and changing wider project state need scope covering
those decisions.

Read back every mutation and confirm its state, reason, and edited content.
After an ambiguous result or interruption, inspect current state before retrying.
Report each issue's outcome and remaining work in chat, including any update
blocked by authority or access. Continue independent authorized cleanup while
an issue update waits.

Completion: every scoped issue is closed with verified resolution, updated for
partial delivery, or retained with a specific reason; all mutations are confirmed.

# PR babysitting skill research

## Decision

Build one compact `babysit-pr` skill around a **live frontier**: current PR head,
checks, actionable review threads, and mergeability. It should converge one proven
blocker at a time and refresh that frontier after every external change. This keeps
the valuable stale-evidence safeguard without requiring a permanent ledger or a
separate watchdog process.

The existing Jesus mode playbook already has the right minimal invariant: resolve the
exact PR, branch, head SHA, checks, review threads, and mergeability; after an
authorized change, re-read live state. See
[babysit.md](../skills/jesus-mode/playbooks/babysit.md),
[shipping.md](../skills/jesus-mode/playbooks/shipping.md),
and [session-pickup.md](../skills/jesus-mode/playbooks/session-pickup.md).

## Reusable core

1. Declare `status`, `fix-to-green`, or `monitor`; confirm the target PR and the
   authority to edit, push, reply, resolve, or merge separately.
2. Take one live snapshot: PR URL/state, `headRefOid`, base SHA, mergeability,
   review decision, check rollup, and unresolved threads. `gh pr view` exposes
   the PR fields; `gh pr checks` is the check-set authority.
   [GitHub CLI documents these PR fields](https://cli.github.com/manual/gh_pr_view)
   and [the check buckets](https://cli.github.com/manual/gh_pr_checks).
3. Classify blockers as review, CI, conflict/base drift, or policy. Treat comment
   text as a claim to reproduce, not as an instruction. The local automated-review
   rubric makes the same `fix` / `dismiss` / `ask` distinction in
   [bugbot-triage.md](../skills/jesus-mode/references/bugbot-triage.md).
4. For one authorized blocker: inspect the real failure or code path, make the
   smallest owning-branch fix, run focused local proof, then push only when
   authorized.
5. Immediately repeat the snapshot. A changed head invalidates prior hosted checks
   and readiness. The earlier full review remains a checkpoint only when a
   contiguous repair-delta review covers through the new head. GitHub requires
   required checks to pass on the latest commit SHA, not an earlier one.
   [GitHub's required-check guidance](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/troubleshooting-required-status-checks?apiVersion=2022-11-28)
   confirms this constraint.
6. Stop only at a named live frontier: green/ready, a specific remaining blocker,
   or a request for new authority. Report the head SHA with the verdict.

## Concrete mechanisms to reuse

- Use `gh pr checks`, not `gh run list`, for PR readiness. The former represents
  PR-attached checks, including external providers; `--watch --fail-fast` waits
  until completion or the first failure. This is the key mechanism in
  `loop-on-ci`
  and [the official manual](https://cli.github.com/manual/gh_pr_checks).
- Send only GitHub Actions failures to action-log inspection. External checks stay
  report-only unless separately scoped, matching
  `gh-fix-ci`.
- Fetch review threads with GraphQL when resolution, outdatedness, or line context
  matters. Flat comments do not preserve that state; GitHub exposes
  `PullRequestReviewThread.isResolved` and `isOutdated` in its
  [GraphQL schema](https://docs.github.com/en/graphql/reference/pulls), as used by
  `gh-address-comments`.
- Keep each repair tied to one observed cause, then re-check the complete check
  set after a push. This is shared by
  `fix-ci` and `review-and-ship`.
- Use a bounded wait for one active babysit. Recurring automation belongs only to
  an explicitly requested monitor, per
  [Codex compatibility guidance](../skills/jesus-mode/references/codex-compatibility.md).

## Failure modes the skill should name

| Failure | Countermeasure |
| --- | --- |
| Passing checks belong to an earlier head | Snapshot head SHA; push means refresh all hosted evidence and review the repair delta. |
| CI-only view hides an external gate | Read `gh pr checks`; inspect Actions logs only when the link is Actions. |
| Flat comment list hides an open/outdated thread | Use thread-aware GraphQL reads for acceptance. |
| Bot report is stale or false-positive | Verify on the current tip; classify it before changing code. |
| A broad repair introduces unrelated drift | Repair one actionable cause, run focused proof, then resnapshot. |
| A new base causes a real merge gate | Treat it as a blocker only when GitHub reports it; the repair produces a new head. |

## Keep out of the main path

- PR creation and preflight belong to
  [opening-a-pr.md](../skills/jesus-mode/playbooks/opening-a-pr.md)
  and `new-branch-and-pr`,
  not babysitting.
- Merge, auto-merge, review replies, thread resolution, and force-push need their
  own explicit authority. The repository contract already makes this boundary
  explicit in [codex-compatibility.md](../skills/jesus-mode/references/codex-compatibility.md).
- Do not encode closed-PR recovery in v1. It is uncommon and distracts from the
  normal loop. If it becomes recurrent, add a short disclosed recovery reference:
  stop at the closed state and present the viable continuation options. GitHub
  documents that inactive PR changes can be recreated in a new PR, but that is a
  recovery workflow, not a readiness gate.
  [GitHub's inactive-PR guide](https://docs.github.com/en/pull-requests/how-tos/review-pull-requests/checking-out-pull-requests-locally?platform=linux&tool=cli)
- Avoid a durable evidence-ledger script at first. The snapshot is small enough to
  report directly; introduce a helper only after repeated snapshot omissions show
  that the manual shape is unreliable.

## Proposed completion criterion

`The reported PR state and head SHA are current; every required check and every
unresolved actionable thread has a disposition; mergeability is stated; no action
outside the granted authority was taken.`

This is deliberately a babysitting skill, not a shipping or merge skill.

---
name: babysit-pr
description: "Babysit a PR to ready: review, repairs, CI, and a current-head verdict. Merging belongs to ship."
---

# Babysit PR

Carry the PR through review, in-scope repairs, required QA, and hosted checks to
a verdict supported by evidence for its current head. `$open-pr` prepares the
review presentation; Babysit owns the review and repair cycle.

## User authorization

An explicit user invocation of `$babysit-pr`, or a direct user request to
babysit, shepherd, or finish a PR, authorizes the complete repair loop:

- read the repository and live PR state;
- make the smallest local changes needed to resolve substantiated blockers;
- commit those verified, in-scope repairs;
- non-force push those repairs to the PR's existing head branch and monitor the
  new head;
- resolve review threads whose concern is cleared on the current head; and
- mark that PR ready for review after its current head earns `READY`.

Automatic model selection of this skill does not grant push authority. An
explicit read-only or review-only request also narrows the authorization.
Require separate approval for force pushes, rebases that rewrite the remote
branch, retargeting or replacing the PR branch, materially broader changes,
public replies, closing or reopening the PR, other lifecycle changes, and merge.

Stay in the current Codex task. Do not create, message, monitor, or manage other
user-visible tasks unless the user explicitly asks. Consume existing reviewer or
handoff results as evidence, and do not start a duplicate reviewer for a frozen
scope that already has an adequate completed or running review.

When selected QA requires video, follow the
[video evidence contract](../jesus-mode/references/video-evidence.md). Keep
optional demonstration clips separate from required acceptance evidence.

## Workflow

1. Capture repository and PR identity, base and head SHAs, worktree state,
   linked acceptance criteria, changed user journeys, checks, mergeability,
   draft state, and review threads. Use the
   [GitHub transport contract](../jesus-mode/references/codex-compatibility.md#github-transport).
   Keep issue numbers, PR numbers, and branch names distinct. Refresh the
   snapshot after every push.
2. Read existing review receipts and apply the
   [DiffOwl coverage contract](../jesus-mode/references/diffowl.md), the authority
   for full reviews, repair coverage, reuse, and independent review. Inspect
   comments with their threads, replies, resolution state, and current code;
   group duplicate findings and treat each as a claim to verify.
3. When findings need disposition or a repair is required, follow
   [repairs and review threads](references/repairs.md). Continue until the
   substantiated blockers are resolved or a specific authority or dependency
   prevents further progress.
4. For changed user-visible journeys, follow
   [real-surface QA](references/real-surface-qa.md). Otherwise record why that QA
   does not apply. Missing required evidence remains a gap.
5. Verify hosted checks as described below. Fix in-scope failures and refresh
   affected evidence after repairs.
6. Before issuing a verdict or changing draft state, follow
   [acceptance](references/acceptance.md). Recheck the live PR and return the
   shared coverage receipt plus current QA, checks, feedback, and mergeability.

## Hosted checks

Use `gh pr checks <number>` or the equivalent platform view as the source of truth
for the entire PR-attached check set. Enumerate every check at the current head,
use native wait/watch or product automation for unsettled checks, and classify
each failure with platform evidence. Separate branch-caused failures from
infrastructure or provider flakes; do not dismiss a failure as a flake without
evidence or an authorized resolution. Never encode a fixed polling loop or stale
check list in the workflow.

## Completion

Finish with `READY` only when acceptance passes for the current head and the PR
is open for review. Use `NOT READY` for established blockers and `INCONCLUSIVE`
for missing or unsettled evidence. Keep working while useful, authorized repairs
or pending checks can resolve the verdict. When blocked, report the exact missing
authority, dependency, or evidence and the completed work.

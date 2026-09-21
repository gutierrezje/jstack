---
name: open-pr
description: "Use when asked to create, prepare, or update a PR and its review evidence. Full review and repair loops belong to babysit-pr."
---

# Open PR

Create a PR that a reviewer can understand and start reviewing without
reconstructing the work from the branch. Finish with the PR open for review by
default.

Review-ready means the PR's scope, presentation, verification evidence, and
review artifacts are complete. It does not mean every hosted check has settled
or the branch has earned a current-head acceptance verdict. `$babysit-pr` owns
full-branch review, repeated repair coverage, review feedback, hosted-check
convergence, and the final `READY`, `NOT READY`, or `INCONCLUSIVE` verdict.

Read and follow the [GitHub transport contract](../jesus-mode/references/codex-compatibility.md#github-transport) for every PR operation.

## Authorization

An explicit invocation of `$open-pr`, or a direct request to make, create, open,
update, or prepare a PR, authorizes commits, a non-force push to the intended
branch, creating or updating that PR, and marking it ready for review, including
a draft from an earlier workflow. Honor an explicit request to keep the PR in
draft or limit the task to a narrower edit. Existing draft state alone does not
require another user prompt to open it for review. Automatic model selection
does not grant publishing authority. Keep force pushes, remote history rewrites,
retargeting, public comments, review-thread actions, closing, and merging behind
separate user authorization.

## Workflow

1. Resolve the repository, base branch, head branch, linked issue, worktree
   state, and any existing PR. Preserve unrelated work.
2. Inspect the complete intended diff against the base once as a bounded PR
   preflight. Include staged and unstaged work plus enough surrounding code to
   confirm the scope, describe it accurately, remove accidental churn, and fix
   clear in-scope problems. This is preparation, not an exhaustive review loop.
3. Run the checks required by the change and repository. Verify the behavior on
   the most faithful practical surface.
4. Gather direct evidence for every material claim in the PR. Use the evidence
   rules below. Reuse evidence collected during implementation after confirming
   it still covers the prepared change. Collect missing or stale captures on the
   relevant runtime before deciding draft state. If a before image is needed,
   reproduce the base in an isolated checkout when practical. A claim without
   evidence is either measured before publishing, removed, or called out as an
   evidence gap.
5. Commit coherent implementation units using repository conventions. Apply
   the evidence storage rules below before staging artifacts. Reuse current
   review results when they already exist, but do not
   start or extend a model-review coverage chain solely to open the PR.
6. Push non-destructively to the intended head branch. Confirm the remote OID
   matches the prepared local OID.
7. Create or update the PR. Write the body from the prepared diff and collected
   evidence, not from memory or the commit titles alone. Create new PRs ready
   for review unless the user requested a draft or a review blocker remains.
8. Read the remote PR back through the CLI or GitHub plugin. Confirm its head SHA
   matches the prepared local head and its title, body, and links are correct.
   Verify native screenshot attachments and inline image rendering through the
   GitHub transport contract. Fix leftover local paths, repository-image targets,
   and link-only substitutes for required screenshots before calling the PR
   review-ready.
9. For any remaining draft, run `gh pr ready` or the GitHub plugin equivalent
   after every review-blocking evidence gap is closed, unless the user requested
   draft state or a narrower edit. Pending hosted checks do not block this
   transition, but a known required-check failure on the current head does. Read
   the PR back and confirm the same head is now open for review.
10. Return the PR URL, head SHA, verification and artifact summary, current check
    state, and any evidence gaps. Begin `$babysit-pr` only when the user
    explicitly asked to babysit, shepherd, or finish the PR. If Babysit is
    already active, return to that run.

Keep this workflow bounded. Use focused verification after any preflight fix,
then finish the PR presentation. Repeated model review, repair-delta review,
review-thread triage, and waiting for checks to converge belong to
`$babysit-pr`.

## PR body contract

Use these sections:

```markdown
## What
<The behavior or result that changed.>

## How
<The implementation approach and important design choices.>

## Why
<The problem, constraint, or decision that motivated the change.>

## Evidence
<Direct proof for the claims above.>
```

Add risks, rollout notes, or reviewer guidance when they help. Keep the four
core sections even when the PR is small.

## Evidence rules

- List the exact tests, checks, or manual flows run and their results. Link
  durable logs or artifacts when a summary is not enough.
- Include current model-review results when they already provide useful evidence.
  Keep local report paths out of the body. Open PR does not require new model
  review coverage.
- For UI changes, include screenshots of every affected state needed to review
  the change. Use before-and-after images when the old behavior matters. Keep the
  viewport, theme, account, and fixture consistent when comparing states. Remove
  sensitive data, add captions that identify the journey and state, and make the
  images native GitHub attachments through the GitHub transport contract. Embed
  the reviewer-relevant set directly in the Evidence section with captions;
  supplemental links may accompany it. Complete screenshot-publication acceptance
  using the GitHub transport contract.
- For performance changes, report a like-for-like baseline and result. Include
  the command or workload, environment, units, sample count, summary statistic,
  and variance when it matters. Measure the resource named by the change, such
  as latency, throughput, peak RSS, heap size, allocation count, CPU time,
  bundle size, or query count.
- For bug fixes, include the failing reproduction and the passing result when
  practical.

Keep large raw output out of the body. Summarize it and link the full artifact.
Missing earlier captures are unfinished preparation: collect them within the
authorized workflow. If required evidence still cannot be collected or attached,
keep the PR in draft and state exactly what is missing, what recovery was
attempted, and the dependency preventing completion.

## Evidence storage and cleanup

The PR description is the primary home for reviewer-facing evidence. Put concise
test results, relevant measurements, reproduction steps, and selected captioned
screenshots in its Evidence section. Choose the smallest set that supports the
material claims and affected states. Update that section as results change;
keep intermediate captures, repeated logs, and working notes out of it.

Keep working evidence in a task-owned scratch directory outside tracked source
or an existing ignored artifact directory. Publish selected images through the
GitHub transport contract and embed their durable URLs in the description.
Link larger logs or recordings only when they help review, using an authorized
artifact service; record any expiry that limits their usefulness.

Keep one-off screenshots, logs, receipts, and evidence summaries out of Git by
default. Commit artifacts when they serve a maintained repository purpose, such
as regression fixtures, visual-test baselines, or documentation assets, or when
the user explicitly requests a versioned audit trail. Large or complex work
alone does not justify committing its evidence archive. Inspect staged files
before committing; deleting an artifact in a later commit still leaves its
contents in history. When repairing a PR that added one-off screenshots, first
publish and verify their embedded attachments, then remove the authorized
screenshot files from the proposed source diff. Update references in retained
evidence documents to use the attachment URLs. Screenshot cleanup alone does not
authorize deleting those documents; remove them only when that cleanup is also
in scope. Rewriting existing history still requires separate authorization.

After verifying the published evidence and finishing dependent checks, remove
task-owned disposable captures and logs that are no longer needed. Retain files
needed for unresolved failures, review coverage, or an active handoff until that
work closes. If publication is blocked, preserve the selected evidence and report
its location. Cleanup covers only this task's disposable files; leave maintained
assets and unrelated files intact.

## Completion

Finish when the remote PR points to the prepared head, the remote body follows
the contract, every material claim has direct evidence, reviewer-relevant UI
states have native attachments embedded inline with verified GitHub web rendering,
and risks or evidence gaps are explicit. Confirm the PR is open for review. If it remains a
draft, report the explicit user constraint or the known failure or missing
artifact that prevents meaningful review. Report pending hosted checks
accurately. Open PR completion does not require a full model
review, disposition of review feedback, settled hosted checks, or a current-head
acceptance verdict.

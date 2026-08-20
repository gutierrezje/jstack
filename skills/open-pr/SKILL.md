---
name: open-pr
description: "Open or update a GitHub pull request with a reviewed diff, verified current head, and an evidence-backed description. Use when the user asks to make, create, open, update, or prepare a PR, including as the publishing stage after another implementation workflow."
---

# Open PR

Create a PR that a reviewer can understand and verify without reconstructing the work from the branch.

## Authorization

An explicit invocation of `$open-pr`, or a direct request to make, create, open,
update, or prepare a PR, authorizes commits, a non-force push to the intended
branch, and creating or updating that PR. Automatic model selection does not
grant publishing authority. Keep force pushes, remote history rewrites,
retargeting, public comments, review-thread actions, closing, and merging behind
separate user authorization.

## Workflow

1. Resolve the repository, base branch, head branch, linked issue, worktree
   state, and any existing PR. Preserve unrelated work.
2. Review the complete intended diff against the base, including staged and
   unstaged work, and inspect its surrounding code. Remove accidental churn and
   use available cleanup skills where they help.
3. Run the checks required by the change and repository. Verify the behavior on
   the most faithful practical surface.
4. Gather direct evidence for every material claim in the PR. Use the evidence
   rules below. A claim without evidence is either measured before publishing,
   removed, or called out as an evidence gap.
5. Commit coherent units using repository conventions. Push non-destructively
   to the intended head branch.
6. Create or update the PR. Write the body from the reviewed diff and collected
   evidence, not from memory or the commit titles alone.
7. Read the remote PR back. Confirm its head SHA matches the reviewed local head
   and its rendered title, body, links, and images are correct.
8. Return the PR URL to the user. Begin `$babysit-pr` only when the user
   explicitly asked to babysit, shepherd, or finish the PR.

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
- For UI changes, include screenshots of every affected state needed to review
  the change. Use before-and-after images when the old behavior matters. Attach
  images to the PR through an authenticated GitHub UI or use durable artifact
  links. Local file paths are not review evidence.
- For performance changes, report a like-for-like baseline and result. Include
  the command or workload, environment, units, sample count, summary statistic,
  and variance when it matters. Measure the resource named by the change, such
  as latency, throughput, peak RSS, heap size, allocation count, CPU time,
  bundle size, or query count.
- For bug fixes, include the failing reproduction and the passing result when
  practical.

Keep large raw output out of the body. Summarize it and link the full artifact.
If required evidence cannot be collected or attached, keep the PR in draft and
state exactly what is missing.

## Completion

Finish when the remote PR points to the reviewed head, the rendered body follows
the contract, every material claim has direct evidence, all required checks
reflect that head, any remaining evidence gap is explicit in a draft PR, and the
PR URL has been returned to the user.

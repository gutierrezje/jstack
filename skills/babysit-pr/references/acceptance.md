# Accept the current head

Refresh the snapshot and reread the live PR, all current threads, review
dispositions, the DiffOwl coverage reports, hosted results, required real-surface
QA, and mergeability. Issue:

- `READY` only when every blocker has a disposition, required hosted checks pass,
  DiffOwl coverage reaches the current head with every finding disposed,
  every independent review that ran has every finding disposed,
  every thread cleared by the current head is resolved, mergeability is
  acceptable, matching project verification recipes cover the changed
  user-visible journeys and are current or real-surface QA explicitly does not
  apply,
  the full-review checkpoint plus contiguous repair ranges cover through the
  current head, and all live evidence covers that head.
- `NOT READY` when a known code defect, required check failure, unresolved
  blocking feedback, unresolved DiffOwl blocker, or mergeability problem remains.
- `INCONCLUSIVE` when evidence or required QA is stale or missing, DiffOwl did
  not complete for the current head, checks are unsettled, or an infrastructure
  failure cannot yet be attributed or resolved.

For a draft PR, treat `READY` as provisional until the PR is open for review.
When the user explicitly invoked this skill or directly asked to babysit,
shepherd, or finish the PR, run `gh pr ready <number>` only after every `READY`
condition passes. Refresh the live PR immediately. Issue `READY` only when the
head SHA is unchanged and the PR is no longer a draft. If the transition fails
or the head changes, issue `INCONCLUSIVE`. If this skill lacks explicit user
authorization, ask before changing the draft state. A PR already open for review
needs no transition.

Include the [DiffOwl handoff receipt](../../jesus-mode/references/diffowl.md#handoff-receipt)
and add the current PR acceptance evidence:

```text
hosted-checks: <coverage and result for all checks at head>
real-surface-qa: <feature IDs, exact client/build, backend/data target, artifacts, cleanup, result> | not applicable because <reason>
feedback: <unresolved claims and dispositions, grouped>
mergeability: <current state>
review-state: <draft or ready; transition result when applicable>
verdict: READY | NOT READY | INCONCLUSIVE
```

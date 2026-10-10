---
name: ship
description: "Merge, release, close or reconcile delivery issues, and clean up branches and worktrees."
---

# Ship

Carry the selected work to the user's requested endpoint: merged, released,
issues reconciled, cleaned up, or a combination. Report progress and results in
chat. Reconcile live state with task history before repeating an action.

## Scope and authority

Resolve the repository, PRs or source revision, release target, related issues,
and cleanup set from the request and existing instructions. Treat a merge-only
request as ending at merge. "Production if applicable" selects the repository's
established release path; distinguish no release surface from an unknown or
blocked release path.
Select issue reconciliation and cleanup only when requested or already authorized.
When selecting phases, account for
[owned QA simulator lifecycle](../jesus-mode/references/simulator-lifecycle.md)
and any standing user or repository cleanup policy. Such a policy selects its
authorized disposal scope; otherwise keep a merge-only request at merge.

Reuse user authorization covering each operation and target. Automatic skill
selection and a retrieved shipping example grant no authority. Prepare the exact
operation and evidence before asking for missing authority; continue independent
preparation while that action waits. Follow the
[external-action contract](../jesus-mode/references/codex-compatibility.md#external-and-destructive-actions).
Read its Claude Code overlay when running there.

Discover automatic release triggers and issue closures before merging. A merge
that triggers a production deployment, publication, or issue closure needs
authority covering that consequence, even when the request says merge only.
For automatic issue closure, follow [issue scope](references/issues.md#resolve-related-issues)
before merging. Stop before a merge whose automatic consequence exceeds the
user's scope or would close an unresolved issue.

## Workflow

1. **Resolve delivery.** Inspect repository release instructions, workflows,
   and live PR, issue, or deployment state. State the selected phases, exact
   targets, expected release delta, and completion checks. This step ends
   when each phase is selected or excluded and every unknown target or missing
   authority is explicit. For a preview or dry-run request, keep consequential
   mutations out of the run; use a provider dry run only when it is read-only.
2. **Reconcile prior progress.** Compare live state with task history. Adopt an
   already merged PR, completed release, reconciled issue, or removed cleanup
   target only when its identity and result are proved. An interrupted or
   ambiguous deployment needs a status read before a retry. This step ends with
   the next incomplete phase identified and earlier results confirmed or marked stale.
3. **Merge when selected.** Follow [merge](references/merge.md). This phase ends
   with every landed PR confirmed merged at its recorded revision; report the
   first blocked PR and retain its dependent stack.
4. **Release when selected.** Follow [release](references/release.md), including
   when merging started an automatic rollout. This phase ends when the intended
   source is released to each selected target and the relevant live checks pass,
   or when a specific release gate remains blocked. A repository with no release
   surface can be reported as not applicable, with the evidence for that decision.
5. **Reconcile issues when selected.** Follow [issues](references/issues.md).
   This phase ends when each scoped issue is confirmed resolved and closed,
   updated to reflect partial delivery, or retained with its remaining work or
   missing authority reported. For an issue-only run, verify the existing
   delivery before making changes.
6. **Clean up when selected.** Follow [cleanup](references/cleanup.md). In a
   combined run, start after the selected delivery checks pass. This phase ends
   when each scoped target is removed or explicitly retained with a reason.

Continue authorized in-scope repairs and checks until the selected endpoint is
proved. Keep downstream phases pending when a prerequisite fails. Rollback,
history rewrites, and wider repairs use their own applicable authority.

## Completion

Report in chat the merged PRs and revisions, released targets and source
identities, live verification, issue outcomes, cleanup results, and remaining
blockers.
Call the work shipped only when every selected delivery phase is verified.
Distinguish merged, deployed, verified, issues reconciled, and cleaned up in
partial outcomes.

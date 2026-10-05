# Merge

Use the [GitHub transport contract](../../jesus-mode/references/codex-compatibility.md#github-transport).
Resolve the intended PR set, dependency order, base branches, and repository merge
policy. Use ordinary GitHub flow; use Graphite only when configured and requested.

## Accept the current head

Freeze each PR's base and head. Apply
[current-head acceptance](../../babysit-pr/references/acceptance.md) and the
[DiffOwl coverage contract](../../jesus-mode/references/diffowl.md). Reuse completed
coverage and wait for an adequate running review. A workflow transition alone
does not justify another full review.

Resolve every finding from reviews that ran, including automatic reviews, with
evidence. A suspected false positive needs a relevant reproduction or source
proof. Use disposable fixtures or authorized read-only queries when checking
storage behavior. Record dispositions in the review record; update the PR body
or threads only within the user's publication authority.

Use [$babysit-pr](../../babysit-pr/SKILL.md) for missing acceptance evidence or
in-scope repairs. Retain its authority boundaries. Merge readiness requires
passing required checks and current review and QA evidence for the frozen head.
If the head or base changes, refresh acceptance and the affected coverage before
merging.

## Land and confirm

Use the repository's permitted merge method and an expected-head guard. For a
squash merge through GitHub CLI:

```bash
gh pr merge <pr> --squash --match-head-commit <reviewed-head-sha>
```

Recheck the live PR and target base immediately before the operation. A changed
head or base returns to acceptance. Use merge-when-ready when requested, and use
a merge queue when repository policy requires it within the authorized merge
scope. Queue enrollment is pending; wait for the platform to confirm the actual
merge.

For dependent PRs, land the contiguous verified run from the bottom, one at a
time. After each merge, fetch the base, read back the merged state and resulting
commit, and refresh the next PR's base, head, checks, and coverage. Stop at the
first failed gate. Retargeting or rewriting a descendant still needs the
applicable authority.

Confirm the resulting merge revision is present on the intended base and record
its relationship to the reviewed PR. Preserve the PR head and actual landed
diff for release and cleanup; squash and rebase merges can change commit identity.

Completion: each landed PR had valid acceptance at merge time, the forge
confirms it merged, and the intended base contains its resulting revision.

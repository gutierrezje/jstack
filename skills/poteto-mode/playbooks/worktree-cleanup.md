# Worktree cleanup

1. Audit disk and enumerate exact worktrees from git. Record branch, head, dirty state, age, merge/PR state, size, and known owner.
2. Classify each as active, preserve-WIP, merged-safe, abandoned-candidate, or unknown. Unknown stays.
3. Present exact deletion candidates, sizes, recovery paths, and separate simulator/cache targets. Obtain confirmation for destructive sets not already explicitly authorized.
4. Preserve WIP with a branch, patch, or archive before removal. Prefer recoverable deletion.
5. Remove only confirmed targets, then run git worktree prune and remeasure disk.
6. Report removed targets, bytes reclaimed, preserved WIP, and remaining unknowns.

Completion: every removed target was resolved and authorized, and no dirty or active work was lost.

# PR repairs and review threads

Use the [DiffOwl coverage contract](../../jesus-mode/references/diffowl.md)
for review scope, reuse, fallback, independent review, and finding dispositions.

For every human, bot, or DiffOwl finding, substantiate it against the current
checkout and PR state. Record evidence, severity, affected code, and disposition.
Use `$diffowl-resolve` when available, or perform the same investigation and
durable disposition directly. Keep `.diffowl` reports as workflow records;
commit them only when the repository tracks them or the user requests it.

Resolve a review thread after the current head and focused verification clear
its concern, including when GitHub marks the original location outdated. Resolve
non-bug threads only when current code and evidence make that disposition
conclusive. Leave disputed findings, unsettled repairs, and questions needing
human judgment open. Use the thread-aware API or GitHub plugin and reread the
result. Public replies need separate authorization.

For substantiated blockers:

1. Make the smallest in-scope repair and run focused verification.
2. Commit a coherent, verified repair unit under the active authorization.
3. Follow the DiffOwl contract to extend coverage and dispose findings. Keep
   subsequent repairs local until the next coherent unit is ready.
4. Before pushing, inspect the complete repair delta. Require passing local
   checks, coverage through the local head, dispositions for all findings and
   independent reviews, no known repair remaining, and no review still running
   on that head.
5. Non-force push to the existing PR branch when authorized. Confirm the remote
   OID equals the reviewed local OID and update the shared coverage receipt.
   Refresh hosted checks and acceptance against that remote head.

If the request is read-only or otherwise narrower, report substantiated findings
and missing authority while continuing independent authorized work.

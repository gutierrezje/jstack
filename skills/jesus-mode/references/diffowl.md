# DiffOwl coverage contract

Use DiffOwl as the source of truth for expensive model-review coverage. DiffOwl
does not replace repository checks, hands-on QA, or decisions that need product
or publishing authority.

Apply this contract to executable code changes and pull-request review. Skip
model review for text-only documentation, prompts, metadata, and instruction
changes unless the user asks for it or the repository requires it.

## Ownership

- DiffOwl owns reviewer configuration, review execution, findings, dispositions,
  timestamped reports, and the commit or range each report covers. Read reviewer
  models and providers from DiffOwl configuration instead of choosing them in
  Jstack.
- Repository tests and hosted CI own deterministic checks.
- The active workflow owns architecture, implementation, real-surface QA, and
  authorization.
- GitHub owns PR state, hosted checks, and review threads.

## Build one coverage chain

1. At the first coherent checkpoint, obtain one complete DiffOwl review of the
   exact `base...head` change. Reuse an existing successful report when its base,
   head, and effective diff match. A workflow transition from implementation to
   Open PR or Babysit does not justify another full review.
2. After that checkpoint, cover repairs with exact commit reviews or contiguous
   repair ranges. Prefer automatic post-commit reviews. A new commit extends the
   chain; it does not erase earlier coverage.
3. Start another full review only when the base or history changed, a repair
   broadly changed the reviewed design or behavior, or the existing chain cannot
   be proved.
4. Preserve the report identity, exact base and head, reviewed commits or range,
   result, and finding dispositions. Prove coverage from report metadata and Git
   OIDs. A mutable `latest` alias is not proof by itself.

When commits are part of the authorized workflow, create a commit only after the
work forms a coherent, verified unit. Let its automatic review finish before
starting a manual review for the same commit. Keep follow-up fixes local until
they form the next coherent repair unit.

For a read-only PR review, review its committed `base...head` range and report
findings without making repairs. Lack of commit authority does not change the
review target.

For uncommitted implementation when commits are not authorized, run one full
staged or working-tree review at the coherent checkpoint. Batch authorized local
repairs and inspect the focused repair delta directly. Run a second full snapshot
only when the repair broadly invalidated the first review. Never label a repeated
full snapshot as repair-delta coverage.

If automatic coverage is missing, failed, or stale, run one manual fallback with
the same exact scope. If the available DiffOwl interface cannot prove coverage,
record the gap and keep any readiness verdict `INCONCLUSIVE`.

## Findings and corrections

Treat every finding as a claim. Verify it against the current code, record its
disposition, and clear it only with a proven fix, a reproducible non-bug result,
or an accepted decision from the required authority.

After a correction, put the lesson in the strongest practical place:

1. Change the architecture or data structure when it can prevent the invalid
   state.
2. Add a test, lint rule, or CI check when the failure is deterministic.
3. Change a skill or instruction when the decision still needs agent judgment.
4. Leave a human gate only for product intent, accepted risk, or new authority.

Apply an in-scope structural fix now. Record a concrete follow-up when the right
fix belongs outside the task. Do not add another instruction when code or a test
can enforce the rule.

## Independent review

Use Codex's review agent as a second opinion when the user requests it or the
change has meaningful security, authorization, data, migration, concurrency, or
architectural risk. Run it while DiffOwl or hosted reviewers are already working
when that saves time. Pin it to the same exact scope and keep one successful
record per scope.

An independent Codex review is not a default requirement for every repair
commit. When a repair warrants an independent review, scope that review to the
commit. Let DiffOwl provide the ordinary coverage chain.

## Handoff receipt

Pass this receipt between implementation, Open PR, Babysit, and Shipping:

```text
base: <SHA>
head: <SHA>
full-review: <base...head, report identity, result, dispositions>
repair-coverage: <commits or ranges through head, reports, dispositions> | none
pending-review: <scope and runner> | none
independent-review: <scope, result, dispositions> | not required
coverage-gap: <missing or stale evidence> | none
```

Publishing an already reviewed commit preserves DiffOwl coverage when the remote
OID matches the reviewed local OID. It invalidates hosted verification and final
acceptance, which must refresh against the remote head.

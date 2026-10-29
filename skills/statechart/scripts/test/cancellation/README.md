# Cancellation model fixture

This is a small, source-informed safety model for one active DiffOwl review turn. Keep the model, config, regression test, and this scope description aligned when cancellation semantics change.

Run the maintained regression from scripts/ with the pinned TLC jar in TLA2TOOLS and the pinned Java executable in JAVA:

    node --disable-warning=ExperimentalWarning --test test/cancellation.test.ts

The test checks the baseline, a disposable early-clean-cancellation mutant, and the restored baseline with both the statechart CLI and plain TLC. It creates temporary copies and output folders, then removes them.

## Modeled behavior

The initial state is an already active, correctly correlated thread and turn. Cancellation moves the turn into reconciliation, where a completion can still win. Otherwise the model sends an interrupt, receives its acknowledgment and matching interrupted terminal status, closes the App Server child, checks the repository after the close attempt, and reports the result.

The model includes protocol failures, persistent repository mutation, normal child exit, forced close, and rejected close. CleanCancellation requires an acknowledged interrupt, terminal interruption, child exit, a post-close check, and no fault or mutation. MutationPreserved independently requires repository mutation to take precedence in the final result. FinalResultConsistent checks only that a recorded final fault matches the result; it is not a separate proof of precedence.

## Exclusions

The model assumes a single already active turn and omits startup and authentication, retries and multiple turns, notification correlation and filtering, provider behavior, snapshot-read failures, descendant processes, transient mutations later restored, and precise timing. It checks safety only; it makes no liveness or fairness claim.

The source context was pinned to DiffOwl commit fb1b72aa36cb7af32c6683f3470e2c2e8baabf0d. This fixture preserves the reviewed abstraction; it does not copy or execute the upstream implementation.
The maintained [source map](source-map.json) ties each transition to that revision's
source and distinguishes historical test evidence from current model checks.

## Baseline expectation

The reviewed baseline model SHA256 is 9ab6f1f2175d7e60bafa69ba71cabeb8db9b6901d1d8b6c94ce50bde91d5be08. The pilot observed 116 reachable distinct states on the baseline with both checkers. The maintained test rechecks that count before and after the mutant. Statechart completes exploration after finding a broken rule, while plain TLC stops at its first counterexample, so their mutant state counts differ; the test requires matching failure status and CleanCancellation as the first plain-TLC violation. Update the baseline expectation only after reviewing a model change and confirming fresh agreement with plain TLC.

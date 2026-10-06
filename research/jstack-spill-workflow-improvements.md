# Jstack and Spill workflow improvements

Status: proposals for evaluation, October 5, 2026. The first implementation is
the invocation-policy validator repair described below. The remaining proposals
need evaluation before adoption.

Improve verified outcomes per human intervention by making repeated work
executable, enforcing known invariants, and measuring workflow changes. Jstack
already expresses most of this approach. Spill supplies concrete journeys and
failure cases on which to test it.

## Basis and existing capabilities

The supplied Lauren Tan interview emphasizes verification at 16–24 minutes,
structural constraints at 25–32 minutes, connecting external context to execution
at 35–45 minutes, and collecting recurring findings before fixing them at 47–51
minutes. Its PR-volume claims are personal experience, not a target or an
evaluation result for Jstack.

Jstack already has a [verification contract](../skills/jesus-mode/references/verification.md),
[structural correction workflow](../skills/correct/SKILL.md),
[evaluation playbook](../skills/jesus-mode/playbooks/eval.md),
[orchestration playbook](../skills/jesus-mode/playbooks/orchestrate.md), and
[reflection workflow](../skills/reflect/SKILL.md). Extend these where an observed
gap warrants it. Keep project-specific runtime mechanics in Spill.

Spill already has mobile and admin controllers, feature recipes, machine-readable
receipts, executable recovery experiments, performance procedures, anti-slop lint
rules, and a nightly product review. A written recipe, a tested executable
scenario, and a successful run on the current target establish different facts.

## Proposed work and acceptance

### Enforce invocation policy in Jstack

The repository requires compatible Codex and Claude invocation policies, but
`checkInvocationParity` in the validator is a stub at baseline
`6ab1677057b0781fa6d81b2b8b8991f950e8564d`. A disposable copy with Codex implicit
invocation disabled and Claude's disabling flag removed still passes validation.

Implement the check in the existing validator and add command-level regression
tests using disposable plugin fixtures. Preserve the dependency-free validation
command. Inspect actual metadata scopes so examples in a skill body cannot stand
in for frontmatter.

Acceptance: matching explicit settings and defaults pass; both mismatch
directions fail with the skill and the two relevant settings identified. The
unmodified skill catalog and available platform validators must still pass.
This proves enforcement of one repository invariant, not improved agent output.

Local result: the first 13 command-level cases exposed five failures on the
baseline and passed after the repair. Review exposed two additional scope/format
gaps, covered by four more cases. All 17 final cases pass. The check explicitly
requires a block-style `policy` mapping and reads only its direct field plus
Claude's root frontmatter flag. The repository validator and Claude marketplace
validator pass; the optional system Python plugin validator is unavailable.

### Make verification coverage actionable

Jstack already requires discovery of executable scenarios before assembling UI
actions. Make the project's existing coverage index expose the distinction
between executable, agent-driven, assisted, and unavailable coverage. Link each
executable scenario to its command, assertions, platform, fixture requirements,
and evidence. Reuse runner discovery rather than maintaining a second registry.

In Spill, promote one frequently repeated journey into an executable scenario.
Candidates are normal sip publication followed by reopening it in Journal, or
Lists-to-Log conversion. Choose from observed repetition and existing fixtures.
Keep discovery and new-state exploration interactive.

Acceptance: a fresh agent selects the right existing scenario without reading
driver internals; the scenario checks persisted results and cleanup; a deliberate
product failure cannot receive a passing verdict. Measure setup interventions,
scenario-selection errors, and completed journeys. Source, build, runtime and
fixture identity must match the claim.

### Enforce ownership of shared Spill resources

The October 4 nightly ledger records a development deployment replacing another
branch's schema/functions and a separate overlapping cleanup implementation.
These are historical coordination signals; recheck current ownership before any
action. Spill already documents one owner for the shared Convex development
deployment.

Inspect the actual deployment path and add the smallest enforceable ownership
check at that boundary. Track work ownership alongside the existing issue/PR
queue. Separate worktrees isolate source; shared backends and devices need their
own ownership rules. Preserve explicit transfer of ownership and recovery from
stale ownership records.

Acceptance: demonstrate in a disposable environment that a competing owner is
rejected before mutation, that the valid owner can proceed, and that an explicit
transfer works. Evaluate recurring conflicts before building a general scheduler.
The proposal does not authorize deployment or a change of shared-dev ownership.

### Evaluate Jstack against bounded Spill cases

Turn the evaluation playbook into a small runnable corpus before treating prompt,
routing, or reviewer changes as improvements. Begin with sanitized cases derived
from observed failures: selecting an existing recovery scenario, rejecting stale
runtime evidence, distinguishing a fixture failure from a product defect, and
testing an integration through its actual SDK boundary.

The Sentry investigation is an example of the last case: tests that supplied
constructed events missed behavior in the rejection-to-report path. The repair
adds real SDK coverage. Reproduce the test gap in an isolated fixture before
using it as an evaluation case; do not include private event data or credentials.

Freeze the task, starting revision, model, context, tools, budgets, and grading
criteria. Compare the current workflow with one proposed change in isolated
checkouts. Score observable artifacts using deterministic assertions where
possible and blinded review where judgment is necessary. Retain failed attempts.

Report correctness, unsupported completion claims, human interventions,
completion time, and available usage/cost measurements. Record unavailable
measurements as unavailable. Use multiple cases and repeated trials before
claiming a general improvement. A successful single pilot proves feasibility.

### Close the nightly feedback loop

Extend Spill's existing nightly review with a compact record of recurring failure
classes: evidence, linked issue or PR, owner, proposed remedy, and recurrence
after the remedy. Cluster related reports before dispatching implementation.
Use the existing tracker and ledger; keep one owner for each accepted unit.

Route deterministic lessons through `$correct` into architecture, types, checks,
or tools. Reserve skill prose for decisions that still require judgment. Handle
one-off incidents without creating permanent rules for every exception.

Acceptance: replay a bounded set of historical findings. Related reports should
share an owner and remedy, completed work should not be reopened from stale
evidence, and distinct failures should remain separate. Then assess recurrence
and duplicate work over a declared observation window. Any recurring execution
or external posting needs authority covering that action.

### Complete one performance experiment

Spill's performance guide supplies procedures, workload recipes, and templates;
it explicitly does not supply an automatic profiler, trial runner, or comparator.
Prove one complete manual workload first, such as `picker-type-select` or
`feed-live-scroll`, then automate its repeated actions and measurement extraction.
Keep collectors replaceable and reuse the native controller.

Acceptance: an unchanged-build A/A run estimates noise; equal-condition A/B
trials and fresh confirmation establish any retained improvement. Freeze the
metric, correctness guards, sample plan, and meaningful threshold before testing
the candidate. Keep native timing separate from video and controller duration.
Preserve inconclusive and losing trials. Broader tooling follows only after one
real end-to-end experiment works.

## Evaluation sequence

1. Repair invocation parity and retain red/green command evidence.
2. On one authorized Spill task, record the current workflow from a fresh agent
   context. Count interventions and capture the exact verification gap.
3. Implement one change that addresses that gap, then compare equivalent cases
   using the frozen evaluation procedure.
4. Retain improvements that meet their predefined threshold without reducing
   correctness. Simplify or remove changes that add cost without measured value.
5. Expand scenarios or concurrency only where evidence supports the expansion.

Keep confidence and authority separate. Passing checks do not make account
deletion reversible, grant merge/deployment authority, or settle product design.
Maintain human judgment for product intent and explicit boundaries for external
actions.

## Evidence references

Jstack references above resolve within this repository. Spill references below
are paths in its own repository, inspected October 5, 2026; the ledger describes
October 4 events and is not a current release or incident-status report.
Spill's primary checkout was at `88b7c6dce49cb7968fb8d4625479d67d25d855ba`;
worktree-specific evidence is identified separately below.

- `docs/verification.md` and `docs/verification/mobile-experiments.md`: existing
  controllers, executable scenarios, fixture handling, assertions, and receipts.
- `.agents/skills/verify-spill-mobile/features/README.md`: mapped recipes and the
  explicit distinction between mapping and a verification verdict.
- `docs/performance.md`: usable performance procedures and implementation gaps.
- `AGENTS.md`: shared backend ownership and worktree policy.
- `docs/ledger/2026-10-04.md`: shared-dev replacement and overlapping work.
- The chats “Set up nightly product review” and “Check this morning’s Sentry
  issue”: historical decisions and the real-SDK test gap. The Sentry repair was
  inspected on `bugfix/sentry-actionable-diagnostics`; its review/release status
  must be checked separately before relying on it.

Invocation defaults were checked against the official
[OpenAI skill metadata documentation](https://learn.chatgpt.com/docs/build-skills)
and [Claude skill frontmatter documentation](https://code.claude.com/docs/en/skills).
Codex defaults to allowing implicit invocation; Claude defaults to allowing
model invocation. Their explicit disabling flags therefore have opposite values.


## Spill pilot and retained fix (October 5, 2026)

The chat “Verify sip retry avoids duplicates” supplied the first observational
baseline. Its fresh prompt found `held-success` without being told the scenario.
After a real simulator restart and retry, the complete backend observations held
one unchanged sip and one unchanged receipt. There were no follow-up user
instructions. The whole task took 827,825 ms; the successful scenario took
54,194 ms. These are workflow/controller durations, not app performance samples.
Token usage and cost were unavailable.

The baseline exposed setup friction, so the retained change belongs in Spill's
experiment adapter. Jstack's existing discovery guidance worked for this case.
The follow-up used GPT-6.1 Sol agents for evidence audit, setup investigation,
evaluation, and independent review, with parent integration.

Controlled checks against the installed agent-device 0.21.15 reproduced a daemon
whose installation had lost its iOS helper. The current CLI still failed while
using that stale daemon; the same CLI prepared the runner successfully with a
fresh state directory. Separate controller directories still enforced the shared
device claim: a second session was refused, the owner remained usable, and the
second session was admitted after the owner released its claim.

The first candidate passed mocked tests but failed live acceptance. URL-only
`open --relaunch` was unsupported. Cleanup after rejected admission could also
stop a competing session's app through the driver's sessionless fallback. Both
failures were retained and repaired. A later video-finalization check exposed an
obsolete app-stop requirement; the finalizer now handles the new cleanup policy
while retaining the original requirement for older receipts.

The resulting Spill change:

- Gives each experiment its own daemon directory while keeping device claims
  shared.
- Uses the supported single app-and-development-URL cold-launch command.
- Skips UI capture and session cleanup when no successful open established
  admission. Cleanup never sends an app-targeted close.
- Requires confirmed session release and known, completed daemon cleanup.
  It deliberately leaves the app process as-is; the receipt says it may remain
  running, and the next run performs a claim-admitted cold relaunch.
- Keeps uncertain cleanup and mismatched runtime evidence inconclusive.

The final verification suite passed 186 tests. Regression tests failed the old
behavior before the corresponding repairs. Native source review covered the
initial change and exact repair deltas. DiffOwl's initial review found no issues;
the independent review and live tests found defects it missed. Passing unit tests
and a model review did not replace execution against the actual driver.

Live acceptance used Spill base `ea0b013286a6808dae9e2edf03b8452fb37a0492`:

- `qa-exp-jstack-foreign-20261005-004`: the competing owner kept the same app PID;
  the refused runner issued no capture, close, or retry input.
- `qa-exp-jstack-wrongsource-20261005-002`: an incorrect loaded-source marker was
  rejected before fixture preparation or publication.
- `qa-exp-jstack-isolation-20261005-002`: the filmed recovery journey preserved
  exactly one unchanged sip and receipt, changed the app PID, removed its pending
  draft, and released its session and daemon.

The final filmed run's canonical receipt is VERIFIED, with behavior VERIFIED,
evidence COMPLETE, and runtime integrity VERIFIED. The original clip and its
hash were preserved; a documented viewing-copy recovery corrected conflicting
decoder timestamps without changing the original ordered presentation timeline.

Receipts, recordings, and failed attempts remain under Spill's ignored
`artifacts/verification/runs/` directories. The final filmed run used staged
snapshot `c880d1f8e5f2d56b447018151b1622b6541d800c`, with stable runner hash
`dda14778d63537651ae53a8544a6b49568d46e4b3dddc3434cbce1a0fe8d7bf3`.
The earlier filmed run remains inconclusive: its recorded review was immutable,
so we collected fresh evidence after repairing verdict aggregation. Negative
controls used the same launch/ownership implementation before that pure verdict
repair. The implementation remains local on `bugfix/experiment-driver-isolation`.

This is evidence for a specific adapter defect and its repair, not a measured
improvement in general agent productivity. We replaced the proposed repeated
mock trials with a controlled real-driver reproducer and live negative controls;
we did not complete repeated blind agent comparisons or establish a speed gain.
The case covers a no-photo iOS simulator journey, not physical-device behavior
or Android runtime qualification. The final Journal showed two previously saved
items; their private contents were not inspected.

Retain this case in the workflow evaluation corpus. For future controller
changes, include actual dependency-boundary and ownership-negative checks.
Additional Jstack instructions are unnecessary for this particular failure: the
stronger remedy is the adapter change plus executable regressions and preserved
live acceptance evidence.

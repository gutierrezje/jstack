# Verification experiments — 2026-10-15

Two bounded experiments are complete. Neither meets its frozen promotion rule:
the tooling candidates expose one regression, and the additional verification
checklist produces too little improvement to justify adoption. Production skills,
scripts and the installed plugin are unchanged.

The preceding [Jstack audit](../plans/improvement-audit-2026-10-15.md) explains
why these behaviors were selected. Its findings describe the earlier audit
snapshot; the experiment results below add measured evidence without rewriting
that history.

These experiments follow Jstack's [eval playbook](../skills/jesus-mode/playbooks/eval.md):
freeze inputs and scoring before trials, compare equivalent conditions, preserve
outputs and failures, and decide against a threshold chosen before seeing results.

## 1. Tooling candidates: a regression prevents adoption

The baseline is Jstack revision `57ce511b2bac12d019f1deaccb47fccce0c48cb2`.
Four candidate variants are tested independently against that baseline; this is
not an integration test of one combined patch.

| Area | Baseline meets desired behavior | Candidate meets desired behavior |
| --- | ---: | ---: |
| Upstream-to-local sync mapping | 4 / 8 | 8 / 8 |
| Invocation-policy validator | 8 / 11 | 10 / 11 |
| Plan Markdown fences | 5 / 10 | 10 / 10 |
| Portable validator: actual script controls on macOS | 2 / 2 | 2 / 2 |
| Simulated Windows path helper | 0 / 2 | 2 / 2 |
| Historical pooled score | 19 / 33 | 32 / 33 |

Thirty-one cases execute actual baseline or patched scripts in disposable
fixtures. Two cases compare path expressions on simulated Windows strings.
They bypass the patched validator source entirely: they illustrate the proposed
mechanism but do not validate that patch or a Windows validator. Excluding those
helper probes, the actual script results are 19/31 versus 30/31. Analyzer cases
use a local synthetic Git remote and the real analyzer; no upstream network sync
ran. The pooled score is retained as historical data, not presented as 33
candidate-source tests.

The candidate set passes all 15 targeted cases but retains only 17 of 18
controls. Reusing the exact validator source from the older invocation-policy
branch also removes the newer description-length guard. A 120-character
auto-invoked description is wrongly accepted. The frozen rule requires every
case to pass, zero false accepts and all controls retained, so adoption fails.

This is a regression from wholesale reuse of an older source file. It does not
show that the invocation-parity logic itself is defective or that cherry-picking
only that logic would remove the guard. The two source commits share merge base
`6ab1677057b0781fa6d81b2b8b8991f950e8564d`; the candidate commit is not a
descendant of the experiment baseline. A future integrated candidate should
preserve the guard and be frozen and tested as a new comparison.

All 33 baseline predictions reproduced the diagnosed behavior. That is distinct
from the baseline's 19/33 correctness score: both arms use the same desired
outcomes for correctness. Read the [protocol and runner guide](tooling/README.md),
[pre-run scoring clarification](tooling/scoring-clarification.md),
[frozen cases](tooling/frozen-manifest.json), and [complete outputs](tooling/results.json).

For a new replay, use the safe entry point below with a new directory whose
parent already exists outside the repository. The historical `run.mjs` command
in the frozen guide can overwrite its report; preserve it as historical code and
use `replay.mjs` for new runs.

```bash
node experiments/tooling/replay.mjs --output-dir /tmp/jstack-eval-new-run
```

The wrapper verifies the frozen source, generates a copy with only recording and
output-location changes, journals each completed case, and refuses an existing
output directory. It records the generated source hash and retains partial
evidence when a later case fails. Exit zero means the comparison completed;
candidate acceptance is the `promotionThresholdMet` field in the result.
This safe replay path was checked with forced failure after the first case;
the original 33-case trial was not rerun or rescored to seek promotion.

## 2. Evidence judgment: no case for another checklist yet

Six fresh native Codex subjects adjudicated 12 synthetic evidence packets each.
There were three runs per arm, with identical case orders within each pair.
Both arms received the existing verification and video guidance. The treatment
also received a short claim-to-evidence checklist.

| Measure | Existing guidance | With checklist |
| --- | ---: | ---: |
| Correct verdict plus required citations | 35 / 36 | 36 / 36 |
| Correct verdict | 35 / 36 | 36 / 36 |
| False VERIFIED decisions | 0 | 0 |
| Per-run full passes, out of 12 | 11, 12, 12 | 12, 12, 12 |

The one miss calls evidence from the wrong build NOT VERIFIED instead of
INCONCLUSIVE. The subject correctly explains that the requested target was not
proved; it does not falsely claim success. The improvement is one decision,
below the required four. No checklist is promoted.

Read the [experiment design and reproduction commands](evidence/README.md),
[detailed analysis](evidence/results/analysis.md), [scores](evidence/results/scores.json),
and [independent safety audit](evidence/results/safety-audit.json).

The route requested `luna-high-fast` (`gpt-6-luna`, high effort). Actual model,
effort and service tier are not independently exposed in the saved artifacts.
Coarse parent-observed run times were 41–78 seconds, including tool and
orchestration time; pairs may run concurrently. Tokens and monetary costs are
unavailable. These timings support no speed comparison. The 72 decisions are
repeated cases in six subject runs, not 72 independent real-world tasks.

## Integrity, checks and scope

Inputs, candidates and scoring rules were frozen locally before their trials;
raw outputs and unsuccessful cases are retained. The candidate checklist and
script fixes were not adjusted after seeing results.

Two bookkeeping facts remain explicit rather than rewriting frozen history:

- The tooling candidate source copy was initially omitted, leaving a stale
  manifest pointer. Review prompted restoration of that exact file from the
  pinned commit, verified against its pre-run SHA-256. The runner still
  reconstructs the identical source from `patches/invocation-policy.patch`.
  No frozen manifest or trial output changed. The frozen README's “based on”
  wording describes the reconstruction base, not ancestry.
- Independent review found that the evidence grader's invalid-schema path can
  hide an observable false-success count. The original frozen grader is kept
  for historical reproduction. A separately tested safety audit fixes that
  measurement without changing inputs or scores. All six actual responses are
  valid; the audit confirms zero false successes. Future experiments should
  integrate that correction before freezing their grader.

The evidence grader and corrective audit have nine passing regression tests;
the safe replay harness adds three passing checks for overwrite refusal,
repository-boundary rejection and persisted progress after failure.
The tooling comparison completed its single planned pass. Repository structural
validation and Claude plugin validation pass; the intentionally omitted Claude
manifest version produces advisory warnings. Native Codex source reviews and
their scope are recorded in [the review record](review-record.md).

DiffOwl coverage is missing: its selected backend is OpenCode and no model is
configured. No provider was selected or source sent through that path. Plugin
implementation readiness therefore remains INCONCLUSIVE under Jstack's review
contract; this does not invalidate the recorded experiment observations.

## What to test next for Spill

These results do not measure native UI fidelity or end-to-end verification.
The next useful experiment should require agents to discover and collect proof
from an executable Spill journey. Freeze known-good and deliberately broken
variants: incorrect saved rating, lost draft after restart, stale installed
bundle, duplicate publish after retry, and a clipped action at large text size.
Compare the current workflow with a normalized outcome contract under equal
model and run budgets. Grade persisted values, actual runtime identity and
visible outcomes; count false completions and human corrections.

Separately, build a human-approved visual corpus before measuring screenshot
judges. Include intended platform differences as well as known visual defects.
Only then can a Swift/Kotlin port have a meaningful first-pass acceptance rate.
Correctly judging supplied text is insufficient evidence for that claim.

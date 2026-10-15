# Evidence adjudication experiment

This experiment tests whether a short operational checklist improves an agent's
interpretation of supplied verification evidence. It does not drive Spill,
compare images, or measure the reliability of a native rewrite.

The experiment follows the [eval playbook](../../skills/jesus-mode/playbooks/eval.md).
Its [protocol](protocol.json), [cases](cases.json), [answer key](answers.json),
[candidate checklist](checklist.txt), grader and packets were hashed in
[the freeze manifest](frozen.json) before any subject was dispatched. A native
Codex reviewer checked the case/rubric alignment before freezing. The rubric was
clarified to distinguish citations supporting the verdict from citations needed
to report separate cleanup or capture problems.

## Design

Twelve cases contain four VERIFIED, four NOT VERIFIED and four INCONCLUSIVE
answers. Three repetitions use different, predetermined case orders. Within each
pair the baseline and treatment receive identical common task instructions,
source guidance and cases. The treatment also receives the candidate checklist.
The existing verification and video guidance comes from the pinned revision in
the protocol; the installed plugin is not modified.

Six fresh native Codex subjects use the `luna-high-fast` route. Each receives only
its assigned packet and writes only its assigned raw JSON output. The outer
dispatch instruction identifies those two paths, prohibits other reads and
delegation, requests raw JSON, and requires the shell's RTK prefix. It is the
same for every trial apart from paths. The two subjects in each pair may run
concurrently; dispatch order alternates C/D, D/C, C/D. Actual service tier is not
observable. Subjects have separate contexts but share a filesystem; these are
instruction boundaries, not enforced sandbox isolation.

Subjects do not see arm definitions or the answer key. The deterministic grader
does not use arm identities when grading individual responses. The analyst knows
assignments. This is not double blind. Ground-truth labels are human-readable,
frozen expectations derived from Jstack's existing contract, not labels produced
by the evaluated model.

A full case passes only if its verdict is correct, required citations are present,
and no evidence IDs are invented. Required citations include any separate capture
or cleanup caveat. Reasons remain in the raw record but are not graded. Verdict
accuracy and false success reports should also be reported separately so citation
formatting cannot masquerade as a behavioral improvement.

Promotion requires at least four additional full passes out of 36, zero false
VERIFIED decisions, and no regression on a case that passed all three baseline
runs. An all-pass tie does not justify adding another instruction layer.

## Reproduce

From the repository root:

```bash
node --test experiments/evidence/grade.test.mjs
node experiments/evidence/run.mjs verify
node experiments/evidence/run.mjs score
node --test experiments/evidence/audit-safety.test.mjs
node experiments/evidence/audit-safety.mjs
```

These commands verify frozen inputs and regrade the saved outputs; they do not
pretend to rerun a model. `prepare` creates the packets and freeze manifest on a
fresh experiment, or validates the existing freeze without overwriting it.
Model reruns require six fresh subjects under the protocol, each reading its
assigned packet and saving a new output in a new experiment directory. Preserve
these original responses and create a new protocol for any changed prompt,
rubric, model or corpus. Do not delete the freeze to revise a completed trial.

The grader's tests inject false success, missing proof, fabricated citations,
duplicate/missing cases and malformed responses. Raw subject results and scores
are under `results/`; failed outputs must remain there too.

After the trials, independent review found that the frozen grader reports zero
false successes for an invalid-schema run, even when one recognizable decision
falsely says VERIFIED. The frozen code is retained as the historical experiment,
not offered as a general evaluation library. The separate safety audit counts
those observable false successes regardless of sibling errors and marks the
assessment incomplete for invalid or missing responses. Its regression tests
exercise the defect. All six actual responses are valid, so this correction does
not change the experiment's scores or promotion decision. Use the audit result
alongside the historical scores; future experiments should integrate the corrected
counting rule before freezing a new scorer.

## Interpretation limits

This is a small diagnostic corpus, deliberately based on known failure modes.
It is not a held-out production benchmark. Repetitions of the same cases are
correlated; the six subject runs are clusters, not 72 independent task samples.
The common evaluation prompt explicitly asks for evidence adjudication, so this
does not measure spontaneous compliance in ordinary coding tasks.

Wall time includes orchestration, tool calls, and delayed completion observation.
Paired subjects may contend for resources. It is not inference latency and
supports no speed comparison. Token use, monetary cost and delivered service
tier are unavailable. A subject that correctly judges supplied evidence might
still fail to discover, collect, or validate that evidence in a real application.

# Review and verification record

Review destination: native OpenAI Codex subagents under the user's standing
Jstack source-review authorization. No other provider received task source.
The structural gate used the installed
`cursor-team-kit:thermo-nuclear-code-quality-review` skill.
Exact source hashes for the repair scopes are in [review-scope.json](review-scope.json).

## Evidence experiment

- Pre-run rubric critic: `/root/native_verification`. Reviewed the protocol,
  cases, answer key, candidate checklist and existing verification/video guidance
  before any subjects ran. Clarified that mandatory citations can include
  separate capture or cleanup caveats. No treatment-only requirement found.
- Independent code reviewer: `/root/eval_structural_review`, requested
  `luna-max-fast` route. Reviewed the frozen `run.mjs`, its tests, protocol and
  artifacts, pinned by `evidence/frozen.json`.
- Finding: an invalid-schema run discards recognizable decisions before counting
  false VERIFIED verdicts, so its safety count can misleadingly become zero.
- Disposition: preserved frozen historical code and added `audit-safety.mjs` with
  a separate count and explicit completeness flag. Four new tests exercise
  malformed siblings, duplicates, missing/unidentifiable decisions and valid
  decisions. The original five grading tests pass.
- Focused repair review by the same reviewer: no actionable issues. Frozen-input
  verification passed. All six safety-audit output hashes match the original
  score hashes; all six responses are valid and the false-success count is zero.
- The audit implementation hash is recorded in `evidence/results/safety-audit.json`.

## Tooling experiment

Independent review by `/root/eval_structural_review` covers the separate tooling
scope pinned by manifest SHA-256
`7996ef39cae4a87d9a5294a7b5822ad64462a6533019ba741b8b23b356b65226`.
Initial review found two issues:

- The Windows helper probes bypass candidate source. The top-level result now
  separates 31 actual-script cases from those two probes and explicitly states
  that they do not validate the patch. The frozen historical pooled score is
  preserved; no acceptance decision changes.
- The original runner writes only at completion and can overwrite prior results.
  A new safe replay entry point preserves the frozen historical runner while
  writing each completed case to a fresh output directory. Focused fault tests
  check partial evidence and overwrite refusal. Focused repair review is clean:
  the reviewer independently ran all three replay tests successfully, confirmed
  the restored candidate hash, and confirmed original runner/manifest/results
  hashes are unchanged. It did not rerun the complete experiment.

The candidate's description-length regression is an experimental result, not a
repair applied to production. It prevents promotion. The stale artifact pointer
was resolved by restoring the exact candidate source from its pinned commit and
verifying its pre-run hash; the frozen manifest and original results are intact.

## Other checks and coverage gaps

- Pre-push scope check: native Codex `/root/publish_scope_check` found no
  credentials, actual user-specific paths, production/user data or unrelated
  transcript/source copies in the public bundle and accompanying audit. It did
  not repeat the completed structural review or parent hash verification.
- Tooling runner: one complete pass, 33 baseline/candidate pairs; exact outputs
  retained. Candidate acceptance fails one negative control as intended by the
  frozen scoring rule. No candidate was repaired and the full trial did not rerun.
  Separate harness regression tests replay only the first case with an injected
  later failure; these checks are not pooled into the experiment score.
- Repository structural validator: passed after both experiment scopes existed.
- Claude plugin validator: passed; missing-version warnings are intentional under
  repository policy.
- System Python plugin validator: unavailable at its documented installation path.
- DiffOwl: `backend` reports default OpenCode, and `model` reports no selected
  model. No DiffOwl model-review coverage exists for this experiment scope.
  The configuration was not changed. Implementation readiness is INCONCLUSIVE
  under the DiffOwl coverage contract, despite completed native source reviews.
- No production app, device journey, native Windows process, screenshot judge,
  CI job, deployment, or installed-plugin update ran during the experiments.

The experiment bundle is prepared for the user-authorized commit and push on
`test/verification-evals`. Publishing it does not promote a candidate or install
the plugin. Production files match the pinned baseline, and the primary
checkout's unrelated work is preserved. The public bundle contains synthetic
case data and review summaries, not private transcripts or production/user data.

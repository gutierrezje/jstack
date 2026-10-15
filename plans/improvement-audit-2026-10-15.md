# Jstack improvement audit

Date: 2026-10-15. This is an audit and prioritization note, not an implementation plan or approval to change workflows.

The source checkout is at `57ce511b2bac12d019f1deaccb47fccce0c48cb2`, with existing uncommitted upstream-sync edits. The installed Codex copy is at `20f91624ada723ba8f53f92d4add5679a37522ea`. The working NOTICE records pstack `0.15.17`, commit `9d76bcab133aefcccb16121d7be874e6aa823729`. The public upstream head inspected was `99743e9c151c8537cbbf1f98bb38f34ef3368453`. Findings describe that source snapshot, including the existing edits. Those edits and the installed plugin were left unchanged.

Jstack has a coherent verification design. It already separates project-owned adapters from portable guidance, binds observations to runtime identity, requires explicit cleanup ownership, and distinguishes failed assertions from incomplete evidence. Its review contract preserves a full review plus repair coverage across implementation, PR preparation, babysitting and shipping. Adding another general verification instruction would contribute little.

The highest-value work is to repair the few executable gates, retain reproducible tests of those gates, and evaluate whether agents following the skills produce correct outcomes. Structural validity and behavioral reliability need separate evidence.

| Priority | Confirmed finding | Impact | Effort | Fix risk | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Upstream analyzer misses the `poteto-mode` to `jesus-mode` rename | Central workflow changes point to nonexistent local counterparts | S | Low | High |
| 2 | Invocation-parity validator is a stub | Codex/Claude metadata disagreement can pass validation | S | Low | High |
| 3 | Plan checker misparses valid Markdown fences | Valid plans fail checks; examples can be interpreted as live requirements | S | Low | High |
| 4 | Plugin validator assumes Unix path separators | Skill-name checks fail on Windows paths | S | Low | High |

Effort includes focused regression tests. S means hours rather than days; these are estimates, not measured completion times. The first four findings can form one bounded tooling change if their tests remain easy to review.

1. The analyzer's `map_local` function, [analyze.sh](../skills/sync-pstack/scripts/analyze.sh), lines 98–110, maps generic `pstack/skills/*` paths directly to `skills/*`. It handles several other renames but omits `poteto-mode`. An isolated execution of the actual function mapped the upstream main skill to `skills/poteto-mode/SKILL.md` and a playbook to `skills/poteto-mode/playbooks/multi-phase-plan.md`. Both belong under `skills/jesus-mode/`. The analyzer still lists the upstream changes; the defect is its incorrect local counterpart and resulting `missing` status. Add the specific mapping before the generic case, and test skill, playbook, reference and script paths. Test additions, deletions and renames using a small local upstream fixture rather than requiring a network clone for every regression run.

2. [validate.mjs](../scripts/validate.mjs), lines 26–31, describes invocation-parity checking but always returns `null`. The caller at lines 63–65 therefore cannot report a mismatch. [AGENTS.md](../AGENTS.md) requires a skill with Codex `allow_implicit_invocation: false` to have Claude `disable-model-invocation: true`. The current pairs appear aligned; this is a missing guard, not a claim that an installed skill is already misconfigured. Define the intended default/absence semantics, then test matching declarations, disagreement, absent fields and malformed values. Avoid treating an omitted flag as invalid merely because explicit flags are easier to parse.

3. [check-plan.mjs](../skills/jesus-mode/scripts/check-plan.mjs), lines 34–45, toggles a boolean only for backticks at column zero. A valid temporary plan containing a tilde-fenced example with `<example>` failed with `unfilled placeholder` on the code line. Track fence character, opening length and allowed indentation. Test tilde fences, indented fences, embedded shorter fences and real prose after the closing fence. Upstream has a recent fix and regression tests for this class, but its plan format differs from Jstack's. Translate the parsing behavior and cases instead of copying the complete checker. [Pinned upstream checker](https://github.com/cursor/plugins/blob/99743e9c151c8537cbbf1f98bb38f34ef3368453/pstack/skills/poteto-mode/scripts/check-plan.mjs), [upstream tests](https://github.com/cursor/plugins/blob/99743e9c151c8537cbbf1f98bb38f34ef3368453/pstack/skills/poteto-mode/scripts/check-plan.test.ts)

4. [validate.mjs](../scripts/validate.mjs), lines 34–40, constructs directories with `path.join` and then extracts their names with `split("/")`. On Windows, that split does not extract the directory name. Use platform-aware path handling and cover the differing path forms. This is a code-derived portability finding; no Windows host run was performed.

The validator has no standalone regression suite. The plan checker's inline self-test exercises three cases, which passed but do not cover the fence failure. Add tests that prove invalid inputs fail and valid variants survive. Run those tests alongside structural validation in a small CI job. There is no tracked `.github` workflow in the inspected checkout. Cross-host jobs should cover the hosts Jstack intends to support, without requiring a model account or external review service for deterministic checks.

The following are product-direction proposals, separate from confirmed defects.

| Proposal | Why it belongs in Jstack | First bounded result | Effort / risk |
| --- | --- | --- | --- |
| Durable verification-contract tests | Jstack defines common identity, evidence, verdict and cleanup obligations | A synthetic adapter plus fixtures that demonstrate correct failure handling | M / Medium |
| A behavioral evaluation suite for Jstack workflows | The product is agent behavior, but current automatic validation mainly checks files and metadata | A small corpus comparing the installed workflow with a candidate on equivalent tasks | M to L / Medium |
| Calibrated visual review | Matching references is part of the visual-parity playbook, but visual-model judgment has not been measured here | Approved examples of defects and acceptable changes, with measured misses and false alarms | M / Medium |

The [verification contract](../skills/jesus-mode/references/verification.md), lines 56–69 and 137–164, is a good foundation for conformance tests. Test that a wrong runtime identity, missing required observation, failed assertion, corrupt required artifact and interrupted run cannot produce a verified result. Test that successful cleanup does not turn failed behavior into success, and that cleanup preserves resources owned by another run. Include passing examples and optional-artifact cases so the contract does not reject legitimate results.

Keep this small and optional for project adapters. Validate the common envelope and verdict rules, allow explicit extensions, and leave product assertions and device mechanics in each project. A JSON schema can establish shape; it cannot establish that an artifact depicts the claimed action or that the application saved the correct value. Preserve those distinctions in the fixture and its expected results.

Jstack has already performed useful negative testing in the [video-evidence dry run](../research/video-evidence-dry-run.md). That report includes failed assertions, corrupt required media and runner termination. Its executable fixture and artifacts live in temporary storage, however, so the checked-in report is not a repeatable regression suite. Retain a minimal fixture and test logic in source, with generated recordings and logs outside tracked source. Reuse this work before inventing another example application.

The existing [eval playbook](../skills/jesus-mode/playbooks/eval.md) already calls for frozen inputs, blind judging, equivalent candidates, variance analysis and saved results. The missing investment is a maintained corpus and runner that applies it to Jstack. Useful initial cases include:

- A tiny documentation edit that needs neither runtime QA nor expensive code review.
- A bug with an existing executable journey that the agent should discover and reuse.
- A UI change with a valid visual reference and a second run with a mismatched reference state.
- A verifier receiving a stale-build receipt or a screenshot without the required persisted-state observation.
- A reviewed branch with one repair commit, where the existing coverage should be reused and the repair reviewed at the appropriate scope.
- A task resumed from a compact handoff, with one actual dependency missing and independent work still available.
- A provider/capability unavailable on the active host, where the result must state the limitation without inventing support.

Use synthetic tasks and fixtures to test both successful work and failure reporting. Freeze expected outcomes independently of the candidate workflow. Record false completion, missed defects, unnecessary user interventions, unnecessary repeated checks, task completion, elapsed time and cost. Distinguish a simulated tool transcript from a live host run; use simulations for routing and policy branches, then a smaller real-runtime lane for tool integration. Treat a small corpus as an initial engineering screen, not a guarantee about arbitrary future tasks.

For visual review, use examples approved for their intended purpose: a missing action, clipped large text, incorrect selected state, an acceptable native-control variation and a capture of the wrong application state. A useful judge must identify defects without rejecting every difference. Hold back some examples from tuning. Keep this an extension of [visual parity](../skills/jesus-mode/playbooks/visual-parity.md) and the eval workflow, not a requirement to add a visual model to every change. No screenshot transmission or new provider connection was performed in this audit.

Several possible changes were considered and not recommended now:

- **Another review layer.** The existing DiffOwl coverage contract already prevents repeated full reviews and selects independent review for meaningful risks. More reviewers are not evidence of fewer escapes.
- **Removing review gates to reduce latency.** Their cost is plausible, but this audit did not measure it. Gather review time, duplication and defect-detection data before changing the chosen policy.
- **Another instruction to learn from corrections.** [Correct](../skills/correct/SKILL.md) and the DiffOwl contract already direct recurring errors into architecture, tests and checks. Build and measure those mechanisms instead.
- **A universal UI automation framework.** Project-owned adapters are an intentional boundary. Jstack should supply contracts and examples without absorbing every platform's control logic.
- **Blind upstream synchronization.** The local visual-parity playbook already permits pixel or perceptual thresholds and includes interaction/accessibility checks. Upstream wording is evidence to consider, not automatically an improvement. Preserve local authorization and host adaptations.
- **Treating installed/source differences as corruption.** The source adds a Claude lookup route beyond the installed revision, and upstream edits are in progress. This is normal development state. Refresh through the supported installation path after intended changes are complete; do not patch the cache directly.

Recommended order: fix and regression-test the four concrete tooling defects; retain the synthetic verification-contract fixture; then establish a small workflow evaluation corpus. Add visual-review calibration when that reviewer is actually being adopted. Use the evaluation results to decide whether to shorten, split or otherwise change the guidance.

Verification during the audit: the repository validator passed for 29 skills and 175 text files before this note; the plan checker's three-case self-test passed; Node syntax checks for the two validators and shell syntax/help checks for the analyzer passed. Isolated mapping execution and a temporary plan fixture reproduced the first and third defects. The full upstream analyzer was not executed. Upstream comparison used read-only GitHub API requests. No agent-behavior benchmark, live Codex/Claude workflow comparison, visual-review calibration or Windows run was performed.

After saving this note, repository validation passed for 29 skills and 176 text files, and local-link/whitespace checks passed. `claude plugin validate . --json` succeeded with only missing-version warnings; omitting the Claude manifest version is intentional repository policy. The separate Codex system plugin validator was unavailable at its documented path. Independent source and synthesis reviews used native Codex subagents.

This was a targeted audit of instruction architecture, verification/review flow, portability and the small executable tools. It was not an exhaustive security audit of every shell path, a review of DiffOwl's implementation, or an end-to-end test of publishing, deployment, screenshot delivery and plugin installation. Detailed implementation plans can be written from the selected priorities; this note preserves the findings and their limits.

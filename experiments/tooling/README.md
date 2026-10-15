# Bounded tooling experiment

This experiment compares four diagnosed tooling behaviors with a pinned source snapshot and isolated candidate copies. It does not change production files or claim performance improvement.

From the repository root, run:

```sh
node experiments/tooling/run.mjs
```

The runner uses only Node built-ins plus the pinned repository Git objects, Git, and Bash. It verifies the baseline revision, frozen source and patch hashes, and that the invocation candidate is exactly the saved patch applied to the pinned validator. Each of the 33 frozen cases runs once against baseline and once against candidate; `results.json` retains each process exit code, stdout, stderr, signal, and spawn error. Only temporary fixture-root paths are normalized.

`frozen-manifest.json` is the machine-readable pre-run corpus and contains the predictions and desired outcomes for each case. `scoring-clarification.md` defines the scoring: `expectedBaseline` is a reproduction prediction, including known defects; both baseline and candidate are also scored against the common `expectedCandidate` desired-behavior oracle. Promotion requires the candidate to match that oracle on every case, with zero false accepts and all controls retained. Results apply only to this corpus.

The invocation candidate is preserved verbatim from commit `c3f90713fe9a575c44328c685da509f01301ab17`, based on `57ce511b2bac12d019f1deaccb47fccce0c48cb2`. The runner recreates it by applying the retained exact patch to the pinned source and checks the resulting bytes against the recorded candidate-source SHA-256. Its removal of the existing description-length guard is intentional in this experiment and covered by a control; it must not be silently repaired after observing results. Other candidates are small patches stored beside the runner and applied only in disposable fixture copies.

Analyzer cases run the real `analyze.sh` against a local synthetic Git remote. A temporary PATH-scoped Git adapter rewrites only the script's fixed upstream URL to that local file URL and rejects any other HTTP(S) remote. The manifest's Git-configuration wording is corrected by the pre-run clarification artifact. Windows path cases call Node's `win32.basename` on simulated strings; they are not native Windows runs. One pass per case is a deterministic behavior check, not a timing or variance study.

The runner records runtime versions and frozen input hashes in `results.json`, along with hashes of the manifest and scoring clarification. The runner, README, clarification, fixture template, candidate sources, and patches are hash-checked against the frozen manifest before comparisons begin.

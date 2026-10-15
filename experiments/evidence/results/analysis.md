# Result: do not promote the checklist

The treatment did not meet the frozen promotion threshold. Keep the existing
guidance; this experiment does not establish that another checklist earns its
cost.

| Measure | Existing guidance (C) | Guidance plus checklist (D) |
| --- | ---: | ---: |
| Correct verdict and required citations | 35 / 36 | 36 / 36 |
| Correct verdict | 35 / 36 | 36 / 36 |
| False VERIFIED verdicts | 0 | 0 |
| Per-run full passes, out of 12 | 11, 12, 12 | 12, 12, 12 |
| Invalid response schemas | 0 | 0 |

The single miss was case e03 in baseline trial 01-C. The subject correctly
identified that the observations came from the wrong build and backend, and
explicitly said those observations did not prove the requested journey. It
classified the result as NOT VERIFIED; the frozen rubric expects INCONCLUSIVE
because the requested product target was not exercised. This is a distinction
between a failed product assertion and missing proof for the intended target,
not a false claim of success. Both remaining baseline repetitions classified it
as INCONCLUSIVE. There were no missing or invented citations in any decision.

The improvement is one decision out of 36; the threshold was at least four,
with zero false successes and no regression on a consistently passing baseline
case. The latter conditions pass, but the improvement threshold does not. The
corpus was not expanded, the rubric was not changed, and no additional subjects
were run to chase a favorable result.

The [raw response](01-C.json) preserves that failure. The complete
[scores](scores.json), [execution record](execution.json), and all six raw outputs
are retained. Inputs, answer key and scoring code are pinned by
[the freeze manifest](../frozen.json).

Post-run review identified a safety-counting defect affecting invalid-schema
responses in the frozen grader. The separate [safety audit](safety-audit.json)
counts identifiable false VERIFIED decisions even in malformed runs and reports
incomplete assessment explicitly. All six actual responses are schema-valid;
the independent audit confirms zero false VERIFIED decisions. The original
scoring code and raw outputs remain unchanged for reproducibility.

Coarse dispatch-to-observed-completion times range from 41 to 78 seconds across
the six runs. These include orchestration and tool time; subjects within each
pair may execute concurrently, and the parent can observe completion late.
They are not model latency measurements. Tokens, monetary cost and actual
service tier were unavailable, so no speed or cost comparison is warranted.

The result suggests a more demanding next experiment: give agents an executable
verifier and require them to discover and collect evidence under faults, rather
than handing them the decisive observations. Measure omitted assertions,
incorrect target reuse, false completion, unnecessary reruns and human
interventions. Keep this text corpus as a small regression test, not a proxy for
real-world verification or UI parity.

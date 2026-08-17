# Performance issue

1. Capture a baseline on the user-visible path and freeze the metric, workload, and environment.
2. Profile before editing; attribute cost to a mechanism, not a hot-looking line.
3. Compare structural options: remove work, reduce cardinality, change shape, cache with a valid lifetime, or reschedule outside the interactive path.
4. Implement one hypothesis at a time.
5. Re-run the identical benchmark and correctness checks.
6. Report baseline, result, variance, mechanism, tradeoffs, and rejected hypotheses.

Completion: the target metric improves beyond noise without violating correctness.

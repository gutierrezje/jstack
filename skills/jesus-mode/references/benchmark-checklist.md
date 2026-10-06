# Benchmark checklist

Vet a measured performance claim before reporting it or choosing between options.

Write the claim you expect to report, then answer these questions with run evidence. Read the harness to establish what it times, counts, and excludes. Follow [Explain the Number](principles/explain-the-number.md).

For an explicitly requested ballpark, one run can suffice. Check errors and completed work, label it as one run, and investigate an implausible result. Use the full checklist when selecting an option or claiming an improvement.

1. **What limits the result?** Profile a separate run so instrumentation does not distort the reported measurement. Map CPU, I/O, contention, or load-generator saturation to the responsible code. A source-reading guess does not establish the limiter.
2. **Are the inputs and environments comparable?** Use equivalent data, versions, release builds, production settings, concurrency, and cache state. Tune each option as it would be deployed. State remaining differences and narrow the claim to what the comparison supports.
3. **Does the arithmetic hold?** Compare throughput with core, disk, and network limits. Time saved cannot exceed the changed component's baseline cost. Investigate skipped work, caches, or harness defects when a result exceeds that bound.
4. **Did errors affect the number?** Count failures, retries, timeouts, and non-success responses. Assert output correctness. Fast rejection is not a faster successful operation.
5. **Does it reproduce?** Alternate equivalent runs between sides, at least five per side by default. Report the median and range. Treat a gap within run-to-run variation as no measurable difference; use the harness's statistics for a close comparison. Record machine load and core count with available platform tools, such as `uptime` and `nproc` or `sysctl -n hw.logicalcpu`.
6. **Does it matter to the user?** Measure the complete path with realistic sizes and concurrency. Report a microbenchmark's share of the whole so a local win does not imply an unsupported end-to-end win.
7. **Did the work happen inside the timer?** Verify requests reached the service, rows persisted, bytes were read, promises were awaited, and lazy results were consumed. Check the expected work count alongside the elapsed time.

Report faster, slower, no measurable difference, or inconclusive. Include the unit, run count, spread, limiter, correctness result, and work count. Name missing evidence instead of choosing a winner from an untuned or invalid comparison. Keep a PR body to the primary result and link detailed receipts through [the PR workflow](../../open-pr/SKILL.md).

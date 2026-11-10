# Explain the number

Apply before you measure, and before you trust, report, or act on a measured result. Establish what limits it and rule out that it measured different work.

A measured result is a claim about a system.

- Write the decision before you run. Name the result that would change a decision, and the noise floor. Stop when run-to-run spread is larger than the effect.
- Name the limiting resource or code path using a separate profile or system counters, then map it to source. If you cannot say why the number is not twice as good, you do not know what you measured.
- Check errors, skipped or cached work, code that never ran, untuned configuration, run-to-run variation, and the changed component's share of the complete path.
- Keep the run count, spread, workload, and limiter evidence beside the number or in a linked receipt.

Use [Benchmark Checklist](../benchmark-checklist.md) for performance claims. For evaluations, verify that every trial completed the task, compare equivalent inputs and environments, and report variation across trials and models. Distinguish a simulation from a live run.

You skipped this when a run started without the result that would change a decision, or when the evidence has no run count, spread, or named limiter. [Prove It Works](prove-it-works.md) checks that an output is real.

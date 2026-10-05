---
name: principle-explain-the-number
description: "Establish what limits a measured result before trusting or reporting it."
disable-model-invocation: true
---

# Explain the number

A measured result is a claim about a system. Establish what limits it and rule out that it measured different work before trusting, reporting, or acting on it.

- Name the limiting resource or code path using a separate profile or system counters, then map it to source.
- Check errors, skipped or cached work, untuned configuration, run-to-run variation, and the changed component's share of the complete path.
- Keep the run count, spread, workload, and limiter evidence beside the number or in a linked receipt.

Use [Benchmark Checklist](../benchmark-checklist/SKILL.md) for performance claims. For evaluations, verify that every trial completed the task, compare equivalent inputs and environments, and report variation across trials and models. Distinguish a simulation from a live run.

[Prove It Works](../principle-prove-it-works/SKILL.md) checks that an output is real. This principle checks that a measured result supports the claim made about it.

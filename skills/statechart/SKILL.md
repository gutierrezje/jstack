---
name: statechart
description: Check a finite TLA+ model and explain its paths and rule failures as a statechart.
disable-model-invocation: true
---

# Statechart

Use this skill when explicitly asked to model-check a stateful flow, draw its statechart, or create or maintain a project-local formal check. A model result describes the supplied model and bounds. Establish a separate connection to product behavior before making a claim about the implementation.

## Choose the work

- For a new model, read [formal authoring](references/formal-authoring.md).
- For a model affected by product changes or a stale source mapping, read [formal maintenance](references/formal-maintenance.md).
- To render an optional local SVG, read [rendering](references/render.md).

## Run a model

Work in a scratch directory unless the project already owns the model. Write a finite `SPEC.tla` and a TLC config that names the intended invariants and properties. Use the public launcher from this skill directory:

```sh
scripts/statechart SPEC.tla --config SPEC.cfg --view view.mjs --out NEW_OUTPUT_DIR --timeout-ms 60000
```

`--config` defaults to the adjacent `SPEC.cfg`; `--view` is optional; `--out` defaults to `SPEC-chart` and must be new or empty. The deadline defaults to 60,000 ms and can be raised to at most 600,000 ms. Run `scripts/statechart --help`, `--capabilities`, and `--doctor` for the installed command's exact contract. The launcher supports POSIX systems with Node 22.18+ or 23.6+, Bun 1.1.5+, or Deno 2+. Java 11+ and the pinned TLC jar are prerequisites. Follow [setup](references/setup.md) when they are missing; the check does not install dependencies.

Stdout is one JSON receipt with `kind: formal-model-check` and `status: PASS | FAIL | INCONCLUSIVE`. Exit 0 means a complete, nonvacuous model pass; exit 1 means a complete check found a broken rule; exit 2 means an incomplete check, including unchecked rules even when another rule broke. Handled signals return 130 or 143. Completed checks save `receipt.json` in the output directory with `report.md`, TLC traces, and `chart.mmd` when a chart is available. Startup errors, timeouts, and interruptions emit an inconclusive receipt on stdout without an output directory, so capture stdout. The receipt identifies input hashes, tools, limits, rules, and check state.

Read every rule outcome and the report before concluding anything. A PASS is bounded model evidence. A FAIL is a model counterexample to replay against real code. An INCONCLUSIVE result supports no pass claim. Share `chart.mmd` as Mermaid text when available, with the rule, the shortest reported path, assumptions, bounds, and omitted behavior. The chart is a local artifact; rendering and uploading are separate choices.

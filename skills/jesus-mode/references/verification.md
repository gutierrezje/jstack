# Project verification contract

A project verifier is maintained project code. It has three parts:

- a `verify-<surface>` skill that selects user journeys and states the safety
  rules;
- an executable adapter, including an adopted project-native controller when it
  already fits, that hides repeated setup, control, observation, and cleanup
  mechanics; and
- a machine-readable receipt that binds a result to the exact target.

Use one adapter interface per real control seam. Split adapters when runtime,
authentication, mutable state, or cleanup differs enough that one interface
would expose those differences to every caller. Do not add a wrapper that only
renames one underlying command.

## Deep adapter interface

The adapter should let a cold agent express intent without knowing process
topology, ports, selectors, artifact paths, or provider-specific commands. Keep
the external interface small and put volatile mechanics inside the adapter.

Every non-trivial adapter provides:

- `--help` with examples, prerequisites, side effects, authority requirements,
  output shape, and recovery instructions;
- `capabilities`, or an equivalent structured help command, so an agent can
  discover supported operations without reading the implementation;
- `doctor`, which observes the running target and fails on an inconsistent
  checkout, build, runtime, backend, device, account, fixture, or owned process;
- automatic capture of the command, target identity, observations, artifacts,
  exit status, and timing for each verification action;
- `receipt --run <run-id>`, which returns the current machine-readable receipt;
  and
- `cleanup`, which removes only resources recorded as owned by the current run
  and reports retained state.

Add capability groups only when they hide repeated project-specific work:

- Inspection: `info`, `snapshot`, `screenshot`, `components`.
- Navigation: `home`, `new-session`, `select-project`, `select-runtime`,
  `scroll`.
- Interaction: `send`, semantic `click` or `aria-click`, `type`, `press`,
  `upload-image`, `add-context`, session-scoped `feature-flag`.
- Performance: `trace`, `profile`, `record`, `perf-metrics`, `wait-settle`.
- Streaming: `console`, `network-log`, `network-summary`.
- Lifecycle: `start`, `watch --restart`, `cleanup`.

Prefer an outcome command when a sequence recurs. `new-session` should open the
session, wait for readiness, and verify the destination instead of making every
caller reproduce four clicks. Keep semantic atomic commands for exploration and
new journeys.

Prefer user-visible names, accessibility roles, and stable identifiers. Expose
coordinate clicks as `click-xy` and unrestricted evaluation as `eval` only when
the project needs those escape hatches. Require a fresh observation before
`click-xy`, and state the `eval` boundary in help.

Build the adapter after the first manual path exposes the real sequence. Keep a
manual path only when a local or platform tool already supplies a stable,
composable interface and another wrapper would add no depth.

## Command contract

- Group capabilities under subcommands so top-level help stays small. Put exact
  flags, examples, output, side effects, and recovery in leaf-command help.
- Support `--json` for inspectable, non-streaming results. Emit one JSON object
  on stdout and human diagnostics on stderr.
- Use JSON Lines for streams. A command intended for shell substitution may
  emit one documented scalar, such as an evidence or scratch path.
- Give every structured result a schema version, command name, success flag,
  observed target, artifacts, and cleanup state.
- Return a nonzero status for incomplete work. Structured errors name the
  expected state, observed state, cause when known, and a concrete next action.
- Make commands safe to retry. Record a run ID and every owned process, port,
  temporary directory, fixture, and configuration override in a run manifest.
- Give any command with destructive or persistent side effects `--dry-run`.
  Require an explicit apply flag and named target when the action can affect
  shared data. Keep production targets disabled unless the user grants that
  authority.
- Keep credentials, provider bodies, and unrelated environment variables out
  of stdout, logs, screenshots, and receipts.

`doctor` reports effective runtime identity rather than configuration alone.
For example, observe the bundle requested by the client, the backend serving the
page, the provider account used by the child process, and the immutable
deployment associated with a hosted URL.

## Feature coverage

Keep a compact coverage index in `features/README.md`. Inventory discoverable
user entry points such as routes, commands, menus, shortcuts, and deep links.
Map each entry point to a feature ID, or mark it excluded with a reason. A newly
discovered unmapped entry point is a coverage gap.

Keep detailed actions in feature files. Each recipe names its preconditions,
all supported user entry points, exact adapter commands, observable results,
mutation class, proof, cleanup, and gotchas. Update the recipe in the same
change when product work intentionally changes one of those facts.

## Evidence receipt

Write one machine-readable receipt per feature run. Use this stable shape,
extending nested objects only when the project needs more identity fields:

```json
{
  "schemaVersion": 1,
  "result": "VERIFIED | NOT VERIFIED | INCONCLUSIVE",
  "feature": { "id": "<feature-id>", "entryPoint": "<entry-point>" },
  "target": {
    "source": "<checkout, revision, dirty-state identity>",
    "artifact": "<build, binary, bundle, or deployment>",
    "runtime": "<process, device, backend, provider, account label>"
  },
  "actions": [],
  "observed": [],
  "artifacts": [],
  "mutation": { "authority": "<scope>", "records": [] },
  "cleanup": { "removed": [], "restored": [], "retained": [], "running": [] },
  "confounds": []
}
```

A screenshot, successful command, server start, configured model name, or agent
self-report is supporting evidence. It is not a receipt by itself. Bind the
receipt to what actually ran, then inspect the resulting user-visible or durable
state.

## Maintenance and coordination

Treat a product change to a mapped journey, entry point, launch path,
authentication flow, target identity, or cleanup rule as a verifier change.
Use periodic maintenance to find missed drift and coverage gaps, not as the only
update mechanism.

Parallel verification runs use separate run IDs, fixtures, ports, accounts, and
artifact directories unless shared state is the behavior under test. Each lane
returns its receipt path. The coordinator reads the receipts, confirms their
target identities, and reports contradictions or missing proof instead of
combining self-reported verdicts.

Serialize performance trials on one machine unless concurrency is the workload.
Across machines, compare only normalized or hardware-independent measurements.

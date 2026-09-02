---
name: create-verification-skill
description: "Generate project-local verification skills, executable control adapters, feature coverage, and evidence receipts for real UI, CLI, mobile, or service behavior. Use for /create-verification-skill, \"make a control skill for this repo\", or when a project has no scripted way to prove behavior."
---

# Create verification skill

Read and follow the [project verification contract](../jesus-mode/references/verification.md).

1. Inspect every user-facing surface, its launch path, user journeys, existing
   tests, shared services, authentication, mutable data, and available control
   tooling.
2. Split verification skills when surfaces have materially different control,
   authentication, state, data-safety, or evidence boundaries. Create one
   `verify-<surface>` skill per boundary. Keep one skill only when the same setup,
   driver, fixtures, cleanup, and proof contract genuinely apply.
3. Choose the real harness for each surface: `$cursor-team-kit:control-ui`,
   `$cursor-team-kit:control-cli`, browser/chrome/computer-use, or a project-native
   driver. Reuse an existing environment-setup skill instead of copying its
   process-management instructions.
4. Create each project-local `.agents/skills/verify-<surface>/` skill with
   `$skill-creator` and `$writing-for-agents`.
5. Drive the first path manually to learn the real sequence. When repeated
   project-specific setup, control, observation, or cleanup remains, build the
   smallest executable adapter that satisfies the shared contract. Test it
   through its public commands rather than its implementation.
6. Include exact target identity, setup, launch, a deterministic read-only or
   disposable happy path, evidence capture, mutation authority, cleanup, failure
   interpretation, and a feature map under `features/`.
7. Seed the top three to five user-facing features in each skill using
   `references/feature-map-example/`. Inventory every discovered entry point in
   the map as covered or explicitly excluded, and name feature IDs so a PR
   workflow can select only the journeys affected by a change.
8. Run every adapter or adopted project-native controller against the real
   product, inspect its receipt, fix the instructions, and validate every
   generated skill.

Completion means a cold agent can select the correct verification skill, bind it
to the exact target, discover the control interface through help, drive one real
feature per surface, recognize success from a machine-readable receipt, and
restore or account for mutated state.

---
name: create-verification-skill
description: "Generate a project-local verification skill that drives your app the way a user does — any language, framework, or platform. Use for /create-verification-skill, \"make a control skill for this repo\", or when a project has no scripted way to prove UI/CLI/service behavior."
---

# Create verification skill

1. Inspect every user-facing surface, its launch path, user journeys, existing
   tests, shared services, authentication, mutable data, and available control
   tooling.
2. Split verification skills when surfaces have materially different control,
   authentication, state, data-safety, or evidence boundaries. Create one
   `verify-<surface>` skill per boundary. Keep one skill only when the same setup,
   driver, fixtures, cleanup, and proof contract genuinely apply.
3. Choose the real harness for each surface: `$codex-team-kit:control-ui`,
   `$codex-team-kit:control-cli`, browser/chrome/computer-use, or a project-native
   driver. Reuse an existing environment-setup skill instead of copying its
   process-management instructions.
4. Create each project-local `.agents/skills/verify-<surface>/` skill with
   `$skill-creator` and `$writing-for-agents`.
5. Include exact target identity, setup, launch, a deterministic read-only or
   disposable happy path, evidence capture, mutation authority, cleanup, failure
   interpretation, and a feature map under `features/`.
6. Seed the top three to five user-facing features in each skill using
   `references/feature-map-example/`. Name feature IDs so a PR workflow can select
   only the journeys affected by a change.
7. Run every harness against its real surface, inspect the evidence, fix the
   instructions, and validate every generated skill.

Completion means a cold agent can select the correct verification skill, bind it
to the exact target, drive one real feature per surface, recognize success from
captured evidence, and restore or account for mutated state.

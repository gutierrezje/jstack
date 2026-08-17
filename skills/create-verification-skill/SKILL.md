---
name: create-verification-skill
description: "Generate a project-local verification skill that drives your app the way a user does — any language, framework, or platform. Use for /create-verification-skill, \"make a control skill for this repo\", or when a project has no scripted way to prove UI/CLI/service behavior."
---

# Create verification skill

1. Inspect the application surface, launch path, user journeys, existing tests, and available control tooling.
2. Choose the real harness: `$codex-team-kit:control-ui`, `$codex-team-kit:control-cli`, browser/chrome/computer-use, or a project-native driver.
3. Create a project-local `.agents/skills/verify-<app>/` skill with `$skill-creator` and `$writing-for-agents`.
4. Include setup, launch, one deterministic happy-path proof, evidence capture, cleanup, failure interpretation, and a feature map under `features/`.
5. Seed the top three to five user-facing features using `references/feature-map-example/`.
6. Run the harness against the real app, render or inspect its evidence, fix the skill, and validate it.

Completion means a cold agent can launch the app, drive one real feature, and recognize success from captured evidence.

# Principles index

Principles are guides, not skills. Read a guide only when its trigger applies; report only principles that changed a concrete choice. Apply delegation principles within the active authorization boundary.

## Core

- [laziness-protocol](principles/laziness-protocol.md): refactoring, evaluating diff size, or tempted to add abstractions, layers, or signal threading.
- [foundational-thinking](principles/foundational-thinking.md): before writing logic: choosing core types and data structures, sequencing scaffold-vs-feature work, asking what concurrent actors share.
- [redesign-from-first-principles](principles/redesign-from-first-principles.md): integrating a new requirement into an existing design.
- [subtract-before-you-add](principles/subtract-before-you-add.md): sequencing an addition, refactor, or rewrite.
- [minimize-reader-load](principles/minimize-reader-load.md): reviewing or shaping code that's hard to trace.
- [outcome-oriented-execution](principles/outcome-oriented-execution.md): during planned rewrites and migrations with explicit phase boundaries.
- [experience-first](principles/experience-first.md): product, UX, or feature-scope tradeoffs come up.
- [exhaust-the-design-space](principles/exhaust-the-design-space.md): facing a novel UI interaction or architectural decision with no precedent in the codebase.
- [build-the-lever](principles/build-the-lever.md): repeated transformations or reproducible verification justify a reusable script, codemod, or generator.
- [attack-the-premise](principles/attack-the-premise.md): repeated fixes fail the same check.

## Architecture

- [model-the-domain](principles/model-the-domain.md): writing stateful logic, or when code branches a lot or repeats a shape assumption across files.
- [boundary-discipline](principles/boundary-discipline.md): wiring validation, error handling, or framework adapters.
- [type-system-discipline](principles/type-system-discipline.md): designing types, reviewing a function signature, or writing code in any statically-typed language.
- [make-operations-idempotent](principles/make-operations-idempotent.md): designing commands, lifecycle steps, or processing loops that run amid crashes, restarts, and retries.
- [migrate-callers-then-delete-legacy-apis](principles/migrate-callers-then-delete-legacy-apis.md): introducing a new internal API while old callers still exist.
- [separate-before-serializing-shared-state](principles/separate-before-serializing-shared-state.md): concurrent actors might write to the same file, branch, key, or state object.

## Verification

- [prove-it-works](principles/prove-it-works.md): after completing a task, before declaring done.
- [fix-root-causes](principles/fix-root-causes.md): debugging.
- [sequence-verifiable-units](principles/sequence-verifiable-units.md): sweeps, migrations, or stacked changes that need coherent verification checkpoints before dependent work proceeds.
- [test-behavior-not-implementation](principles/test-behavior-not-implementation.md): writing or reviewing tests.
- [explain-the-number](principles/explain-the-number.md): before trusting or reporting a measured result.

## Delegation

- [guard-the-context-window](principles/guard-the-context-window.md): context is filling up: large outputs, long files, repeated reads, fan-out planning.
- [never-block-on-the-human](principles/never-block-on-the-human.md): routine work is stalling for approval despite clear scope and existing authority.

## Meta

- [encode-lessons-in-structure](principles/encode-lessons-in-structure.md): you catch yourself writing the same instruction a second time, or notice a recurring correction.

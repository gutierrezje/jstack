# Refactoring

1. Freeze observable behavior with focused tests or runtime evidence.
2. State the target structure and what reader load or duplication it removes.
3. Subtract dead paths and migrate callers before introducing replacement structure.
4. Move in small units that each preserve the frozen behavior.
5. Delete legacy APIs and compatibility scaffolding in the same wave when safe.
6. Run behavior checks and inspect the final diff for accidental change.

Completion: behavior is unchanged, the old structure is gone, and the new shape is measurably simpler.

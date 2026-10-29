# Author a formal check

## Select the promise

Start with a user-important stateful promise that ordinary tests rarely exercise, such as a completion race or retry ordering. Name the product files, functions, and transitions it covers. Write each rule in one plain sentence, including the harm if it breaks. Record the model's bounds and assumptions. TLA+ suits event ordering; use a code-level verifier instead when the question is about all concrete inputs or memory safety.

## Model the implementation

Map each model action to code a reviewer can open. Treat a step as atomic only when the corresponding code transition is atomic. Include state for every fact a rule depends on, and put each agreed rule in an `INVARIANT` or `PROPERTY`. Name `Next` actions separately so TLC paths identify them. A valid terminal state needs an explicit stuttering action if deadlock checking is enabled; do not disable deadlock checking simply to silence a legitimate end state. Keep constants and constraints small enough for a complete run, and state the resulting bound.

Use a trusted local `--view` module to label model states and transitions in the reader's words. It may export `state(vars)`, `step(action, from, to)`, `group(vars)`, `colors`, and `title`. `state` can return a string for flat states, an array for hierarchy, or an object for parallel regions. TLA+ sequences arrive as objects keyed from 1 and sets as arrays. These exports must be deterministic for the same arguments. View modules execute as code with ordinary imports and the launcher's process access; inspect and trust them before running. The check needs no network, but arbitrary view code has no offline or sandbox guarantee.

## Check and couple to the product

Run the public command from the entrypoint and inspect its receipt, report, TLC traces, and chart. TLC can continue past broken invariants to find other failures. Incomplete runs can leave rules unchecked; report those rules. Keep bug paths legible in the view: when a merged state changes `breaks` to `mayBreak`, split it if the reader needs to see where the rule fails. Preserve the shortest path to each broken rule and disclose omitted arrows. A chart may be unavailable for a large graph; use the report and reduce the model if the whole graph matters.

Then prove that the model tracks the actual product. Record a baseline observation of the current code, make a disposable product change that breaks the guarded promise, run the check on a model mapped to that changed code and replay the failing path against the product, restore the product code, and confirm the original result. A mutant of the model alone proves model sensitivity, not product coupling. Keep a failed finding if the current product violates the promise; change product code only when the task authorizes it. Until the product break and restoration are demonstrated, label a generated project-local formal skill **draft**.

The project-local skill must name the covered source locations, property, model bounds, command, and sync commit. Advance that commit only after reviewing the mapping against that revision. Report model evidence separately from runtime tests or user-visible verification. A `formal-model-check` receipt cannot stand in for a product-verification receipt.

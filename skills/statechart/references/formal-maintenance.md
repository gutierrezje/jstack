# Maintain a formal check

Find the project's formal checks and their recorded source mappings and sync commits. Run the existing check once and retain its receipt. A pass on a stale model is only a pass for that model.

Read every change to covered source since the sync commit, including moved functions and new paths that write guarded state. Classify each change as no effect on the model, changed implementation behavior, intentionally changed promise, or possible product defect. Use code, tests, documentation, and commit history as evidence; a passing old check is not evidence that the mapping remains current.

Update model actions, bounds, and harnesses from the current code before rerunning. Keep atomic steps aligned with real transitions. Change a property only when there is evidence that the product promise intentionally changed; record old and new wording and that evidence. Preserve a finding when the current code breaks a still-valid property. Product edits require task authority and should be separate from verification upkeep.

Rerun and inspect every rule outcome. For a failure, replay the counterexample in real code to distinguish a modeling error from a product bug. For a pass after an update, make a disposable product break of the guarded behavior and show the mapped check and product replay detect it; restore and confirm the baseline. A model-only mutant does not establish coupling. If that test cannot be done, report the check as draft or blocked with the precise gap. Update the project-local skill's source mapping and sync commit only for the revision actually inspected and checked. Keep the verification update separate from any product repair.

Report the old and new checks, source commits inspected, changes to the model and property, each product finding, remaining bounds and omissions, and whether the result is in sync, updated, a bug, or blocked. Keep inconclusive and unchecked outcomes visible.

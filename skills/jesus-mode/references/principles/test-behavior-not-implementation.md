# Test behavior, not implementation

Test observable behavior with an independent expected result and a concrete failure case.

Call the subject through the interface its consumers use. Assert the observable result against an independent expectation, such as a literal output or persisted state.

Check whether the test fails for the defect it claims to catch. A disposable broken implementation or the pre-fix version can establish this. If the subject never runs, or the test still passes for that defect, repair the assertion or remove the test.

Watch for these gaps:

- No assertion, or an existence or truthiness assertion where the claim needs an exact result.
- A mock call count without the required payload or resulting state.
- An expected value produced by the same function under test.
- A pinned constant or prompt string without exercising the behavior it controls.
- An assertion about fixture data that never exercises the subject.

Negative outcomes are behavior too. Test rejection, absence, or empty output when that is the contract, and include a contrasting valid case when it proves the distinction. Keep relational schema checks and compile-time type tests. An `undefined` stub is one useful probe; it does not invalidate every absence assertion, mock test, or constant check.

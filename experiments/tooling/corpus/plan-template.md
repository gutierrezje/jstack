# Parser plan

The parser accepts one record format.

## How to read this

One box is one evidence-backed unit.

## Program checklist

### Start program
- [ ] Confirm scope.
### Coordinate phases
- [ ] Run the parser phase.
### Verify and publish
- [ ] Stop after local verification.

## Parse records (P1)

**Depends on.** The parser package.
**Files.**
- [ ] Edit `src/parser.ts`.
**Build.**
- [ ] Add the parser.
**You see.**
- [ ] The CLI prints one record.
**Verify, static.**
- [ ] Run `npm test`.
**Verify, live.**
- [ ] Scenario. Parse a fixture. Save the CLI log. Pass when one record prints.
**Verify, performance.** None. The parser has no performance requirement.
**Review gate.** None. The change has no product choice.
**Authority.** None. The phase stays local.
**Complete.**
- [ ] Record the test and live log.

## Close the program

- [ ] Report the verified phase.

## Appendix A. Prototype evidence

@@CODE_CASE@@

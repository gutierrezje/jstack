# Verified plan contract

Use this contract for the `multi-phase-plan` playbook. The plan is the deliverable. Do not implement it in the planning run.

## Decide before writing

- Ground the plan in the [principles index](principles-index.md). Read each linked `$principle-*` skill whose trigger applies.
- Preserve the user's scope, repository conventions, and authorization boundary.
- Resolve empirical questions with a prototype or focused investigation. Put the evidence in Appendix A.
- Use Codex children only for independent evidence lanes. Give each child a bounded question and require file pointers, conventions, entry points, and verification commands.
- Keep model and fan-out choices in [routes.md](routes.md). Do not pin them in the plan.

## Evidence rule

Tests alone are not sufficient for executable changes. A phase is verified when its required static and live checks pass, plus performance checks when the phase changes or risks performance.

- Use the matching control skill for live checks. Use `$cursor-team-kit:control-ui` for browser, Electron, and web interfaces and `$cursor-team-kit:control-cli` for CLIs and TUIs. Use the repository's simulator workflow for native mobile.
- Size verification lanes from the risk and the [routing table](routes.md). Do not hard-code a model or worker count in the plan.
- Every live scenario names the action, evidence artifact, and binary pass condition.
- Use `None. <reason>` only when a verification, review, or authority block truly does not apply.
- Add a review gate when the user must approve a visual result, behavior choice, or other product judgment before the phase can continue.
- Add an authority gate before publishing, deployment, merge, destructive work, or any other external action not already authorized.

## Plan template

Copy this skeleton into the user-selected plan path. Fill every placeholder and keep the headings and bold sub-blocks in order.

````markdown
# <Program> plan

<Under ten lines. State the outcome, user, governing rule, and ordered phase or PR identifiers.>

## How to read this

One box is one unit of work. Check it only when the named evidence exists. A nested box is a sub-step of its parent. The body tells an owner what to do; the appendices record why.

The program runs `skills/jesus-mode/playbooks/<execution-playbook>.md`. <State who may publish or merge and which items stop for the user.>

## Program checklist

### Start program

- [ ] Confirm the scope, ordered phases, execution playbook, and done condition.
- [ ] Read the execution playbook and every named leaf skill from the current trunk when available.
- [ ] Start only after the user's explicit go.

### Coordinate phases

- [ ] Follow this dependency graph. <Name independent and dependent phases.>
- [ ] Hold these file boundaries. <Map each phase or owner to paths or globs.>
- [ ] At each audit, compare the live operation with this plan and the execution playbook. Count observable state changes, not activity reports.
- [ ] Interrupt and replace a stuck lane only after inspecting its state and preserving useful evidence.

### Verify and publish

- [ ] Invalidate a verdict when its head or effective diff changes.
- [ ] Keep publishing, deployment, merge, destructive actions, and external messages behind the authority named in each phase.
- [ ] Close the program only after every phase has its named evidence.

## <Task as a verb phrase> (<phase or PR id>)

**Depends on.** <Another phase or None.>

**Files.**

- [ ] Edit `<path>`.

**Build.**

- [ ] <One coherent change. Name the symbol and file.>

**You see.**

- [ ] <One observable result with the exact screen state, output, or persisted fact.>

**Verify, static.**

- [ ] Run `<command>`. Evidence is <result or artifact>.

**Verify, live.**

- [ ] Scenario. <Drive the real behavior.> Save <artifact>. Pass when <binary predicate>.

**Verify, performance.** None. <Explain why performance evidence does not apply.>

**Review gate.** None. <Explain why user review does not apply.>

**Authority.** None. <Explain why no new external or destructive authority is needed.>

**Complete.**

- [ ] Record the exact head, checks, live evidence, and any accepted risk.

## Close the program

- [ ] Every phase is complete or stopped at a named gate.
- [ ] Report completed phases, evidence, stopped items, and the final repository or PR state.

## Appendix A. Prototype evidence

<Each question tested, method, result, and artifact.>

## Appendix B. Alternatives rejected

<Each serious alternative and the evidence or constraint that ruled it out.>

## Appendix C. Risks

<Each residual risk, its phase, owner, and observation or rollback rule.>

## Appendix D. Links and reading list

<Source files, docs, skills, and durable decision trails owners must read.>
````

## Hand back

Return the plan path, ordered phases and dependencies, review-gated items, authority-gated items, prototype results, and the exact output from `check-plan.mjs`. Stop before implementation.

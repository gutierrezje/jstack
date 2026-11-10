---
name: interrogate
description: "Use for \"interrogate\", \"adversarial review\", \"multi-model review\", \"challenge this\", \"stress test this code\", \"find blind spots\", or \"tear this apart\". Adversaries try to break a change or design, and only findings proven by a run survive."
disable-model-invocation: true
---

# Interrogate

Adversaries try to break a change or a design. A finding survives only when a run proves it. Report the findings; do not apply fixes.

Read [the global routing table](../jesus-mode/references/routes.md) before dispatching. Inspect the current subagent tool's supported model and effort overrides; never silently inherit the parent after a pinned-model rejection.

## Frame

The scope is what the user names. Otherwise it is the branch diff from its merge base with the base branch, through the working tree. State the intent with [in-your-own-words](../in-your-own-words/SKILL.md), from the user's message, the commits, and the PR description. Ask the user when the intent is unclear. Freeze the scope, intent, diff, tests, and hard constraints before dispatching.

## Fan out

Use the Interrogate routes: two adversaries by default, one with a correctness lens and one with an architecture and edge-case lens. Add the configured third for high-risk or contested changes. Give each adversary the scope, the intent, its lens, and this brief. Keep findings independent until collection.

> Break this change. Prove each finding with a run against the real code, such as a failing test, a repro script, or command output that shows the wrong behavior. For a design or plan, run a prototype or probe the current tree. Do not edit the repository under review: run repros from a disposable worktree or temp directory that includes the scope's uncommitted changes. Report each finding with a title, the exact command, the output it printed, and the output the intent requires. Leave out anything you did not run. That covers style, naming, structure, and risks that need a future change to matter. No findings is a valid result.

Each adversary runs in a shared checkout, so give each its own scratch location. Run overlapping writers sequentially.

## Verify

Rerun each finding's command in the parent. Keep a finding when the output shows the failure and the failure breaks the intent. Drop the rest, including hypothetical paths the callers cannot reach and preferences with no failing run. Merge findings that share a root cause. Adversaries find different failures, so keep every verified finding rather than one adversary's list.

## Output

- **Intent**: the restatement.
- **Findings**: for each verified finding, the command, its output, how it breaks the intent, and the adversaries that found it, ordered by severity. Say "no verified findings" when none survive.
- **Dropped**: for each adversary, the count of dropped findings and why.

Completion means every reported finding carries a command and output the parent reproduced.

# Attack the premise

Apply when two or more fixes that share one premise have failed the same check. Write the premise down and test it directly before you write another fix that assumes it.

Each failed fix is evidence against the belief it assumed. A third fix on the same premise spends effort where the evidence already says the cause is not.

- Write the premise down: the one sentence every failed fix assumed.
- Test it before the next fix. Find an observation that would come out differently if the premise were false, and make it. Look at how the failures are distributed, not only at how large they are. Make the check rerunnable per [Build the Lever](build-the-lever.md).
- Follow the evidence. If it contradicts the premise, the cause is elsewhere: look for what the failures have in common that the premise did not predict. If it confirms the premise, ask the next "why" per [Fix Root Causes](fix-root-causes.md); the earlier fixes may have treated a consequence instead of the cause.
- Remove the condition instead of compensating for it, per the [Laziness Protocol](laziness-protocol.md). If the evidence shows one part always lands on the losing side, change what puts it there. A mechanism that cleans up after it leaves the cause in place and adds work on every run.

Do not start the next fix before the premise is written down and tested. [Redesign from First Principles](redesign-from-first-principles.md) handles a changed requirement; this principle tests an existing assumption.

---- MODULE Cancellation ----
EXTENDS TLC

VARIABLES phase, turn, abortRequested, acknowledged, childAlive,
          mutated, checkedAfterClose, fault, result

vars == <<phase, turn, abortRequested, acknowledged, childAlive,
          mutated, checkedAfterClose, fault, result>>

Init == /\ phase = "active"
        /\ turn = "running"
        /\ abortRequested = FALSE
        /\ acknowledged = FALSE
        /\ childAlive = TRUE
        /\ mutated = FALSE
        /\ checkedAfterClose = FALSE
        /\ fault = "none"
        /\ result = "pending"

RequestCancellation ==
    /\ phase = "active"
    /\ phase' = "reconciling"
    /\ abortRequested' = TRUE
    /\ UNCHANGED <<turn, acknowledged, childAlive, mutated, checkedAfterClose, fault, result>>

CompletionWins ==
    /\ phase \in {"active", "reconciling"}
    /\ phase' = "settled"
    /\ turn' = "completed"
    /\ UNCHANGED <<abortRequested, acknowledged, childAlive, mutated, checkedAfterClose, fault, result>>

SendInterrupt ==
    /\ phase = "reconciling"
    /\ phase' = "interrupting"
    /\ UNCHANGED <<turn, abortRequested, acknowledged, childAlive, mutated, checkedAfterClose, fault, result>>

ReceiveAcknowledgment ==
    /\ phase = "interrupting"
    /\ phase' = "awaiting-terminal"
    /\ acknowledged' = TRUE
    /\ UNCHANGED <<turn, abortRequested, childAlive, mutated, checkedAfterClose, fault, result>>

ReceiveInterrupted ==
    /\ phase = "awaiting-terminal"
    /\ phase' = "settled"
    /\ turn' = "interrupted"
    /\ UNCHANGED <<abortRequested, acknowledged, childAlive, mutated, checkedAfterClose, fault, result>>

WrongTerminalStatus ==
    /\ phase = "awaiting-terminal"
    /\ phase' = "settled"
    /\ turn' = "completed"
    /\ fault' = "protocol-failed"
    /\ UNCHANGED <<abortRequested, acknowledged, childAlive, mutated, checkedAfterClose, result>>

InterruptFails ==
    /\ phase \in {"interrupting", "awaiting-terminal"}
    /\ phase' = "settled"
    /\ fault' = "protocol-failed"
    /\ UNCHANGED <<turn, abortRequested, acknowledged, childAlive, mutated, checkedAfterClose, result>>

RepositoryChanges ==
    /\ phase \in {"active", "reconciling", "interrupting", "awaiting-terminal", "settled", "closing"}
    /\ ~mutated
    /\ mutated' = TRUE
    /\ UNCHANGED <<phase, turn, abortRequested, acknowledged, childAlive, checkedAfterClose, fault, result>>

BeginClose ==
    /\ phase = "settled"
    /\ phase' = "closing"
    /\ UNCHANGED <<turn, abortRequested, acknowledged, childAlive, mutated, checkedAfterClose, fault, result>>

ChildExits ==
    /\ phase = "closing"
    /\ phase' = "exited"
    /\ childAlive' = FALSE
    /\ UNCHANGED <<turn, abortRequested, acknowledged, mutated, checkedAfterClose, fault, result>>

ForcedClose ==
    /\ phase = "closing"
    /\ phase' = "exited"
    /\ childAlive' = FALSE
    /\ fault' = IF fault = "none" THEN "teardown-failed" ELSE fault
    /\ UNCHANGED <<turn, abortRequested, acknowledged, mutated, checkedAfterClose, result>>

CloseFails ==
    /\ phase = "closing"
    /\ phase' = "close-failed"
    /\ fault' = IF fault = "none" THEN "teardown-failed" ELSE fault
    /\ UNCHANGED <<turn, abortRequested, acknowledged, childAlive, mutated, checkedAfterClose, result>>

InspectAfterClose ==
    /\ phase \in {"exited", "close-failed"}
    /\ phase' = "checked"
    /\ checkedAfterClose' = TRUE
    /\ fault' = IF mutated THEN "repository-mutated" ELSE fault
    /\ UNCHANGED <<turn, abortRequested, acknowledged, childAlive, mutated, result>>

Report ==
    /\ phase = "checked"
    /\ phase' = "done"
    /\ result' = IF fault # "none" THEN fault
                  ELSE IF turn = "completed" THEN "completed" ELSE "cancelled"
    /\ UNCHANGED <<turn, abortRequested, acknowledged, childAlive, mutated, checkedAfterClose, fault>>

Done == phase = "done" /\ UNCHANGED vars

Next == RequestCancellation \/ CompletionWins \/ SendInterrupt \/ ReceiveAcknowledgment
        \/ ReceiveInterrupted \/ WrongTerminalStatus \/ InterruptFails \/ RepositoryChanges
        \/ BeginClose \/ ChildExits \/ ForcedClose \/ CloseFails \/ InspectAfterClose \/ Report \/ Done

TypeOK == /\ phase \in {"active", "reconciling", "interrupting", "awaiting-terminal",
                        "settled", "closing", "exited", "close-failed", "checked", "done"}
          /\ turn \in {"running", "completed", "interrupted"}
          /\ abortRequested \in BOOLEAN /\ acknowledged \in BOOLEAN /\ childAlive \in BOOLEAN
          /\ mutated \in BOOLEAN /\ checkedAfterClose \in BOOLEAN
          /\ fault \in {"none", "protocol-failed", "teardown-failed", "repository-mutated"}
          /\ result \in {"pending", "completed", "cancelled", "protocol-failed", "teardown-failed", "repository-mutated"}

CleanCancellation == result = "cancelled" =>
    /\ acknowledged /\ turn = "interrupted" /\ ~childAlive
    /\ checkedAfterClose /\ ~mutated /\ fault = "none"

CleanCompletion == result = "completed" =>
    /\ turn = "completed" /\ ~childAlive /\ checkedAfterClose /\ ~mutated /\ fault = "none"

MutationPreserved == (phase = "done" /\ mutated) => result = "repository-mutated"
FinalResultConsistent == (phase = "done" /\ fault # "none") => result = fault
====

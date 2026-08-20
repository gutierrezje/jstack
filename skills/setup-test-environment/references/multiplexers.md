# Multiplexer branches

Use the branch selected by the workflow. Treat these commands as patterns and
confirm them with the installed version's `--help` before acting.

## tmux

Discover current state with `tmux list-sessions` and `tmux list-panes -a`. If a
private socket is already part of the target workflow, repeat its explicit `-S`
argument in every command and in the final attach command.

Create a detached session and capture pane IDs instead of assuming pane indexes:

```bash
qa_backend="$(tmux new-session -d -P -F '#{pane_id}' -s "$qa_session" -n services -c "$qa_checkout")"
qa_client="$(tmux split-window -h -P -F '#{pane_id}' -t "$qa_backend" -c "$qa_checkout")"
qa_logs="$(tmux split-window -v -P -F '#{pane_id}' -t "$qa_client" -c "$qa_checkout")"
tmux select-pane -t "$qa_backend" -T backend
tmux select-pane -t "$qa_client" -T client
tmux select-pane -t "$qa_logs" -T logs
```

Add a `qa` window when it earns its space. Start commands with `tmux send-keys`
and an explicit target. Verify with `tmux list-panes -F` and `tmux capture-pane
-p -J`. Hand off `tmux attach -t "$qa_session"` with the same socket argument,
if any.

## Zellij

Discover current state with `zellij list-sessions`. Create a detached session
with `zellij attach --create-background "$qa_session"`. Use a temporary KDL
layout when pane geometry must be deterministic. Otherwise use targeted actions:

```bash
zellij --session "$qa_session" action new-pane --name backend --cwd "$qa_checkout"
zellij --session "$qa_session" action new-pane --name client --cwd "$qa_checkout"
zellij --session "$qa_session" action new-tab --name qa --cwd "$qa_checkout"
```

Capture returned pane and tab IDs. Send commands with targeted `paste` followed
by `send-keys ... Enter`. Verify with `action list-panes --json`, `action
list-tabs --json`, and `action dump-screen --pane-id`. Hand off `zellij attach
"$qa_session"`. Offer `zellij watch "$qa_session"` only when the user wants a
read-only view.

## Herdr

Discover current state with `herdr status`, `herdr workspace list`, and `herdr
pane list`. Create a workspace with an exact checkout and capture the JSON IDs:

```bash
herdr workspace create --cwd "$qa_checkout" --label "$qa_session" --no-focus
herdr pane split <pane-id> --direction right --ratio 0.62 --cwd "$qa_checkout" --no-focus
herdr tab create --workspace <workspace-id> --cwd "$qa_checkout" --label qa --no-focus
```

Name panes with `herdr pane rename` and start commands with `herdr pane run`.
Verify each process with `herdr pane process-info`, `herdr pane read`, and
`herdr pane wait-output`. Focus the finished tab and workspace before handoff.
The normal local attach command is `herdr`; use `herdr --session <name>` only
when the setup selected a named Herdr server session.

Herdr's server owns the processes after a client detaches. Terminal Computer Use
may reject Kitty and other terminal apps. In that case, finish through Herdr's
CLI and ask the user to type the single attach command.

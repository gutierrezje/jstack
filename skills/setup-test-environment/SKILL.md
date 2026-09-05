---
name: setup-test-environment
description: "Use when asked to launch an application checkout or PR for hands-on testing, including its services, client, and visible logs."
---

# Set up an app test environment

Make visibility part of readiness. Put every long-running process in a named
pane the user can see, inspect, restart, and stop. Center the workspace on the
real app client rather than a generic collection of development servers.

## Workflow

### 1. Resolve the exact test target

Identify the authoritative checkout, branch, exact commit, and requested test
scope. Read the repository instructions and package scripts before choosing
commands. Inspect the current diff or PR when it determines which product paths
matter. Preserve user changes in a dirty checkout.

Classify the client as mobile, web, or desktop. Read
[application-targets.md](references/application-targets.md) completely and use
the matching branch. List the components required for this test. Consider the
client, backend, workers, database or emulator, device or simulator, focused
logs, hosted checks, and an interactive shell. Include only components that
bear on the requested behavior.

Complete this step when one exact code target and an evidence-backed component
list are recorded.

### 2. Inventory the running environment

Inspect installed multiplexers, their active sessions, occupied ports, matching
processes, devices, and shared development services. Resolve the owner and
target of each matching process before changing it. Reuse a healthy process
when it is already visible in the selected workspace. If the same checkout owns
a hidden process that blocks the requested visible setup, stop it gracefully and
restart it in the selected multiplexer.

Keep one multiplexer layer. When switching tools, rehome processes owned by the
same target instead of nesting one multiplexer inside another.

Read environment selectors without printing secrets. Follow repository ownership
rules for shared databases and development deployments. Launching local services
is part of setup. Get added authority before a production deployment, credential
creation, unrelated process termination, or shared backend takeover.

Complete this step when every required port and shared service has one known
owner and there are no unexplained conflicts.

### 3. Select and build the workspace

Honor an explicit tmux, Zellij, or Herdr choice. Otherwise prefer an installed
multiplexer that is already active for the user. If none is installed, present
the supported choices and get install authority.

Read the chosen tool's local `--help`, then read
[multiplexers.md](references/multiplexers.md) completely and use the matching
branch. Use a collision-safe session name derived from the repository and
target. Keep tool-specific mechanics out of the core workflow.

Create a compact layout:

- A `services` view holds the required long-running processes and useful logs.
- A `qa` view holds current checks when relevant and an interactive shell.
- Pane names state the process or purpose.
- High-volume logs are filtered so errors and readiness remain visible.

Scale the layout to the component list instead of starting unrelated services.
Complete this step when the multiplexer reports the named workspace, views, and
panes at the exact checkout.

### 4. Start the real processes

Run the repository's own commands in the named panes. Keep long-running commands
inside the multiplexer instead of hidden execution sessions. Preserve required
environment selection and use the current checkout as each pane's working
directory.

Use a UI-control skill to open or inspect an interactive client when available.
If UI control blocks terminal applications, use the multiplexer CLI and leave
the user one attach command. Respect the block rather than bypassing it.

Complete this step when every required pane owns its intended foreground process
or displays a precise startup failure.

### 5. Prove the environment is testable

Verify from outside each process, not from launch commands alone:

- Inspect multiplexer process metadata and recent pane output.
- Match each service's documented readiness signal.
- Confirm expected ports and endpoints are live.
- Confirm the client or simulator connects to the selected service and exact
  code target.
- Recheck checkout identity and cleanliness after startup.

For a PR, keep hosted checks in their own pane only when they help the current
manual test. Do not treat hosted checks as proof that the runtime client points
at the current commit.

Complete this step when every component is ready with fresh evidence, or the
environment has one explicit blocker with its failing pane and output.

### 6. Hand the workspace to the user

Lead with the exact attach command. Then report the workspace map, code identity,
ready and failed components, intentionally omitted components, shared service
target, and how processes persist or stop after detaching.

Completion means the user can run one command and see every required live
process, and each process is either verified ready or visibly blocked with an
actionable error.

# Application target branches

Use the branch that matches the real client. Repository instructions and local
scripts remain the source of truth for exact commands.

## Mobile

Treat the app bundle, native client, backend, device, and logs as separate pieces
that must agree on one test target.

1. Identify the framework, bundle server, development-client requirements,
   backend URL, native configuration, and supported simulator or device loop.
2. Distinguish the daily development command from a native rebuild. Rebuild only
   when native dependencies or configuration require it.
3. Resolve the selected device, bundle-server port and URL, installed app ID,
   and backend target before launch. A booted simulator with a stale bundle is
   not current evidence.
4. Start the backend and bundle server in visible panes. Open the installed app
   through the repository's normal development path.
5. Keep JavaScript output with the bundle server. Filter platform logs to the app
   process and useful error classes so OS networking noise does not bury faults.
6. Inspect the real app UI. Confirm it loaded from the selected bundle server,
   reaches the selected backend, and shows behavior from the exact checkout.

For a physical device, also verify host reachability and the network address
embedded in the development URL. After a new commit, restart every stale piece
needed to make the bundle, backend, installed client, and manual QA evidence
refer to that commit.

## Web

Use the smallest workspace that exposes the browser app and its required
dependencies.

1. Identify the app route, development server, backend or worker dependencies,
   local environment selection, and expected port.
2. Start the development server and required dependencies in visible panes. The
   development server's own output can serve as the client log when it is clear.
3. Open the exact local URL in a browser. Verify the rendered route plus relevant
   console, network, authentication, and backend behavior.
4. Leave the URL in the handoff. Omit unrelated sites, packages, and log panes.

A single development-server pane and shell is enough for a self-contained web
app. Add panes only when a separate dependency or log source changes the test.

## Desktop

Use this branch for Electron, Tauri, and similar apps with a native window and a
local web or native runtime.

1. Identify the project command that coordinates the main process, renderer,
   preload or bridge, local server, backend, and native build.
2. Keep an orchestrating project command intact when it owns child processes.
   Split panes only for independently controlled dependencies or logs.
3. Inspect the process tree and readiness output, then open the real application
   window with UI control when available.
4. Verify renderer content, main-process behavior, backend connectivity, and the
   exact checkout. A live renderer server without the desktop window is not a
   testable desktop environment.

Keep native crash output and app logs visible without duplicating the same stream
across panes.

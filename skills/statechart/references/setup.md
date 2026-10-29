# Explicit local setup

The launcher needs Java 11 or later (tested with Java 21) and the TLC release and SHA-256 recorded in `../scripts/toolchain.json`. Supply an installed Java executable with `JAVA` when it is not on `PATH`. Set `TLA2TOOLS` to the pinned `tla2tools.jar`. The launcher checks its SHA-256 on every run.

To fetch the official pinned jar only when the user has authorized the download, choose a new directory and run:

```sh
node scripts/setup-tlc.ts --download --dir NEW_DIRECTORY
```

The setup command verifies the downloaded SHA-256. Alternatively, point `TLA2TOOLS` at an existing copy with the same hash. Run `scripts/statechart --doctor` before checking a model. This workflow uses no mise or global installation. Once dependencies are present, the checker needs no external service or upload, but TLC opens a local RMI socket. Respect the host's approval controls when local sockets are restricted. Trusted view code has ordinary process and network access.

The default limit is a 60-second worker deadline, one TLC worker, and a 256 MiB Java heap. The heap cap does not bound total process-tree memory. The command terminates its worker process group and releases inherited pipes; arbitrary detached children created by a trusted view remain the view author's cleanup responsibility.

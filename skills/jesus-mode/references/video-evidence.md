# Video evidence

Use video when the user requests it or a material claim depends on a sequence,
transition, animation, or timing-dependent interaction. Keep screenshots for
reviewing static states. Select the required proof before driving the journey;
an optional demonstration clip does not become an acceptance gate by default.

## Prepare capture

Use the project's verifier and existing controller. Discover recording support
through its capabilities or documented help, then bind the recorder to the same
checkout, build, runtime, device or page, and fixtures as the feature receipt.
Use [environment setup](../../setup-test-environment/SKILL.md) when the target is
not ready. Keep platform mechanics in the project adapter.

Choose the backend for the surface actually under test:

- **Playwright-managed web:** enable video when creating the context, before
  driving the page. Close the owned context to finalize the video. Preserve
  successful recordings when they are review evidence; failure-only retention
  discards the passing demonstration. Capture a trace when action, DOM, or
  network inspection helps diagnosis. See [Playwright videos](https://playwright.dev/docs/videos).
- **Existing browser or desktop app:** inspect the available tool's recording
  API, or use a documented platform recorder scoped to the relevant window or
  region. Attaching to an existing browser does not establish that its context
  can record. A renderer recording does not cover native menus or dialogs.
- **Simulator or device:** use the platform's supported recorder against the
  explicitly selected device. For iOS Simulator, inspect `simctl io` help and
  select the device ID rather than relying on an ambiguous booted-device alias.
  Confirm the app's build and backend separately from the device identity.

Check dependencies, capture permission, output format, target scope, and stop
behavior before the journey. Use task-specific fixtures and capture only the
surface needed. Report a missing capability precisely and continue independent
work; a tool listing or a command's successful start is not a working capture.

## Record and finalize

1. State the feature, entry point, triggering action, expected result, and
   whether video is required. Record baseline and treatment under comparable
   conditions when the old behavior matters.
2. Start capture before the trigger and confirm it is active. Exercise the
   actual journey with semantic actions and observable waits. Keep action
   timestamps so the clip can be matched to the receipt. Allow a brief lead-in
   for recorder startup and readable initial state when needed; inspect the
   opening frames to confirm the trigger was captured.
3. Stop after the resulting state is visible. Finalize in cleanup on success,
   assertion failure, timeout, and recoverable runner interruption such as
   cancellation or a handled termination signal. Stop only the
   recorder and resources owned by this run; bound finalization so a stuck
   recorder cannot hang verification indefinitely.
4. Decode or play the completed file and inspect the relevant interval. Confirm
   the correct target, readable dimensions, nonzero duration, and coverage from
   trigger to result. Inspect still frames when needed, but do not describe a
   slideshow assembled from screenshots as continuous interaction footage.
5. Preserve the original behavior result and any capture failure separately.
   Keep failed or incomplete recordings for diagnosis, marked with their actual
   coverage. Add the artifact to the feature receipt before handing it off.

Use short recordings around meaningful journeys. Avoid recording unrelated setup
or idle time. For performance measurements, separate demonstration capture from
measurement or hold recording overhead constant and disclose it.

## Receipt and result

Extend `artifacts` in the [existing receipt](verification.md#evidence-receipt).
For each video, record its kind, local path, media type, capture scope, start/end
time, measured duration, finalization status, and covered action IDs. Keep
source/build/runtime identity in the enclosing receipt; identify a baseline
clip's separate target explicitly. Record missing required capture and the
attempted recovery in `confounds`.

List covered actions only after inspecting the clip. Keep intended coverage
separate when a file is missing or unreadable. Use observed capture timestamps,
not receipt-writing time, and distinguish the action interval from media duration.

Use these result rules:

- A failed behavior assertion is `NOT VERIFIED`, including when capture also
  fails. Preserve both failures.
- A passing behavior with missing, unreadable, or incomplete required video is
  `INCONCLUSIVE`. Preserve the passing observations and exact evidence gap.
- Optional video failure does not invalidate otherwise sufficient proof.
- An interrupted journey establishes only the actions actually observed.

A video supports the receipt; it does not replace assertions or a second view of
persisted state. A synthetic fixture validates the capture harness, not the real
product. Label that distinction in both the receipt and the handoff.

## Delivery and reuse

Keep one-off recordings in task scratch space or an existing ignored artifact
directory under the [evidence storage rules](../../open-pr/SKILL.md#evidence-storage-and-cleanup).
Publish selected clips only within an authorized PR or artifact operation using
the [GitHub transport contract](codex-compatibility.md#github-transport).
Include the journey, result, and source identity with the clip. Preserve its
canonical published URL and any retention limit in the evidence record.

Readback must confirm the intended clip appears and plays in the rendered PR;
image-load checks do not verify video. Preserve local evidence until publication
and dependent checks finish. After a repair, refresh only affected journeys as
specified by [Babysit QA](../../babysit-pr/SKILL.md).

For a dry run, capture against a disposable fixture, inspect the file and receipt,
and prepare the delivery content locally. Stop before uploads or PR mutations.
Report which capture, cleanup, and delivery stages actually ran, including any
unexercised native or remote path.

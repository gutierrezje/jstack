# Video evidence workflow dry run

Date: 2026-09-24.

The [video evidence contract](../skills/jesus-mode/references/video-evidence.md)
is now linked from Jesus mode, the project verification contract, verifier
creation, environment setup, Open PR, GitHub transport, Babysit QA, and the
example feature map. This adds workflow guidance in the checkout; it does not
install a recorder into an application or refresh the installed plugin cache.

## Scope

An independent agent followed the written guidance using an isolated synthetic
note-saving page in headless Chromium. The parent inspected receipts and frames,
identified coverage and reporting defects, and requested focused repairs. The
fixture has no backend and no real user data. Its save result is an in-memory
UI state, not proof of durable persistence.

The local runtime used Playwright 1.62.1 and Chromium 151.0.7922.34. Recordings
were captured at 960 by 640 pixels as WebM. The parent also converted the corrected
happy-path clip to H.264 MP4 and inspected frames from the recording.

## Observed results

| Case | Observed outcome |
| --- | --- |
| Happy path | Corrected footage shows empty Ready, populated Ready, Saving, and Saved. The clip is 4.36 seconds and the feature receipt is `VERIFIED` for the synthetic journey. |
| Intentional assertion failure | The fixture reaches Saved but an intentionally wrong expected status fails. Its receipt remains `NOT VERIFIED`; expected test failure is not relabeled as a passing journey. The initial clip's limited visual coverage is retained. |
| App reload during Saving | A reload interrupts the first attempt and a retry reaches Saved. This tests app recovery, not shutdown of the recorder. Initial video coverage is incomplete, so it does not establish the full required filmed journey. |
| Unreadable required video | The behavior passes, but a deliberately corrupted disposable video copy fails media inspection. The receipt is `INCONCLUSIVE`, with the genuine original retained separately for diagnosis. |
| Runner termination | A supervisor sends SIGTERM to its owned child while the page shows Saving. The child finalizes a readable 2.12-second video, exits 143, and records an `INCONCLUSIVE` journey because Saved was not observed. This is graceful signal handling, not recovery from an OS crash. |

The first browser launch failed at the sandbox's macOS process boundary, before
page execution. That log was preserved. The same isolated trial then ran through
the supported escalation path. There were no uploads or PR mutations.

## Corrections learned from the trial

- **Inspect the opening frames.** Initial clips began at Saving even though the
  action log contained earlier steps. Add a short recorder lead-in and readable
  state holds when necessary, then inspect the actual footage. The corrected
  happy path uses 500 ms holds; these are presentation timings, not performance
  measurements or universal product waits.
- **Separate intended and observed coverage.** An unreadable artifact cannot
  claim that it visually covers actions. Preserve intended scope and successful
  observations separately from inspected video coverage.
- **Use actual timestamps.** Receipt-writing time is not screenshot capture
  time. Keep the action interval distinct from the encoded media duration.
- **Exercise runner interruption directly.** A page reload does not test
  termination of the recording process. Use an owned child and a handled signal.
- **Keep exit status consistent.** An incomplete verification needs a nonzero
  child exit even when cleanup succeeds. A test supervisor can separately report
  that expected cancellation was handled correctly.

These findings led to focused improvements in the shared guidance and the
disposable trial. Original failed attempts were retained rather than overwritten
with passing outcomes.

## Evidence and limits

The scratch directory is `/private/tmp/jstack-video-dry-run.53G79o`. It contains
the fixture, trial scripts, logs, original and corrected recordings, extracted
frames, per-feature receipts, and the local delivery draft. The parent-created
`happy-path.mp4` is a viewing copy of the corrected WebM. These temporary files
are kept outside source history and may be removed by operating-system cleanup.

This dry run proves local synthetic web capture and exercises failure reporting.
It does not prove recording of an existing Codex browser session, native desktop
or mobile capture, a real application's build/backend identity, or GitHub upload
and playback. The delivery stage stops at local preparation. A real-product
pilot and an authorized PR delivery test remain the next integration checks.

Repository structural validation, plugin validation, and changed-skill validation
passed during authoring. The plugin validator used an already-cached PyYAML
package without installing dependencies. No production executable code was
changed.

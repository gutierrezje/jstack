# Video evidence in Jstack

Investigated 2026-09-24. This note records the pre-implementation proposal and
the workflow as it existed during that investigation. The shared guidance has
since been added in [video evidence](../skills/jesus-mode/references/video-evidence.md)
and linked from the existing skills. Recording backends remain project-owned;
updating these instructions does not install a recorder into an application.

## Recommendation

Add video capture to the existing project verification adapters and receipts.
Keep common evidence policy in Jstack and recording mechanics in the adapter
that owns the actual browser, app, or simulator. Start with one web journey and
one simulator journey before generalizing desktop capture.

Do not introduce a separate orchestration skill or recording service initially.
Jstack already selects journeys, starts the right runtime, records target
identity, gathers artifacts, prepares PR evidence, and invalidates stale checks.
The missing piece is a recorder with a reliable lifecycle and explicit proof of
what its output covers.

## Existing process and integration points

| Existing owner | Verified current behavior | Proposed addition |
| --- | --- | --- |
| [Jesus mode](../skills/jesus-mode/SKILL.md#prepare-evidence-before-implementation) | Establishes a screenshot path before UI work, captures baselines, tracks source identity, refreshes affected captures after repairs. | Select screenshot, video, or both from the claim being tested. Establish recording capability early when transitions matter. |
| [Set up test environment](../skills/setup-test-environment/SKILL.md) and [application targets](../skills/setup-test-environment/references/application-targets.md) | Align checkout, client, services, backend, device, and visible processes. | When video is selected, identify the capture target and check recorder prerequisites. Leave journey selection and recording duration to the verifier. |
| [Create verification skill](../skills/create-verification-skill/SKILL.md) | Adopts existing controllers or creates project adapters, feature recipes, and receipts. | Teach the selected adapter to record a feature run and finalize its artifacts; add the exact capture commands to the recipe. |
| [Verification contract](../skills/jesus-mode/references/verification.md) | Requires capabilities, target checks, owned resources, automatic action evidence, receipts, and cleanup. Already lists `record` under performance capabilities. | Define video separately from performance profiling and attach recording metadata to the existing receipt. |
| [Open PR](../skills/open-pr/SKILL.md#evidence-rules) | Reuses valid artifacts, requires screenshots for relevant UI states, allows supplemental recordings, keeps one-off evidence out of Git. | Publish selected clips beside screenshot summaries; verify video playback and captions using video-specific checks. |
| [Babysit QA](../skills/babysit-pr/SKILL.md) | Selects affected feature recipes, checks receipts against the current target, reruns affected recipes after repairs. | Check required recording coverage through the same receipt. Do not create a second acceptance ledger or rerun all videos after unrelated changes. |
| [Show me your work](../skills/show-me-your-work/SKILL.md) | Links evidence at material decision and verification checkpoints. | Point to the existing feature receipt and clip when useful; avoid another recording archive. |

The verification contract, generator, setup skill, Open PR skill, GitHub
transport reference, and real-surface QA reference were compared with their
installed Jstack cache counterparts and matched during this investigation.
These integration points are present in the installed workflow, not merely
prospective repository files.

## Capture policy

Use screenshots for static layout, typography, and final states. Add short
continuous video for navigation, multi-step flows, drag and drop, focus behavior,
loading states, streaming, animation, and timing-dependent regressions. Honor an
explicit request for video even when screenshots would otherwise suffice.

A feature recipe should state when video is required, what interval it must
cover, and the observable pass condition. Start before the triggering action and
continue until the resulting state is observable. Record successful verification
runs as well as failed reproductions when both support the review claim.

Keep existing screenshots for quick PR scanning. A clip supplements assertions,
runtime identity, and persistence checks; it cannot prove a database write or
correct backend selection merely by showing a successful-looking screen.

For performance claims, retain the existing like-for-like measurements. Recording
adds work to the machine, so separate demonstration capture from measurement or
hold recording overhead constant across compared runs and disclose it.

## Recorder contract

Use the adapter's existing discovery interface to advertise recording support,
capture scope, prerequisites, and output format. Bind capture to its run ID and
verified target. Prefer recording around the adapter's existing feature-run
operation; expose start and stop only if interactive exploration needs them.
Avoid prescribing invented commands as though they already exist.

The lifecycle should be:

1. Verify source, built client, runtime, backend, fixtures, and capture target.
2. Start the recorder before the first action and confirm capture has begun.
3. Exercise the recipe, recording observations and action timing.
4. Stop and finalize recording on success, assertion failure, timeout, or
   interruption. Preserve the original product failure if finalization also fails.
5. Inspect the media: correct target, expected interval, readable dimensions,
   nonzero duration, and decodable video. File existence alone is insufficient.
6. Add the recording and its coverage to the feature receipt. Clean up owned
   processes and fixtures while retaining evidence needed for review or failure
   diagnosis.

Extend the existing `artifacts` entries rather than replacing the receipt schema.
An initial video entry needs its kind, path, media type, capture scope, start/end
time, duration, finalization status, and actions covered. The enclosing receipt
already owns source/build/runtime identity. Include per-clip identity only if it
differs, such as baseline and treatment clips. Record incomplete or unavailable
capture explicitly; do not silently substitute screenshots for required video.

Keep the product observation distinct from evidence completeness. A failed
assertion remains `NOT VERIFIED` even if recording also failed. An otherwise
passing run with a required missing clip has an evidence gap and cannot claim
the recipe fully verified. An optional missing clip need not invalidate other
sufficient evidence.

## Recording backends

See [capability research](video-evidence-capture-capabilities.md) for primary
sources, local tool checks, prerequisites, and untested paths.

- For an existing Playwright test or adapter, configure video before creating
  the browser context. Close the owned context to flush the recording. Preserve
  successful videos for review journeys; retain traces when useful for debugging.
- For an already-open browser controlled through Codex, first inspect supported
  capture APIs. A Playwright configuration does not retrofit recording into a
  different browser session. Use a scoped platform recorder if a supported video
  API is absent; do not change the interaction surface just to make recording easy.
- For native app journeys in an iOS Simulator, use the selected simulator's
  native recording command and retain its device identity in the run.
- For desktop or real-device capture, adopt a documented recorder for that
  surface after a pilot proves target selection and finalization. Renderer-only
  recordings do not establish native window, menu, or dialog behavior.

Jstack remains portable: no universal dependency on Playwright, Xcode, macOS, or
a video encoder. Each project verifier selects its backend and documents missing
capability. Existing control skills are useful drivers but do not by themselves
establish that video is configured or working.

## PR delivery

Preserve [existing storage rules](../skills/open-pr/SKILL.md#evidence-storage-and-cleanup):
working videos belong in task scratch space or an ignored artifact directory;
selected reviewer clips are published only within an authorized PR operation.
Keep raw captures and traces out of source history by default.

Extend the [GitHub transport contract](../skills/jesus-mode/references/codex-compatibility.md#github-transport)
with a video branch. Check installed upload support and supported media types;
keep the exact attachment URL returned by GitHub. Use the appropriate video
presentation instead of image Markdown. A video URL needs video playback
verification, not the existing image-only `naturalWidth` check. Confirm that the
selected clip loads, plays, and matches the caption in the rendered PR. Record
expiry for any alternative artifact host.

The installed GitHub CLI is version 2.101.0. Its `gh pr edit --help` explicitly
supports image and video attachments, says videos render as players, and warns
that partial upload failure can still update the PR. This fits the existing PR
body workflow without a new hosting service or a public comment. After partial
failure, read back the PR and reuse successful uploads before retrying. An
upload and playback test is still needed.

Do not make an upload during investigation. A delivery pilot should use an
authorized PR and harmless fixture footage. Validate CLI attachment behavior,
rendering, playback, and retry behavior before calling the integration complete.
No change to source-review routing or media-sharing authority is needed.

## Smallest implementation sequence

1. **Shared policy and one example.** Add a focused video reference under
   `skills/jesus-mode/references/`, linked from the verification contract. Update
   Jesus mode's early evidence selection, the verifier generator, one sample
   feature recipe, Open PR, GitHub transport, and Babysit QA to use it. Keep the
   setup skill focused on readiness; link recording prerequisites rather than
   duplicating platform instructions.
2. **Web pilot.** In the target application's existing verifier, record one
   disposable feature journey, its failing path, and an interrupted run. Verify
   readable output, target identity, receipt coverage, retention, and cleanup.
   This requires selecting an actual app repository; Jstack itself has no app
   journey to exercise.
3. **Simulator pilot.** Reuse the same receipt contract around one selected
   device and native app journey. Prove that a mismatched device or stale build
   is rejected and recording stops without terminating unrelated processes.
4. **Delivery pilot.** Attach a selected clip in an authorized PR, verify playback
   and source identity, and confirm Open PR and Babysit reuse the receipt.
5. **Expand only from demand.** Add desktop/real-device backends when a product
   needs them. Extract shared executable tooling only after pilots demonstrate
   repeated mechanics that deserve a common implementation.

Completion of the implementation would require actual product footage and a
delivery pilot, not just updated skill prose or an installed recorder. This
investigation establishes the integration design and documented capabilities;
it does not establish that any product journey has been recorded.

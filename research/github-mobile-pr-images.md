# GitHub Mobile PR image 404s: research notes

## Finding from Spill threads

The leading explanation for the sampled Spill failures is private repository
image authentication, not a missing file or a signed token stored in Markdown.
The exact GitHub Mobile failure has not been reproduced on a device.

In **Work on GitHub issue 225**, the user reported “404’s on those images” for
[PR #231](https://github.com/gutierrezje/spill/pull/231). The agent replaced
`raw.githubusercontent.com` URLs with `github.com/.../blob/<sha>/...?raw=true`
and verified only a signed-in desktop page. This fixed that observed desktop
path without proving Mobile compatibility.

Fresh read-only checks on 2026-09-19 (local date) found:

- Spill is private. The authenticated contents API finds
  `artifacts/review/pr231-section-switch/drinks.png` at
  `fadd983a57b15eb2255147785ac1befa47535565` (308,726 bytes), while its anonymous
  raw URL returns HTTP 404. This proves access-dependent behavior, not a Mobile defect.
- Current bodies contain 32 screenshots across
  [#219](https://github.com/gutierrezje/spill/pull/219) (6),
  [#229](https://github.com/gutierrezje/spill/pull/229) (3),
  [#231](https://github.com/gutierrezje/spill/pull/231) (5),
  [#238](https://github.com/gutierrezje/spill/pull/238) (9), and
  [#268](https://github.com/gutierrezje/spill/pull/268) (9).
  Every image uses a repository blob URL; none of these stored URLs contains
  a signed token. These are a targeted sample, not a complete PR inventory.

The thread history and live PRs support replacing the private blob/raw delivery
path with native PR attachments and testing the result in Mobile. They do not
prove where Mobile loses authentication or that attachments solve every app bug.

## Confirmed

- GitHub's attachment guidance says uploads insert an anonymized URL into the text field. Attachments in public repositories are available without authentication; private/internal repository uploads are viewable only by people with repository access. [Attaching files](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/attaching-files)
- In its May 2023 security announcement, GitHub staff said future attachments on private repositories require login; the change did not retroactively alter older uploads. In June, staff clarified that the rendered HTML's active attachment links last five minutes. [More secure private attachments](https://github.com/orgs/community/discussions/54551)
- Current GitHub CLI source posts to `uploads.<host>/user-attachments/assets`, then uses the URL returned by GitHub as the Markdown asset URL. Official CLI docs say `--attach` uploads the local file and rewrites a matching local Markdown reference in place. This is the supported way to create/replace an attachment. [CLI v2.101.0 upload code](https://github.com/cli/cli/blob/v2.101.0/internal/attachments/client.go) · [CLI attachment docs](https://docs.github.com/en/github-cli/github-cli/attaching-files-with-github-cli)
- GitHub documents repository-hosted images as a separate option. For PR text it documents relative `../blob/<branch>/...?...raw=true` links; an image in a private repository works only for a viewer with read access to that repository. [Image syntax and relative links](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#images)
- GitHub Mobile officially supports reading, reviewing, and collaborating on PRs, but its documentation does not specify image URL resolution, signed-link refresh, or attachment authentication behavior. [GitHub Mobile docs](https://docs.github.com/en/get-started/using-github/github-mobile)

## Observed Spill case

The parent traced the 404 report in the Spill thread **“Work on GitHub issue 225”** to [PR #231](https://github.com/gutierrezje/spill/pull/231). Across PRs #219, #229, #231, #238, and #268, the current bodies contain 32 images linked to files through private-repository `blob/<commit>/<path>?raw=true` URLs; none stores a `private-user-images` URL or signed query. PR #240 currently has no such images. The sample `artifacts/review/pr231-section-switch/drinks.png` exists at commit `fadd983a57b15eb2255147785ac1befa47535565` (308,726 bytes) according to the parent's authenticated Contents API check; its anonymous raw URL returns 404. This matches GitHub's documented access rule for private-repository images and does not imply the image is missing. The parent verified viewing only in a signed-in desktop context; GitHub Mobile remains untested.

## Reports and hypotheses

- A May 2025 Community post reports that newly uploaded images returned 404 when opened from GitHub Mobile even while the user was logged in. It is an unverified user report about README images, with no useful device/app version or request trace; it is adjacent evidence, not proof of a PR-specific mobile defect. [User report](https://github.com/orgs/community/discussions/159775)
- **Hypothesis for the observed Spill case:** the Mobile image request does not carry or reuse the signed-in account's private-repository authorization for a `blob`/`raw` image. GitHub confirms repository access is required; public docs do not explain how Mobile passes that access to the raw image request. A 404 by itself does not identify which case occurred.
- **Separate general failure mode:** a mobile screen can retain rendered HTML with an expired five-minute signed attachment URL. This fits GitHub staff's TTL and user reports of 404 after waiting, but it does not match the URL form currently stored in the sampled Spill PR bodies.
- Do not diagnose a private `blob`/`raw` image as an attachment-token expiry: it is repository content governed by repository read permission. Replacing an attachment with a raw/blob image is appropriate when versioning in the repository is desired, but it will not make a private image public.

## Suggested fix and next check

1. Update the local GitHub CLI from the observed v2.96.0 to a version exposing
   `gh pr edit --attach` (introduced in v2.99.0). The current release checked was
   v2.101.0. Native uploads use the existing OAuth or classic PAT authentication
   and require repository write access; browser session extraction is unnecessary.
   [GitHub announcement](https://github.blog/changelog/2026-09-01-github-cli-media-in-issues-pull-requests-and-comments/)
2. Recover selected screenshots through authenticated repository reads and upload
   them as attachments to the same PR. Replace the old references with matching
   local paths in a temporary body file and use
   `gh pr edit <number> --body-file <file> --attach <image>` for each selected file.
   CLI rewrites matching references in place. Keep working files outside Git and
   avoid a second archive of captures or evidence notes in repository history.
   [CLI attachment docs](https://docs.github.com/en/github-cli/github-cli/attaching-files-with-github-cli)
3. Preserve the URL returned by the upload in the raw Markdown. Do not substitute
   a copied rendered `private-user-images`/JWT URL. Private attachments remain
   private; do not publish them elsewhere to avoid authentication.
4. Read the updated body back, check every replacement and attachment, and verify
   that the inline images actually load in the signed-in GitHub web description.
   The user's acceptance decision is to verify the supported attachment process,
   not GitHub Mobile itself. No Mobile confirmation or Mobile-related readiness
   gap is required. This establishes publication correctness without claiming
   that a native Mobile test was performed.
5. If native attachments still fail only in Mobile, compare with a fresh
   authenticated browser session and capture the app version, OS, time, and
   inline-versus-fullscreen behavior for a GitHub bug report. Avoid repeated
   uploads when the stored canonical reference is already correct.

The installed `gh-image` v1.3.0 extension says in its help that it extracts a
browser session token by default. It was not used and is not the recommended
route under the working agreement. Only its help and extension metadata were read.

This research changed no PRs, installed no software, and reproduced no native
Mobile journey. The recommended first repair target is PR #231, where the user
complaint and URL-conversion history are explicit. PR #282 subsequently used
the signed-in native attachment picker, preserved inline embeds through a CLI
body update, verified image loading on GitHub web, and removed its PNGs from the
source diff. The user selected that publication process as the desired standard;
GitHub Mobile testing is excluded from PR acceptance.

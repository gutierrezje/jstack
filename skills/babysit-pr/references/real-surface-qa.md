# Real-surface QA

Read and follow the [project verification contract](../../jesus-mode/references/verification.md).
Classify the diff by changed user journey. Discover project-local
`.agents/skills/verify-*` skills or the repository's equivalent and read only the
matching skill and feature recipes. Use the repository's environment-setup skill
when one exists to align the exact checkout, client or frontend build, backend,
device or browser, authentication, logs, and data target. Do not duplicate its
process-management workflow inside this skill.

Run the selected feature IDs after repairs have settled. Read each
machine-readable receipt and confirm the head SHA, feature and entry point,
client or build identity, effective runtime and backend identity, user actions,
observed output, artifact paths, and cleanup disposition. A compile, unit test,
server start, stale open screen, configured provider, screenshot without target
identity, or worker self-report is not real-surface QA. For a persistent write,
require disposable state or explicit authority for the named QA data and record
every retained fixture.

Treat project verification files like tests. When the PR intentionally changes
a mapped journey or adapter contract, require the matching recipe or adapter
update in the PR. A pre-existing missing verifier remains `INCONCLUSIVE`; do not
expand babysitting into authoring new verification infrastructure unless the user
asked for it.

If the app reports a missing function, schema mismatch, stale bundle, wrong
account, or other likely target mismatch, realign the environment once before
classifying a product defect. Missing required harness, device, authentication,
fixture, mutation authority, or exact-build proof makes a material user-visible
change `INCONCLUSIVE`.

A non-force push of the exact locally verified OID preserves local real-surface
evidence. It does not prove a hosted preview; run the hosted recipe when the
acceptance path or deployment behavior requires it. A later repair invalidates
only the feature recipes whose behavior or environment contract it changed, but
those recipes must be rerun on the new head.

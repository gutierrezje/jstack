# Scoring clarification

This note is frozen before the first comparison and clarifies how to read the two outcome columns in `frozen-manifest.json`.

`expectedCandidate` is the common desired-behavior oracle for both baseline and candidate results. Candidate acceptance and the promotion threshold use this oracle. `expectedBaseline` records the pinned baseline's predicted observable behavior, including diagnosed defects; matching it shows defect reproduction, not correctness.

The report therefore records three separate measurements: baseline reproduction of `expectedBaseline`, baseline correctness against `expectedCandidate`, and candidate correctness against `expectedCandidate`. A candidate passes only when every desired-behavior case passes, including rejecting every negative case and retaining every control.

The analyzer's fixed upstream URL is routed to the local synthetic remote by a temporary PATH-scoped Git adapter. The frozen manifest's limitation text says Git configuration; that wording is inaccurate. No Git URL configuration is used, and the adapter rejects any other HTTP(S) remote.

The Windows path cases use simulated path strings with Node's `win32.basename` helper. They do not establish native Windows behavior.

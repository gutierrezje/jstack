# Visual parity

1. Capture immutable baseline images at named viewport, state, data, fonts, and platform.
2. Partition the surface into components and define pixel or perceptual thresholds.
3. Change one component at a time.
4. Capture the same state and inspect image diffs; a failing delta remains open.
5. Run interaction and accessibility checks so visual matching does not hide behavioral regressions.
6. Return baseline, final images, diffs, thresholds, and unresolved deltas.

Completion: every required state meets its threshold on the matching surface.

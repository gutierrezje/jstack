# Shipping

1. Confirm the user explicitly authorized landing and resolve the exact PR set and order.
2. Freeze each head SHA and independently verify required checks, live behavior, review state, and mergeability.
3. Invalidate a verdict whenever its SHA or effective diff changes; reverify moved heads.
4. Use ordinary GitHub merge flow by default. Use Graphite only when installed, configured, and requested.
5. Land only the contiguous verified run, stop on the first failed gate, and observe each resulting base/head transition.
6. Report merged PRs and SHAs, stopped items, and final trunk state.

Completion: every landed head had a valid verdict at merge time and trunk reflects the intended order.

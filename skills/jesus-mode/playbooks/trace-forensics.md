# Trace forensics

1. Record artifact provenance, capture window, workload, and limitations.
2. Establish the timeline and dominant threads, stacks, allocations, or events.
3. Separate application work from scheduler, runtime, tooling, and background noise.
4. Trace the dominant anomaly back to code and corroborate with a paired capture when available.
5. Return findings ordered by confidence, code locations, rejected interpretations, and next measurement.

Completion: every diagnosis points to trace evidence and code, or is labeled the strongest remaining hypothesis.

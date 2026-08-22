# Jstack routing table

This file is the single editable source for Jstack's Codex model, effort, and
fan-out choices.

## Roles

| Work | Model | Effort | Default fan-out |
| --- | --- | --- | ---: |
| Planning and orchestration | `gpt-5.6-sol` | `high` | 0 |
| Feature implementation | `gpt-5.6-luna` | `max` | 1 |
| Refactoring and mechanical edits | `gpt-5.6-luna` | `high` | 1 |
| Focused bug fix after cause is known | `gpt-5.6-luna` | `max` | 1 |
| Bug investigation | `gpt-5.6-terra` | `high` | 1 |
| Performance investigation | `gpt-5.6-terra` | `high` | 1 |
| Repository exploration | `gpt-5.6-luna` | `high` | 1 |
| Ambiguous research or cross-check | `gpt-5.6-terra` | `high` | 1 |
| Test discovery and verification | `gpt-5.6-luna` | `high` | 1 |
| Prose and product judgment | `gpt-5.6-sol` | `high` | 0 |
| Architecture and synthesis | `gpt-5.6-sol` | `xhigh` | 0 |
| Hardest unresolved work | `gpt-5.6-sol` | `max` | 0 |

## Pstack roles

| Pstack role | Route |
| --- | --- |
| feature | Luna Max executor |
| refactoring | Luna High executor |
| bug-fix | Terra High investigator, then Luna Max executor |
| perf-issue | Terra High investigator; Luna Max executor after measurement identifies the change |
| hillclimb | Luna Max experiment worker; parent accepts measured wins |
| judgment and prose | Sol High |
| hardest tasks | Sol XHigh; Max only after XHigh remains inconclusive |
| how explorer | Luna High |
| how explainer | Terra High |
| how critics | Luna High and Terra High, two maximum |
| why investigators | Terra High, one per available evidence lane and three maximum by default |
| why synthesizer | Sol High |
| reflect tooling | Luna High |
| reflect judgment and divergent | Terra High |
| reflect synthesizer | Sol High |
| arena runners | Sol High and Terra High; add Luna Max when N=3 |
| arena judge | Sol High advisor when the parent is not Sol |
| swarm workers | Luna High for exploration, research, and verification; Luna Max for bounded implementation or exhaustive execution; two by default and three maximum without explicit direction |
| architect runners | Terra High and Sol High |
| interrogate reviewers | Luna Max, Terra High, and Sol High; reduce to two for ordinary diffs |

## Topologies

| Mode | Dispatch |
| --- | --- |
| Jesus mode feature/refactor | One Luna executor; parent reviews |
| Jesus mode bug fix | One Terra investigator, then one Luna executor only after the cause is established; parent reviews |
| How | One Luna explorer; optional Terra explainer for a separate subsystem |
| Why | Up to two Terra investigators on distinct hypotheses; parent synthesizes, consulting one Sol advisor if needed |
| Arena | One Sol High candidate and one Terra High candidate by default; add one Luna Max candidate when N=3; parent judges |
| Architect | One Terra High candidate and one Sol High candidate; parent decides |
| Swarm | Classify each arm by work: Luna High for exploration, research, and verification; Luna Max for bounded implementation or exhaustive execution. Use two workers by default and three maximum without explicit user direction |

## Effort adjustments

- Use `medium` for cheap, reversible exploration where mistakes are easy to detect.
- Use `high` for normal investigation and review.
- Use `xhigh` when ambiguity or cross-file reasoning is the bottleneck.
- Use `max` for bounded execution that must be exhaustive or for the hardest unresolved judgment.

## Overrides

Honor an explicit user-selected model, effort, topology, or worker count. State the cost or latency implication when the override materially increases fan-out.

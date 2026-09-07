# Jstack routing table

This file is the single editable source for Jstack's Codex model, effort,
service-tier, named-agent, and fan-out choices.

Use these routes after deciding that delegation benefits the task. They select
children; they do not require a planner/executor split or replace the active
agent's model. The active agent may investigate, implement, and verify directly.
Honor an explicitly requested specialist or multi-agent workflow. The topologies
below are defaults when that delegated workflow is selected.

## Reasoning hierarchy

Use Astra Medium for architecture, difficult synthesis, and the hardest unresolved
work. Sol Low is the next tier for routine planning, prose, and judgment; escalate
to Astra Medium when that work remains unresolved or needs the highest reasoning
tier. Luna High handles research, exploration, and routine verification; Luna Max
handles debugging, performance investigation, implementation, and deeper review.
Reserve Terra High for Arena design comparisons.
These choices do not change the active parent's model or require an extra advisor
when the parent can complete the work directly.

## Named-agent dispatch

Prefer the matching registered custom agent for every Luna route below, including
Pstack roles, panels, and swarms:

| Route | Preferred custom agent | Requested service tier |
| --- | --- | --- |
| Luna High | `luna-high-fast` | Fast |
| Luna Max | `luna-max-fast` | Fast |

Use the named agent when the current spawn tool exposes that name and its declared
model and effort match the route. Select it through `agent_type` or the tool's
equivalent named-agent selector, with fresh context and a bounded assignment.

These custom agents are installed separately from Jstack and request Fast processing.
A configuration file alone does not establish availability: inspect the current
tool interface. Existing conversations may need a fresh task or fork to expose a
new agent; create those only when the user requests them.

If the named agent is unavailable, dispatch the route's explicit model and effort
through supported overrides. Report the fallback once and treat Fast as unverified
unless the runtime exposes the active tier. A successful named-agent invocation
proves selection and execution, not the service tier actually delivered.

For an explicit effort adjustment, use a matching named agent or supported direct
overrides. Preserve the requested effort when falling back; an available High
agent cannot substitute for an unavailable Max agent.

## Roles

| Work | Model | Effort | Default fan-out |
| --- | --- | --- | ---: |
| Planning and orchestration | `gpt-5.6-sol` | `low` | 0 |
| Feature implementation | `gpt-5.6-luna` | `max` | 1 |
| Refactoring and mechanical edits | `gpt-5.6-luna` | `high` | 1 |
| Focused bug fix after cause is known | `gpt-5.6-luna` | `max` | 1 |
| Bug investigation | `gpt-5.6-luna` | `max` | 1 |
| Performance investigation | `gpt-5.6-luna` | `max` | 1 |
| Repository exploration | `gpt-5.6-luna` | `high` | 1 |
| Ambiguous research or cross-check | `gpt-5.6-luna` | `max` | 1 |
| Test discovery and verification | `gpt-5.6-luna` | `high` | 1 |
| Prose and product judgment | `gpt-5.6-sol` | `low` | 0 |
| Architecture and difficult synthesis | `gpt-6-astra` | `medium` | 0 |
| Hardest unresolved work | `gpt-6-astra` | `medium` | 0 |

## Pstack roles

| Pstack role | Route |
| --- | --- |
| feature | Luna Max executor |
| refactoring | Luna High executor |
| bug-fix | Luna Max investigator and executor; establish the cause before implementing |
| perf-issue | Luna Max investigator and executor; measure before selecting the change |
| hillclimb | Luna Max experiment worker; parent accepts measured wins |
| judgment and prose | Sol Low |
| hardest tasks | Astra Medium |
| how explorer | Luna High |
| how explainer | Luna Max |
| how critics | Luna High and Luna Max, two maximum |
| why investigators | Luna High, two by default and three maximum on independent evidence lanes |
| why synthesizer | Sol Low |
| reflect tooling | Luna High |
| reflect judgment and divergent | Luna Max |
| reflect synthesizer | Sol Low |
| arena implementation runners | Sol Low and Luna Max; add Luna High when N=3 |
| arena design runners | Sol Low and Terra High; add Luna Max when N=3 |
| arena judge | Parent judges; Sol Low advisor if needed when the parent is neither Sol nor Astra; Astra Medium for unresolved highest-level judgment |
| swarm workers | Luna High for exploration, research, and verification; Luna Max for bounded implementation or exhaustive execution; two by default and three maximum without explicit direction |
| architect runners | Sol Low and Astra Medium |
| interrogate reviewers | Two Luna Max reviewers with distinct correctness and architecture lenses; add Sol Low for high-risk or contested changes |
| show-me-your-work evidence reviewer | Luna Max |

## Topologies

| Mode | Dispatch |
| --- | --- |
| Jesus mode feature/refactor | One Luna executor; parent reviews |
| Jesus mode bug fix | One Luna Max investigator; reuse for execution after the cause is established; parent reviews |
| How | One Luna High explorer; a second for an independent subsystem or runtime lane; Luna Max explainer only when synthesis needs it |
| Why | Two Luna High investigators by default; a third only for an independent evidence lane; parent synthesizes, consulting one Sol Low advisor if needed |
| Arena | Use the design or implementation runner routes above; two candidates by default and the configured third when N=3; parent judges |
| Architect | One Sol Low candidate and one Astra Medium candidate; parent decides |
| Swarm | Classify each arm by work: Luna High for exploration, research, and verification; Luna Max for bounded implementation or exhaustive execution. Use two workers by default and three maximum without explicit user direction |

## Effort adjustments

- Keep Astra at `medium` and Sol at `low` for their configured routes unless the user requests a different effort. The adjustments below apply to other routes; effort labels do not rank capability across models.
- Use `medium` for cheap, reversible exploration where mistakes are easy to detect.
- Use `high` for normal investigation and review.
- Use `xhigh` when ambiguity or cross-file reasoning is the bottleneck.
- Use `max` for bounded execution that must be exhaustive or for the hardest unresolved judgment.

## Overrides

Honor an explicit user-selected model, effort, topology, or worker count. State the cost or latency implication when the override materially increases fan-out.

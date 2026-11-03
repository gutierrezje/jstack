---
name: working-brief
description: When research or plans need a readable, actionable brief, separate decisions, actions, and evidence.
---

# Working brief

Make an artifact the reader can work from, not merely a shorter answer. Put what matters for understanding, deciding, and doing first; preserve evidence underneath. Do not make every document a task tracker.

## 1. Establish the reader's job

Read the request, source material, and latest relevant decisions. Identify the reader, intended use, delivery surface, and action the document should support. Ask only when a missing answer would materially change the output; otherwise state the assumption.

Choose the appropriate form:
- **Research or decision:** a short working brief followed by evidence, alternatives, and acceptance details.
- **Status or execution:** an editable tracker or checklist with observed statuses, real dependencies, and completion criteria.
- **Reference or instruction:** retain the structure needed to look up or follow the material; do not force it into a decision memo.

Honor the requested format. Prefer phone-readable text for the opening and single-column layouts in documents. For ongoing work, use a persistent editable artifact only when available and authorized. A static PDF checkbox is not an interactive tracker. Verify controls save their state before claiming they do. Creating a tracker does not authorize reminders, monitoring, sharing, or the work it lists.

## 2. Separate evidence from commitments

Privately classify each substantive point before composing:
- **Confirmed:** supported by a source, observation, or explicit user decision. Cite the supporting source or user decision, with date/revision and evidence limits where relevant. “Confirmed” must be attributable, not a tone of voice.
- **Recommended:** an option or next step suggested by the assistant or a source.
- **Decision needed:** a real unresolved choice with meaningful consequences.
- **Authorized task:** work the user has actually approved, not a recommendation converted to an assignment.
- **Open question:** information still missing or disputed.

Preserve these differences in the visible wording. Do not infer approval from a draft, checkbox, or proposed plan. Never invent owners, deadlines, estimates, success claims, or acceptance criteria. Mark absent ownership or dates as unassigned/unscheduled only when useful; otherwise omit them. Distinguish source implementation, test evidence, deployment, and actual usage instead of compressing all into “done.”

For engineering findings, distinguish **exists**, **missing in the inspected scope**, **planned**, and **proposed**. An issue or roadmap proves intent, not current code behavior. A completion claim needs its own implementation, test, or delivery evidence; a merged PR alone does not prove deployment. Keep a compact claim-to-evidence map when readers need to audit mixed evidence, but do not force one into every brief.

Reconcile later instructions against older proposals. Keep caveats that could change a decision near that decision; an appendix must not hide a material risk.

## 3. Compose the working layer

Write an opening that stands alone. Aim for a 30-second orientation, without imposing a fixed word/page limit:
1. State the main finding or recommendation in one or two concrete sentences.
2. Show what is already decided or implemented only if it affects the next choice.
3. Surface the few decisions that actually need the reader: give feasible options, a recommended option with reasons, and the consequence of choosing or deferring it. If evidence cannot support a recommendation, name the missing fact instead.
4. Order recommended next steps or authorized actions by dependency. Use roughly three top items when sufficient, but do not discard important work merely to fit a template.
5. Name what can wait and why. An unresolved choice is not deferred unless the user decided to defer it; keep open choices visible.

Use only the sections the material needs. Do not repeat the same point under recommendation, scope, summary, and next steps. For status reports, use a compact Done / Waiting on you / Blocked / Next structure if it fits. For research, prefer Decisions / Recommended next / Can wait, keeping proposals visibly proposed.

Make conditional plans usable on either branch. If a pilot or prerequisite is not approved, state what the initial scope still includes and excludes. If no fallback has been agreed, label your fallback as a recommendation, including in the opening; do not imply the dependency was already waived. Identify any proposed new work introduced by the recommendation and place it in the dependency sequence or explicitly outside the initial scope. Label suggested pilot sizes, thresholds, and schedules as proposed defaults with rationale, never as commitments or measured facts.

Write actions as concrete verbs with an observable outcome. Distinguish deciding, investigating, implementing, verifying, and shipping. Where the source supports it, include dependency, status, and completion criterion. Do not assign the assistant or user to work without authorization. Use checkboxes for real trackable work, not every finding, caveat, or idea. Acceptance tests must follow settled requirements; make tests conditional or leave a decision gate when they depend on an unresolved policy.

## 4. Preserve the evidence layer

Retain supporting research, alternatives, technical constraints, test plans, and linked sources after the opening. Use descriptive headings, bookmarks, or internal links where the format supports them. Preserve the original artifact as the source when making a trial or new version; replace an existing artifact only when that is the requested operation.

Do not remove dissenting evidence or uncertainty to make the summary cleaner. Include source dates/revisions and distinguish direct inspection, author reports, inference, and proposals. Keep citations beside the claims they support; avoid citation dumping. Make citations clickable when the format supports links. Do not carry a page-one assertion into the evidence layer with a different status or scope. If evidence is stale, either verify it within scope or label the snapshot. Do not silently upgrade it to current truth.

## 5. Edit for comprehension

Use familiar words, short sentences, active verbs, parallel lists, and meaningful headings. Explain a technical term only when the reader needs it. Keep one main idea per paragraph. Name the actor and action, and put a condition before the instruction it governs. Use consistent terms and real interface, command, and symbol names when relevant. Prefer specific consequences over abstract importance. Vary sentence length naturally; do not replace readable prose with clipped fragments or impose a mechanical word-count rule. Avoid jargon, invented labels, padded transitions, redundant throat-clearing, and decorative certainty.

Prefer single-column blocks and comfortably readable type. Use tables only when comparing the same attributes across alternatives; avoid wide tables on phones. Keep decision-changing caveats in the main reading flow at readable size, not in footnotes or dense table cells. Check detail pages as well as the opening on the intended screen; a new summary does not fix an unreadable appendix. Do not shrink text to hit an arbitrary page count. Use diagrams only if they explain a relationship better than prose, and label what is observed versus proposed.

## 6. Produce and verify through the existing artifact workflow

Use the available document, spreadsheet, page, or site skill for creation, editing, rendering, storage, and delivery. This skill supplies editorial structure, not a second file-generation pipeline. Follow that workflow's accessibility, privacy, sharing, and version-preservation requirements. Do not install fonts, renderers, or services merely to use this skill.

Before delivery, check:
- Can the reader quickly identify what matters, what is already true, and what needs their decision?
- Are proposals distinct from approvals and assigned work?
- Are dependencies and next actions coherent rather than a pile of equally urgent bullets?
- Does each summarized claim preserve its material qualification and source? Can planned work be mistaken for observed behavior?
- Are open decisions preserved across the summary, details, sequence, and tests? Does each conditional plan have a clear fallback scope?
- Can the reader locate the supporting detail without rereading the whole document?
- Does the file render cleanly at normal reading size, with usable links and no false interactive claims?

Deliver a short orientation and the verified artifact. Mention only material limits. Do not send another long report explaining how the report was improved.

When changing this skill, use [behavioral checks](references/behavioral-checks.md) to test its decisions rather than matching prose.

Consult [Technical-writing influences](references/technical-writing.md) for the source-backed principles used in this editorial workflow.

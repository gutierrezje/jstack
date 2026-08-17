---
name: recall
description: "Reconstruct your recent working context from your own chat history, live state, and the shared record (user reports, prior fixes, incidents), then hand back a tight current-state brief. Use for 'recall my work on X', 'catch me up', 'what have I been working on', 'where did I leave off', before starting or resuming work."
---

# Recall

Rebuild the smallest trustworthy current-state brief.

1. Define the topic and time window from the request and current task.
2. Read the current task and summary. Use Codex task-history tools only when available; never guess transcript filesystem paths.
3. Inspect live evidence for a named target: git status and history, commits, PRs, issues, repository docs, tests, and configured external sources.
4. Use `$why` for shared-record evidence when needed. Report unavailable sources as coverage gaps.
5. Reconcile prior statements against current artifacts.
6. Return current state, decisions, failed attempts, risks, next action, sources consulted, and confidence.

Completion means each material claim points to current-task context or a live artifact. Without task-history access, state that broader chat recall is unavailable.

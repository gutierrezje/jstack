---
name: recall
description: "Recover recent working context when asked to resume prior work or recall earlier tasks and decisions."
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

# Claude Code compatibility overlay

On Claude Code, apply the [Codex compatibility contract](codex-compatibility.md) with the substitutions below. Where they conflict, this overlay wins. Sections not mentioned here, including GitHub transport and external and destructive actions, apply unchanged.

## Skill references

- Read `$name` as the Jstack skill `name`. Invoke it with the `Skill` tool or as `/jstack:name`; otherwise read its `SKILL.md` through the relative link.
- Skills marked `disable-model-invocation: true` run only when the user invokes them or another skill links them explicitly.
- Replace `$skill-creator` and `$writing-for-agents` with the installed `skill-creator` skill when available. Otherwise follow the writing-for-agents rules in this repository's `AGENTS.md`.

## Delegation

- Replace Cursor `Task` and Codex internal subagents with the `Agent` tool. Map tiers through [Claude Code routes](routes.md#claude-code-routes) and pass the mapped `model` explicitly.
- Map Cursor `subagent_type` and Codex `agent_type` to a bounded prompt naming the relevant skill. Use `subagent_type: "general-purpose"`, or `"Explore"` for read-only search. Use a registered Claude agent type only when the current `Agent` tool lists it.
- Children run in the background by default and notify the parent on completion. Continue a child with `SendMessage`; do not poll.
- Give parallel writers disjoint files, or pass `isolation: "worktree"` when overlapping writers are justified.
- Use the `Workflow` tool only when the user explicitly opts into multi-agent orchestration.

## Claude Code tools

- Use `TodoWrite` directly where Cursor used it; Codex `update_plan` maps to the same tool.
- Replace `request_user_input` with `AskUserQuestion` for a material choice or authorization only.
- Replace recurring automation with `/loop`, `ScheduleWakeup`, or `CronCreate` only when the user requested monitoring or a recurring run.

## Review authorization

- A fresh `Agent` child with a different `model` from the code author is the native independent reviewer.
- `codex review` remains a valid cross-model second opinion when the CLI is installed. Running it sends source to the provider configured for Codex, so it needs the review authorization the Codex contract describes.
- Describe the actual path in reports: native Claude subagent or external CLI.

## State and history

- Claude Code has no portable task-history tool. Reconstruct from the current conversation and its summary, git and PR evidence, and explicit resume artifacts. Use session-history tools only when the current tool list exposes them.
- Do not scan `~/.claude/projects` transcripts or other session files.
- Skill paths for retrospectives are `.claude/skills/`, `~/.claude/skills/`, and plugin-installed skills under `~/.claude/plugins/`, in addition to the Codex paths.

## Authorization

- Follow the active Claude Code permission mode and the user's instructions. A denied tool call is a denial; adjust the approach instead of retrying the same call or switching tools to evade it.
- "Current Codex task" means the current Claude Code session.

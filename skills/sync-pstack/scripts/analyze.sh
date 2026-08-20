#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage: analyze.sh <jstack-repo> [--base <commit>] [--keep-upstream]
                  [--upstream-dir <new-path>]

Compare the Jstack NOTICE baseline with the current main branch of
https://github.com/cursor/plugins.git (pstack only). The Jstack repository is
never modified. Temporary upstream clones are removed unless retained.
USAGE
}

die() { printf 'analyze.sh: %s\n' "$*" >&2; exit 1; }

[[ $# -gt 0 ]] || { usage >&2; exit 2; }
if [[ "$1" == '-h' || "$1" == '--help' ]]; then
  usage
  exit 0
fi
jstack_input=$1
shift
base=''
keep=0
explicit_dir=''

while [[ $# -gt 0 ]]; do
  case $1 in
    --base)
      [[ $# -ge 2 ]] || die '--base requires a 40-hex commit'
      base=$2
      shift 2
      ;;
    --base=*) base=${1#*=}; shift ;;
    --keep-upstream) keep=1; shift ;;
    --upstream-dir)
      [[ $# -ge 2 ]] || die '--upstream-dir requires a new path'
      explicit_dir=$2
      shift 2
      ;;
    --upstream-dir=*) explicit_dir=${1#*=}; shift ;;
    -h|--help) usage; exit 0 ;;
    *) die "unknown argument: $1" ;;
  esac
done

[[ -n "$jstack_input" && -d "$jstack_input" ]] || die "invalid Jstack repository: $jstack_input"
repo_root=$(git -C "$jstack_input" rev-parse --show-toplevel 2>/dev/null) || die "not a git repository: $jstack_input"
repo_root=$(cd "$repo_root" && pwd -P)
notice="$repo_root/NOTICE.md"
[[ -f "$notice" ]] || die "missing NOTICE.md at $repo_root"

if [[ -z "$base" ]]; then
  base=$(sed -nE 's/^[[:space:]]*-[[:space:]]*Source commit:[[:space:]]*`([0-9A-Fa-f]{40})`.*/\1/p' "$notice" | head -n 1 || true)
  [[ -n "$base" ]] || die 'NOTICE.md has no 40-hex Source commit'
fi
[[ "$base" =~ ^[0-9A-Fa-f]{40}$ ]] || die "invalid base commit: $base"

cleanup_root=''
cleanup() {
  if [[ -n "$cleanup_root" ]]; then
    rm -rf -- "$cleanup_root"
  fi
}
trap cleanup EXIT

if [[ -n "$explicit_dir" ]]; then
  parent=${explicit_dir%/*}
  [[ "$parent" != "$explicit_dir" ]] || parent='.'
  [[ -d "$parent" ]] || die "parent directory does not exist: $parent"
  explicit_abs="$(cd "$parent" && pwd -P)/${explicit_dir##*/}"
  [[ ! -e "$explicit_abs" && ! -L "$explicit_abs" ]] || die "--upstream-dir already exists: $explicit_dir"
  case "$explicit_abs" in
    "$repo_root"|"$repo_root"/*) die '--upstream-dir must be outside the Jstack repository' ;;
  esac
  upstream_dir=$explicit_abs
else
  temp_root=$(mktemp -d "${TMPDIR:-/tmp}/jstack-pstack-sync.XXXXXX") || die 'could not create temporary directory'
  [[ "$keep" -eq 1 ]] || cleanup_root=$temp_root
  upstream_dir="$temp_root/upstream"
fi

upstream_url='https://github.com/cursor/plugins.git'
git clone --filter=blob:none --no-checkout --sparse --branch main --single-branch \
  "$upstream_url" "$upstream_dir" >&2 || die 'upstream clone failed'
git -C "$upstream_dir" fetch --quiet origin main || die 'upstream fetch failed'
git -C "$upstream_dir" sparse-checkout set pstack || die 'sparse checkout of pstack failed'
head=$(git -C "$upstream_dir" rev-parse 'refs/remotes/origin/main^{commit}') || die 'could not resolve upstream main'

if ! git -C "$upstream_dir" cat-file -e "$base^{commit}" 2>/dev/null; then
  git -C "$upstream_dir" fetch --quiet origin "$base" || die "base commit is unavailable upstream: $base"
fi
git -C "$upstream_dir" cat-file -e "$base^{commit}" 2>/dev/null || die "base is not a commit in upstream: $base"

changes=$(git -C "$upstream_dir" diff --name-status --find-renames "$base" "$head" -- pstack) || die 'upstream comparison failed'

map_local() {
  case "$1" in
    pstack/skills/tdd/*) printf 'skills/pstack-tdd/%s' "${1#pstack/skills/tdd/}" ;;
    pstack/skills/teach/*) printf 'skills/pstack-teach/%s' "${1#pstack/skills/teach/}" ;;
    pstack/skills/*) printf 'skills/%s' "${1#pstack/skills/}" ;;
    pstack/agents/comment-sicko.md) printf 'skills/comment-sicko/SKILL.md' ;;
    pstack/agents/poteto-agent.md) printf 'skills/poteto-agent/SKILL.md' ;;
    pstack/.cursor-plugin/plugin.json) printf '.codex-plugin/plugin.json' ;;
    *) printf '' ;;
  esac
}

printf 'BASELINE\n'
printf 'jstack_repo: %s\nbase: %s\nhead: %s\ncomparison: %s..%s (pstack/)\n' \
  "$repo_root" "$base" "$head" "$base" "$head"

printf 'UPSTREAM_CHANGES\n'
if [[ -z "$changes" ]]; then
  printf 'status: NONE\n'
else
  printf 'status: CHANGED\n'
  while IFS=$'\t' read -r status first second; do
    [[ -n "$status" ]] || continue
    if [[ "$status" == R* || "$status" == C* ]]; then
      printf '%s\t%s\t%s\n' "$status" "$first" "$second"
    else
      printf '%s\t%s\n' "$status" "$first"
    fi
  done <<< "$changes"
fi

printf 'SKILL_IMPACT\n'
printf 'mapping: pstack/skills/tdd/* -> skills/pstack-tdd/*\n'
printf 'mapping: pstack/skills/teach/* -> skills/pstack-teach/*\n'
if [[ -n "$changes" ]]; then
  while IFS=$'\t' read -r status first second; do
    [[ -n "$status" ]] || continue
    path=$first
    [[ "$status" != R* && "$status" != C* ]] || path=$second
    local_path=$(map_local "$path")
    if [[ -n "$local_path" ]]; then
      [[ -e "$repo_root/$local_path" ]] && state=present || state=missing
      printf '%s: %s -> %s (%s)\n' "$status" "$path" "$local_path" "$state"
    else
      printf '%s: %s -> (no mapped Jstack file)\n' "$status" "$path"
    fi
  done <<< "$changes"
else
  printf 'changed_local_files: NONE\n'
fi

printf 'ADAPTATION_SIGNALS\n'
signal_re='Cursor|Claude|\.cursor|CLAUDE\.md|subagent|sub-agent|subagent_type|AskQuestion|TodoWrite|Task( tool|\()|create-skill|/loop|Graphite|Bugbot|bootstrap\.ts|watch-pr|worktree-audit\.sh|orch|Bun|gpt-[0-9]|claude-[0-9]|sonnet|opus|haiku|grok|fable|model|cursor-team-kit|generalPurpose|environment: cloud|cloud_base_branch|spawn_agent|functions\.'
signals=0
if [[ -n "$changes" ]]; then
  while IFS=$'\t' read -r status first second; do
    [[ -n "$status" ]] || continue
    path=$first
    [[ "$status" != R* && "$status" != C* ]] || path=$second
    diff_text=$(git -C "$upstream_dir" diff --unified=0 --no-ext-diff --no-renames "$base" "$head" -- "$path") || die "could not inspect upstream diff: $path"
    added_lines=$(printf '%s\n' "$diff_text" | awk 'substr($0, 1, 1) == "+" && substr($0, 1, 4) != "+++ " && substr($0, 1, 4) != "+++\t" { print substr($0, 2) }')
    if matches=$(printf '%s\n' "$added_lines" | grep -EInI -- "$signal_re"); then
      signals=1
      local_path=$(map_local "$path")
      [[ -n "$local_path" ]] && target="$local_path" || target='(no mapped Jstack file)'
      printf '%s -> %s\n' "$path" "$target"
      sed 's/^/  /' <<< "$matches"
    fi
  done <<< "$changes"
fi
[[ "$signals" -eq 1 ]] || printf 'NONE\n'

printf 'UPSTREAM_DIR\npath: %s\nretained: %s\n' "$upstream_dir" \
  "$([[ "$keep" -eq 1 || -n "$explicit_dir" ]] && printf yes || printf no)"

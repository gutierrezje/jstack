# Simulator lifecycle

Use this contract when setup or shipping involves a mobile simulator. Follow
repository commands and existing authority; this contract grants no permission
to create, rename, shut down, or delete a resource.

## Select and record

Prefer iOS unless the bug is confirmed on Android; record the Android
reproduction evidence when selecting that exception. If iOS is unavailable,
report the blocker rather than silently substituting Android.

Inventory before creating a simulator. Leave pre-existing, shared, and
unknown-owner simulators untouched. A matching name alone does not establish
ownership. For an authorized disposable simulator, use the actual branch name
as its name; add a suffix only to resolve a collision. Record both the actual
branch and the final name.

Reuse the project's verifier run manifest or receipt for lifecycle state. When
none exists, save a minimal task handoff that persists across resume and is
accessible to the shipping session;
do not create a separate ship receipt. Record the repository, checkout, branch,
creator task or run, authoritative simulator UDID, name, platform, creation
observation, owned or borrowed status, applicable cleanup authority, and evidence
locations. A borrowed simulator is never a deletion target. Carry this state into
setup handoff, delegation, and resumed shipping; conversation history alone is
insufficient when ownership cannot be reconstructed.

## Release owned resources

When the thread finishes its selected shipping phases, include branch-owned
disposable simulators in cleanup when already authorized. Read the lifecycle
state and inspect each UDID again. Confirm creation ownership and that no other
task still needs it. Missing ownership or deletion authority is a retention
blocker; retain the simulator and report the reason.

Before removing the worktree, save required evidence outside every removal
target, finish dependent checks, and release owned processes and simulator
resources. Shut down and delete only the recorded, authorized, unused disposable
simulator through the platform's supported tools or project adapter. Never use
name matching, bulk deletion, or shutdown of shared simulators as cleanup.
Read the simulator inventory back and verify the UDID is absent; update the
existing lifecycle state with removal or retention and its evidence.

Account for every scoped simulator as verified removed or retained with a reason.
Full cleanup requires verified removal of every eligible owned simulator. An
explicit retained blocker means cleanup remains partial; do not describe it as
fully cleaned up.

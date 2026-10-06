import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

function validate(t, metadata, frontmatter = "", body = "Use the skill.") {
  const root = mkdtempSync(join(tmpdir(), "jstack-validator-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const directory of ["scripts", ".codex-plugin", ".claude-plugin", "skills/example/agents"]) {
    mkdirSync(join(root, directory), { recursive: true });
  }
  copyFileSync(join(import.meta.dirname, "validate.mjs"), join(root, "scripts/validate.mjs"));
  for (const directory of [".codex-plugin", ".claude-plugin"]) {
    writeFileSync(join(root, directory, "plugin.json"), JSON.stringify({ name: "fixture" }));
  }
  writeFileSync(join(root, "skills/example/agents/openai.yaml"), metadata);
  writeFileSync(join(root, "skills/example/SKILL.md"),
    `---\nname: example\ndescription: A fixture skill.\n${frontmatter}---\n${body}\n`);
  const result = spawnSync(process.execPath, [join(root, "scripts/validate.mjs")], { encoding: "utf8" });
  assert.ifError(result.error);
  return result;
}

for (const allow of [undefined, true, false]) {
  for (const disable of [undefined, true, false]) {
    test(`invocation parity: allow=${allow}, disable=${disable}`, (t) => {
      const metadata = allow === undefined ? "interface:\n  display_name: Example\n"
        : `policy:\n  allow_implicit_invocation: ${allow}\n`;
      const frontmatter = disable === undefined ? "" : `disable-model-invocation: ${disable}\n`;
      const result = validate(t, metadata, frontmatter);
      const matches = (allow ?? true) === !(disable ?? false);
      assert.equal(result.status, matches ? 0 : 1, result.stderr);
      if (!matches) {
        assert.match(result.stderr, /example.*invocation policy/);
        assert.match(result.stderr, /allow_implicit_invocation/);
        assert.match(result.stderr, /disable-model-invocation/);
      }
    });
  }
}

test("body examples cannot supply a missing frontmatter flag", (t) => {
  const result = validate(t, "policy:\n  allow_implicit_invocation: false\n", "",
    "Example:\n```yaml\ndisable-model-invocation: true\n```");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /invocation policy/);
});

test("flags outside the policy mapping do not override Codex defaults", (t) => {
  const result = validate(t, "interface:\n  allow_implicit_invocation: false\n");
  assert.equal(result.status, 0, result.stderr);
});

test("comments and an unrelated following mapping preserve parity", (t) => {
  const result = validate(t,
    "policy: # explicit use\n\n  allow_implicit_invocation: false # manual\ninterface:\n  display_name: Example\n",
    "disable-model-invocation: true # manual\n");
  assert.equal(result.status, 0, result.stderr);
});

test("metadata without a final newline preserves parity", (t) => {
  const result = validate(t, "policy:\n  allow_implicit_invocation: false",
    "disable-model-invocation: true\n");
  assert.equal(result.status, 0, result.stderr);
});

for (const frontmatter of ["", "disable-model-invocation: true\n"]) {
  test(`flow policy requires an explicit format correction (${frontmatter || "default"})`, (t) => {
    const result = validate(t, "policy: { allow_implicit_invocation: false }\n", frontmatter);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /example.*policy.*block/);
  });
}

test("nested fields cannot supply a missing direct policy flag", (t) => {
  const result = validate(t, "policy:\n  unrelated:\n    allow_implicit_invocation: false\n",
    "disable-model-invocation: true\n");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /invocation policy/);
});

test("the policy field uses the mapping's indentation, ignoring comments", (t) => {
  const result = validate(t, "policy:\n  # Direct children are indented four spaces.\n    allow_implicit_invocation: false\n",
    "disable-model-invocation: true\n");
  assert.equal(result.status, 0, result.stderr);
});

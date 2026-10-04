#!/usr/bin/env node

import { existsSync, lstatSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const skillsRoot = join(root, "skills");
const failures = [];
const userPathPattern = new RegExp("/Users/" + "[^/\\s]+/");

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

const codexManifest = JSON.parse(readFileSync(join(root, ".codex-plugin", "plugin.json"), "utf8"));
const claudeManifestFile = join(root, ".claude-plugin", "plugin.json");
if (!existsSync(claudeManifestFile)) {
  failures.push(".claude-plugin/plugin.json is missing");
} else if (JSON.parse(readFileSync(claudeManifestFile, "utf8")).name !== codexManifest.name) {
  failures.push(".claude-plugin/plugin.json name must match .codex-plugin/plugin.json");
}

// Codex reads `allow_implicit_invocation` from agents/openai.yaml; Claude Code reads
// `disable-model-invocation` from SKILL.md frontmatter. Return a failure message when
// the two runtimes disagree about whether the model may invoke this skill, else null.
function checkInvocationParity(skillName, codexMetadata, skillSource) {
  // TODO: compare the two flags and decide which mismatches fail validation.
  return null;
}

const skillDirectories = readdirSync(skillsRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => join(skillsRoot, entry.name));

for (const directory of skillDirectories) {
  const expectedName = directory.split("/").at(-1);
  const skillFile = join(directory, "SKILL.md");
  const metadataFile = join(directory, "agents", "openai.yaml");

  if (!existsSync(skillFile)) {
    failures.push(`${relative(root, directory)} is missing SKILL.md`);
    continue;
  }
  if (!existsSync(metadataFile)) {
    failures.push(`${relative(root, directory)} is missing agents/openai.yaml`);
  }

  const source = readFileSync(skillFile, "utf8");
  const match = source.match(/^---\n[\s\S]*?^name:\s*([^\n]+)$/m);
  if (!match || match[1].trim() !== expectedName) {
    failures.push(`${relative(root, skillFile)} name must be ${expectedName}`);
  }

  if (existsSync(metadataFile)) {
    const parity = checkInvocationParity(expectedName, readFileSync(metadataFile, "utf8"), source);
    if (parity) failures.push(parity);
  }
}

const textFiles = walk(root).filter((path) => /\.(md|json|ya?ml|mjs)$/.test(path));
for (const file of textFiles) {
  const source = readFileSync(file, "utf8");
  if (userPathPattern.test(source)) {
    failures.push(`${relative(root, file)} contains a user-specific absolute path`);
  }

  for (const match of source.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    const target = match[1].split("#")[0];
    if (!target || target === "url" || /^(https?:|mailto:|#)/.test(target)) continue;
    const resolved = resolve(dirname(file), decodeURI(target));
    if (!existsSync(resolved) || lstatSync(resolved).isDirectory()) {
      failures.push(`${relative(root, file)} has an unresolved file link: ${match[1]}`);
    }
  }
}

if (failures.length > 0) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log(`Validated ${skillDirectories.length} skills and ${textFiles.length} text files.`);

import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import toolchain from "./toolchain.json" with { type: "json" };

export { toolchain };
export const sha256 = (file: string): string => createHash("sha256").update(fs.readFileSync(file)).digest("hex");

export function findTlc() {
  const file = process.env.TLA2TOOLS;
  if (!file) throw new Error("Set TLA2TOOLS to the pinned tla2tools.jar. Run the explicit setup-tlc.ts command in references/setup.md; nothing is installed automatically.");
  const jar = fs.realpathSync(file);
  if (sha256(jar) !== toolchain.tlc.sha256)
    throw new Error(`TLA2TOOLS checksum mismatch. Expected ${toolchain.tlc.sha256}; use the official ${toolchain.tlc.release} asset in toolchain.json.`);
  return { jar, java: process.env.JAVA || "java" };
}

export function doctor() {
  const tools = findTlc();
  const check = spawnSync(tools.java, ["-version"], { encoding: "utf8", timeout: 5000, maxBuffer: 65536 });
  const version = `${check.stdout ?? ""}${check.stderr ?? ""}`.trim();
  const match = version.match(/version "(?:1\.)?(\d+)/);
  if (check.status !== 0 || !match || Number(match[1]) < toolchain.java.minimumMajor)
    throw new Error(`Java ${toolchain.java.minimumMajor}+ is required. Set JAVA to an installed Java executable. ${check.error?.message ?? version}`);
  return { ...tools, javaVersion: version, tlc: toolchain.tlc };
}

export function inputs(spec: string, config: string, view: string | undefined) {
  const folder = path.dirname(path.resolve(spec));
  const files = new Set([path.resolve(spec), path.resolve(config), ...(view ? [path.resolve(view)] : [])]);
  for (const entry of fs.readdirSync(folder)) if (entry.endsWith(".tla")) files.add(path.join(folder, entry));
  return [...files].sort().map((file) => ({ path: file, sha256: sha256(file) }));
}

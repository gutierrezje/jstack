// Explicit, local installation only; the checker never calls this script.
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import { toolchain } from "./tooling.ts";

try {
  const { values } = parseArgs({ options: { dir: { type: "string" }, download: { type: "boolean" } } });
  if (!values.download || !values.dir) throw new Error("Usage: node setup-tlc.ts --download --dir NEW_DIRECTORY. Downloads only the pinned official TLC jar; install Java separately.");
  const directory = path.resolve(values.dir);
  if (fs.existsSync(directory)) throw new Error("Choose a new directory; setup never replaces an existing installation.");
  const response = await fetch(toolchain.tlc.url, { signal: AbortSignal.timeout(60_000) });
  if (!response.ok) throw new Error(`Download failed: HTTP ${response.status}`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  const digest = createHash("sha256").update(bytes).digest("hex");
  if (digest !== toolchain.tlc.sha256) throw new Error("Download checksum mismatch; nothing was installed.");
  fs.mkdirSync(directory);
  const jar = path.join(directory, "tla2tools.jar");
  fs.writeFileSync(jar, bytes, { flag: "wx" });
  console.log(JSON.stringify({ jar, sha256: digest, release: toolchain.tlc.release }));
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 2;
}

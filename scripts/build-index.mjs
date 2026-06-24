#!/usr/bin/env node
// Derive each pack's `rarity` in index.json from its persona.yaml — the single
// source of truth. Rarity is COMPUTED by openagent's computeTier(), never hand
// typed, so the catalog and the spec's deterministic ladder can never drift.
//
//   node scripts/build-index.mjs          # rewrite index.json in place
//   node scripts/build-index.mjs --check  # exit 1 if index.json is stale (CI)
//
// openagent (computeTier + validateDoc + the persona schema) is resolved from
// the @5dive/openagent dependency, or from $OPENAGENT_DIR for a local checkout.
//
// Note on Mythical: the file-derived tier tops out at Legendary. Mythical is
// CONFERRED at runtime by the CLI's signature-verified registry layer (it is
// not farmable from the file), so it is deliberately not stored here.

import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const require = createRequire(import.meta.url);

function resolveOpenagent() {
  if (process.env.OPENAGENT_DIR) return process.env.OPENAGENT_DIR;
  // package.json: dirname of the resolved entry's lib/ — walk up from validate.js.
  const validatePath = require.resolve("@5dive/openagent/lib/validate.js");
  return join(dirname(validatePath), "..");
}

const OA = resolveOpenagent();
const { computeTier } = require(join(OA, "lib", "tier.js"));
const { validateDoc } = require(join(OA, "lib", "validate.js"));
const YAML = require(join(OA, "node_modules", "yaml"));

const PACKS_DIR = join(ROOT, "packs");
const INDEX_PATH = join(ROOT, "index.json");

function rarityFor(slug) {
  const dir = join(PACKS_DIR, slug);
  const personaPath = join(dir, "persona.yaml");
  if (!existsSync(personaPath)) {
    throw new Error(`pack '${slug}' has no persona.yaml — every pack needs the canonical identity file`);
  }
  const doc = YAML.parse(readFileSync(personaPath, "utf8"));
  const verdict = validateDoc(doc);
  if (!verdict.ok) {
    throw new Error(`pack '${slug}' persona.yaml is not schema-valid:\n  - ${verdict.errors.join("\n  - ")}`);
  }
  // faceResolved: face.ref actually points at a shipped image in the pack.
  const ref = (doc.face && doc.face.ref) || "";
  const faceResolved = ref.startsWith("./") && existsSync(join(dir, ref.slice(2)));
  // inRegistry:false — Mythical is conferred at runtime, not stored (see header).
  const t = computeTier(doc, { faceResolved, schemaValid: true, inRegistry: false });
  return { rarity: t.tier.toLowerCase(), completeness: t.completeness, level: t.level };
}

const index = JSON.parse(readFileSync(INDEX_PATH, "utf8"));
const rows = [];
let changed = false;
for (const pack of index.packs) {
  const { rarity, completeness, level } = rarityFor(pack.slug);
  rows.push({ slug: pack.slug, was: pack.rarity, now: rarity, completeness, level });
  if (pack.rarity !== rarity) changed = true;
  pack.rarity = rarity;
}
// Reflect the last build date so the catalog timestamp tracks regeneration.
const everyDir = readdirSync(PACKS_DIR, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
const missing = everyDir.filter((d) => !index.packs.some((p) => p.slug === d));
if (missing.length) console.warn(`warning: packs without an index entry: ${missing.join(", ")}`);

const table = rows
  .map((r) => `  ${r.slug.padEnd(8)} ${String(r.was).padEnd(10)} -> ${r.now.padEnd(10)} (L${r.level}, ${r.completeness}% complete)`)
  .join("\n");

if (process.argv.includes("--check")) {
  if (changed) {
    console.error("index.json rarity is STALE — run `node scripts/build-index.mjs`:\n" + table);
    process.exit(1);
  }
  console.log("index.json rarity is up to date with computed tiers.");
  process.exit(0);
}

const serialized = JSON.stringify(index, null, 2) + "\n";
writeFileSync(INDEX_PATH, serialized);
console.log("computed rarity from persona.yaml (was -> now):\n" + table);

#!/usr/bin/env node
// Refuse a pack whose curated HERO skill did not actually make it into the pack.
//
// Stage 4 assembly used to fail silently here: when a curated hero had no
// bundlable source dir on the build host it was simply left out, the manifest
// was written without it, and the pack shipped carrying something else. The
// index, the card, the QR and the PR all stayed green because the manifest is
// the only source of truth for `skills` (see build-index.mjs) and the manifest
// was rewritten to match the substitution. Two packs shipped that way: rex lost
// `verify` (PR #10), ace lost `cold-email` (PR #12).
//
// So there are two checks, one per side of that gap:
//
//   node scripts/check-skills.mjs                  # AUDIT every shipped pack
//   node scripts/check-skills.mjs --hero <slug> <skill>   # PREFLIGHT before assembly
//
// AUDIT is the in-repo fence: every skill a manifest claims must exist as a
// bundled dir. A missing HERO (skills[0]) is a hard failure; a missing secondary
// is a warning, per DIVE-2409.
//
// PREFLIGHT is the one that catches the real defect, because it runs BEFORE the
// manifest is written — while the curated hero is still known. It resolves the
// hero to a durable, bundlable source dir and refuses by name if there is none.
//
// No dependencies: this must run in a checkout with no node_modules.

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PACKS_DIR = process.env.PACKS_DIR || join(ROOT, "packs");
const INDEX_PATH = process.env.INDEX_PATH || join(ROOT, "index.json");

// Durable source roots for a bundlable skill, in the order stage 4 should try
// them. Creative pre-stages authored heroes in the first two. Override for
// tests or a different build host with HERO_SOURCE_ROOTS (colon-separated).
const DEFAULT_SOURCE_ROOTS = [
  "/home/claude/projects/5dive/marketing/creative/openagent-card/skills",
  "/home/claude/projects/5dive/openagent-card/skills",
  "/home/claude/projects/5dive/5dive-skills",
  "/home/claude/projects/5dive/.claude/skills",
  // Both the build user's own tree and claude's: stage 4 runs its git as
  // `sudo -u claude` but the node steps as the agent, so a homedir()-only list
  // would resolve differently depending on which half you were standing in.
  "/home/claude/.claude/skills",
  "/home/claude/.hermes/skills",
  join(homedir(), ".claude", "skills"),
  join(homedir(), ".hermes", "skills"),
  "/usr/local/lib/5dive/skills",
];

// A SKILL.md under any of these is NOT a source. `/tmp` and `.tmp` plugin caches
// are ephemeral and will be gone by pack time; a copy under character-packs/packs/
// is circular — it is only there because some pack already shipped it, which is
// precisely the substitution we are trying to detect (the "poisoned find",
// DIVE-2293: `code-review` returns 4 hits, exactly 1 of them a real source).
// The vendored case is matched by resolved path against our own packs/ rather
// than by name, because a worktree is not called "character-packs" — the string
// pattern only covers foreign checkouts.
const EXCLUDED = [/(^|\/)tmp\//, /(^|\/)\.tmp(\/|$)/, /\/character-packs\/packs\//];

function sourceRoots() {
  const env = process.env.HERO_SOURCE_ROOTS;
  return env ? env.split(":").filter(Boolean) : DEFAULT_SOURCE_ROOTS;
}

function isExcluded(path) {
  const abs = resolve(path);
  if (abs === resolve(PACKS_DIR) || abs.startsWith(resolve(PACKS_DIR) + "/")) return true;
  return EXCLUDED.some((re) => re.test(abs));
}

function isSkillDir(path) {
  return existsSync(join(path, "SKILL.md")) && statSync(path).isDirectory();
}

// Resolve a skill name to a bundlable source dir, or null. Only the durable
// roots are searched — deliberately not a host-wide find, which reports OK off
// caches and vendored copies that will not exist at assembly time.
function resolveSource(skill) {
  for (const root of sourceRoots()) {
    const candidate = join(root, skill);
    if (isExcluded(candidate)) continue;
    if (existsSync(candidate) && isSkillDir(candidate)) return candidate;
  }
  return null;
}

function bundledSkills(slug) {
  const dir = join(PACKS_DIR, slug, "skills");
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(dir, d.name, "SKILL.md")))
    .map((d) => d.name);
}

function manifestSkills(slug) {
  const path = join(PACKS_DIR, slug, "manifest.json");
  if (!existsSync(path)) return null;
  const m = JSON.parse(readFileSync(path, "utf8"));
  return Array.isArray(m.skills) ? m.skills.filter((s) => typeof s === "string") : [];
}

// ------------------------------------------------------- role-centrality

// Skills every pack carries. A generic in skills[0] leaves a pack with no
// distinguishing capability at all — strictly worse than a duplicate hero,
// which at least names a role. lilbro led with compile-knowledge until 30ed0a9.
const GENERICS = ["compile-knowledge", "notify-user", "find-skills"];

function shippedPacks() {
  if (!existsSync(INDEX_PATH)) return [];
  const idx = JSON.parse(readFileSync(INDEX_PATH, "utf8"));
  return (idx.packs || []).map((p) => ({ slug: p.slug, skills: p.skills || [] }));
}

// WARN, never fail. Uniqueness is deliberately NOT the bar: a hard failure here
// would retroactively have blocked ada and doc, both of which shipped fine. The
// question a repeated hero raises is role centrality — does this slug's role
// collapse into an existing pack? — and that needs a human read, so the only
// correct output is a flag. Leading with another pack's hero makes a re-skin;
// CARRYING it as a secondary is normal and stays silent (vesper carries
// code-review and leads playwright-e2e — that must not warn).
function roleWarnings(slug, skill) {
  const out = [];
  if (GENERICS.includes(skill)) {
    out.push(
      `generic hero — '${skill}' is a generic that every pack carries, so leading with it\n` +
        `  leaves '${slug}' with no distinguishing capability. Strictly worse than a collision:\n` +
        `  a duplicate hero at least names a role. Pick or author a role-specific hero.`
    );
  }
  const packs = shippedPacks().filter((p) => p.slug !== slug);
  // led-by and carried-by are reported as SEPARATE columns on purpose. Collapsing
  // them inflates every number and turns the warning into noise.
  const ledBy = packs.filter((p) => p.skills[0] === skill).map((p) => p.slug);
  const carriedBy = packs.filter((p) => p.skills[0] !== skill && p.skills.includes(skill)).map((p) => p.slug);
  if (ledBy.length) {
    out.push(
      `hero collision — '${skill}' already LEADS: ${ledBy.join(", ")}\n` +
        (carriedBy.length ? `  (separately, carried as a SECONDARY by: ${carriedBy.join(", ")})\n` : "") +
        `  Not a blocker. The question is role centrality, not the count: does '${slug}'s role\n` +
        `  collapse into one of the packs above? If it does, this is a re-skin — pick or author\n` +
        `  a hero that names what only '${slug}' does.`
    );
  }
  return out;
}

// ---------------------------------------------------------------- preflight

function preflight(slug, skill) {
  const src = resolveSource(skill);
  if (!src) {
    console.error(
      `REFUSED: pack '${slug}' curated hero skill '${skill}' has no bundlable source dir.\n` +
        `  Searched (durable roots only):\n` +
        sourceRoots().map((r) => `    ${join(r, skill)}`).join("\n") +
        `\n  Do NOT substitute another skill and do NOT drop it — a hero is the whole\n` +
        `  point of stage 2's no-generic-skills invariant. Author or stage the skill\n` +
        `  first (creative pre-stages under openagent-card/skills/), then re-run.`
    );
    process.exit(1);
  }
  for (const w of roleWarnings(slug, skill)) console.warn(`warning: ${w}`);
  console.log(`ok: hero '${skill}' for pack '${slug}' resolves to ${src}`);
  process.exit(0);
}

// -------------------------------------------------------------------- audit

function audit() {
  const slugs = existsSync(INDEX_PATH)
    ? JSON.parse(readFileSync(INDEX_PATH, "utf8")).packs.map((p) => p.slug)
    : readdirSync(PACKS_DIR, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);

  const heroFailures = [];
  const warnings = [];

  for (const slug of slugs) {
    const claimed = manifestSkills(slug);
    if (claimed === null) {
      heroFailures.push(`${slug}: no manifest.json`);
      continue;
    }
    // Generic-in-skills[0] is checked here as a standing regression fence; it is
    // silent on the current cast (lilbro was the last instance, fixed in 30ed0a9).
    // The COLLISION check is deliberately NOT run in audit: code-review,
    // deep-research and diagnose are each the hero of two shipped packs, so it
    // would fire on six packs every CI run and be tuned out inside a week. That
    // question belongs at preflight, once, while the choice is still open.
    if (GENERICS.includes(claimed[0])) {
      warnings.push(`${slug}: leads with the generic '${claimed[0]}' — no distinguishing capability`);
    }
    const bundled = new Set(bundledSkills(slug));
    claimed.forEach((skill, i) => {
      if (bundled.has(skill)) return;
      if (i === 0) heroFailures.push(`${slug}: HERO skill '${skill}' is claimed by manifest.json but packs/${slug}/skills/${skill}/ is not bundled`);
      else warnings.push(`${slug}: secondary skill '${skill}' is claimed but not bundled`);
    });
    for (const dir of bundled) {
      if (!claimed.includes(dir)) warnings.push(`${slug}: bundles skills/${dir}/ but manifest.json does not claim it`);
    }
  }

  for (const w of warnings) console.warn(`warning: ${w}`);

  if (heroFailures.length) {
    console.error("hero skills claimed but NOT bundled — this is a silent substitution (DIVE-2409):");
    for (const f of heroFailures) console.error(`  ${f}`);
    process.exit(1);
  }
  console.log(`ok: ${slugs.length} packs, every manifest hero skill is bundled.`);
  process.exit(0);
}

// --------------------------------------------------------------------- main

const argv = process.argv.slice(2);
if (argv[0] === "--hero") {
  const [, slug, skill] = argv;
  if (!slug || !skill) {
    console.error("usage: check-skills.mjs --hero <slug> <skill>");
    process.exit(2);
  }
  preflight(slug, skill);
} else if (argv.length === 0) {
  audit();
} else {
  console.error("usage: check-skills.mjs [--hero <slug> <skill>]");
  process.exit(2);
}

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
// index.json is a LOG of what shipped, not the roster of what's spoken for —
// see community/wiki/a-collision-check-that-reads-shipped-output-cannot-see-the-buffer.md.
// promote-queue.txt is where the held-but-approved buffer actually lives.
const PROMOTE_QUEUE_PATH =
  process.env.PROMOTE_QUEUE_PATH ||
  "/home/claude/projects/5dive/marketing/creative/openagent-card/promote-queue.txt";

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

// The HELD buffer, read the same way a human does: promote-queue.txt has no
// schema for skills (DIVE-2870), just a `<slug> hero=<skill>` line shape the
// team already writes by hand in every HELD block. Only the hero is recorded
// there, never secondaries, so this can only widen the LEAD side of the check.
function heldPacks() {
  if (!existsSync(PROMOTE_QUEUE_PATH)) return [];
  const text = readFileSync(PROMOTE_QUEUE_PATH, "utf8");
  const re = /^#\s*([a-zA-Z][a-zA-Z0-9]*)\s+hero=([a-zA-Z][a-zA-Z0-9-]*)/;
  const out = [];
  for (const line of text.split("\n")) {
    const m = re.exec(line);
    if (m) out.push({ slug: m[1], skill: m[2] });
  }
  return out;
}

function nameTokens(name) {
  return name.split("-").filter(Boolean);
}

// Two hero names one token apart can be a real collision hiding behind a
// rename, or two genuinely distinct roles (maw/inbox-triage vs desk/ticket-
// triage; crumb/charge-audit vs vault/burn-audit — both pairs shipped as
// legitimately distinct, see community/wiki/hero-skill-sourcing.md). Exact
// matches are the collision check's job, not this one. This can only ever be
// a flag for a human read, same as the collision warn.
function nearNameWarnings(slug, skill, shipped, held) {
  const candidate = new Set(nameTokens(skill));
  const pool = [
    ...shipped.map((p) => ({ name: p.skills[0], slug: p.slug, kind: "shipped" })),
    ...held.map((p) => ({ name: p.skill, slug: p.slug, kind: "held" })),
  ];
  const byName = new Map();
  for (const entry of pool) {
    if (!entry.name || entry.name === skill) continue;
    if (!nameTokens(entry.name).some((t) => candidate.has(t))) continue;
    if (!byName.has(entry.name)) byName.set(entry.name, { kind: entry.kind, slugs: [] });
    const bucket = byName.get(entry.name);
    if (!bucket.slugs.includes(entry.slug)) bucket.slugs.push(entry.slug);
  }
  if (byName.size === 0) return [];
  const rendered = [...byName.entries()]
    .map(([name, { kind, slugs }]) => `'${name}' (${kind}, ${slugs.join(", ")})`)
    .join(", ");
  return [
    `near-name — '${skill}' shares a word with: ${rendered}\n` +
      `  Not a blocker and not the same question as an exact collision — two hero names\n` +
      `  one word apart can be genuinely distinct roles. Read both before shipping and\n` +
      `  record the distinction beside the entry in promote-queue.txt if it holds; the\n` +
      `  preflight can see that they rhyme, never why that's fine.`,
  ];
}

function hasFileRecursive(dir) {
  if (!existsSync(dir) || !statSync(dir).isDirectory()) return false;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isFile()) return true;
    if (entry.isDirectory() && hasFileRecursive(full)) return true;
  }
  return false;
}

// Arm B is a single regex pass plus a fence scan below the match offset — no
// SKILL.md parsing beyond that. Line count is deliberately NOT a criterion: it
// is the one thing a 60-second author can satisfy by padding.
function armBPasses(skillText) {
  const heading = skillText.match(/^##[ \t]+Worked example\b/im);
  if (!heading) return false;
  const rest = skillText.slice(heading.index + heading[0].length);
  return /```/.test(rest);
}

// DIVE-2859: a curated hero must clear Arm A (a references/ dir with >=1 file)
// or Arm B (a '## Worked example' heading with a fenced block below it) — an
// OR, never an AND. Arm A is a lookup table the skill consults; Arm B is an
// end-to-end trace of the judgement the skill makes. A role has one, the
// other, or both; neither is a fallback for the other (see
// community/wiki/hero-skill-sourcing.md, DIVE-2859 arm-reporting addendum).
function armState(src) {
  const armA = hasFileRecursive(join(src, "references"));
  const skillPath = join(src, "SKILL.md");
  const armB = existsSync(skillPath) && armBPasses(readFileSync(skillPath, "utf8"));
  return armA || armB ? "pass" : "thin";
}

// DEPTH BAR GRANDFATHER LIST — DIVE-2859, 2026-08-06. Starting count: 15 of 15
// heroes then in openagent-card/skills/. This is a DEBT LIST, NOT A CARVE-OUT.
// A slug comes OFF the moment it gains a references/ dir or a Worked example
// section. It must only ever shrink.
const DEPTH_BAR_GRANDFATHERED = [
  "burn-audit", "community-triage", "contract-review", "conversion-audit",
  "creative-ideation", "delivery-status", "incident-response", "merge-gate",
  "no-ai-slop", "pitch-teardown", "runbook", "self-host", "simplify-code",
  "standup", "tldr",
];

// VENDORED is a third state, not a longer grandfather list: a byte-identical
// copy of someone else's skill has exactly one compliant move under an
// authoring bar (edit it), which silently forks it — so it is exempt by KIND,
// verified rather than asserted. Declared by a PROVENANCE.md staged next to
// SKILL.md, in the same "**Upstream path (this host):** `<path>`" shape every
// PROVENANCE.md already uses. Two conditions, both of which make the
// declaration checkable instead of asserted:
//   1. the staged SKILL.md must be BYTE-IDENTICAL to the declared upstream —
//      the moment someone edits it, it stops matching, it is a fork, and the
//      depth arms apply like anything else.
//   2. a LICENSE file must be staged alongside it — a pack is a DISTRIBUTION,
//      and MIT (etc.) requires the notice travel with the copy.
// Returns null (not vendored — no PROVENANCE.md at all), or {ok, reason}.
function vendoredStatus(src) {
  const provenancePath = join(src, "PROVENANCE.md");
  if (!existsSync(provenancePath)) return null;
  const text = readFileSync(provenancePath, "utf8");
  const m = text.match(/Upstream path[^:]*:\*\*\s*`([^`]+)`/i);
  if (!m) {
    return { ok: false, reason: "PROVENANCE.md has no parseable '**Upstream path (this host):** `<path>`' line" };
  }
  const upstreamSkill = join(m[1].trim(), "SKILL.md");
  const localSkill = join(src, "SKILL.md");
  if (!existsSync(upstreamSkill)) {
    return { ok: false, reason: `declared upstream not found on this host: ${upstreamSkill}` };
  }
  const identical = existsSync(localSkill) && readFileSync(upstreamSkill).equals(readFileSync(localSkill));
  if (!identical) {
    return { ok: false, reason: `staged SKILL.md is no longer byte-identical to ${upstreamSkill} — this is a fork now, the depth arms apply` };
  }
  if (!existsSync(join(src, "LICENSE"))) {
    return { ok: false, reason: "vendored but no LICENSE file staged alongside it (the notice must travel with the distribution)" };
  }
  return { ok: true };
}

// Depth on its own MERITS — arms plus the verified vendored exemption, with NO
// grandfather short-circuit. Kept separate from depthStatus() below so the
// remaining-count and the grandfather check aren't circular: if grandfathering
// exempted 'thin' before this ran, a grandfathered slug could never be counted
// as still owing its debt, which is exactly the number the bar exists to make
// visible.
function depthMerit(src) {
  if (armState(src) === "pass") return { state: "pass" };
  const vendored = vendoredStatus(src);
  if (vendored) return vendored.ok ? { state: "vendored" } : { state: "thin", detail: vendored.reason };
  return { state: "thin" };
}

// Print the remaining grandfathered count on every preflight run — a debt
// nobody sees is a debt nobody pays. Unresolvable names don't count either
// way; this reports on what can actually be verified. A grandfathered slug
// that has since been verified VENDORED is exempt, not still-owed debt —
// counting it here anyway would inflate the number forever for something that
// can never gain a real arm by design (editing a vendored copy forks it).
function grandfatherRemaining() {
  let remaining = 0;
  for (const name of DEPTH_BAR_GRANDFATHERED) {
    const src = resolveSource(name);
    if (src && depthMerit(src).state === "thin") remaining++;
  }
  return remaining;
}

// Combines the arms, the vendored exemption and the grandfather list into one
// verdict. 'thin' is the only state the caller must REFUSE on.
function depthStatus(skill, src) {
  const merit = depthMerit(src);
  if (merit.state !== "thin") return merit;
  if (DEPTH_BAR_GRANDFATHERED.includes(skill)) return { state: "grandfathered" };
  return merit;
}

// SKILL_DEPTH_BAR_OVERRIDE — env var, not a flag, so it cannot be reached by
// habit (same pattern as ALLOW_DEAD_SEAT_GEN in new-character.sh). Must carry
// a REASON STRING: empty/whitespace and the bare habit-reach value '1' are
// both refused, and the reason is echoed into the run output so the override
// leaves a why behind.
function depthOverrideReason() {
  const raw = process.env.SKILL_DEPTH_BAR_OVERRIDE;
  if (raw == null) return null;
  const reason = raw.trim();
  return reason && reason !== "1" ? reason : null;
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
  const shipped = shippedPacks().filter((p) => p.slug !== slug);
  const held = heldPacks().filter((p) => p.slug !== slug);
  // led-by and carried-by are reported as SEPARATE columns on purpose. Collapsing
  // them inflates every number and turns the warning into noise. held-as-hero is
  // a third column for the same reason: a HELD assignment can still change
  // before it ships, so it must not read as an equally-settled LEAD.
  const ledBy = shipped.filter((p) => p.skills[0] === skill).map((p) => p.slug);
  const carriedBy = shipped.filter((p) => p.skills[0] !== skill && p.skills.includes(skill)).map((p) => p.slug);
  const heldAsHero = held.filter((p) => p.skill === skill).map((p) => p.slug);
  if (ledBy.length || heldAsHero.length) {
    const lead = ledBy.length
      ? `already LEADS: ${ledBy.join(", ")}`
      : `is HELD as hero (not yet shipped) by: ${heldAsHero.join(", ")}`;
    out.push(
      `hero collision — '${skill}' ${lead}\n` +
        (carriedBy.length ? `  (separately, carried as a SECONDARY by: ${carriedBy.join(", ")})\n` : "") +
        (ledBy.length && heldAsHero.length
          ? `  (also HELD as hero, not yet shipped, by: ${heldAsHero.join(", ")})\n`
          : "") +
        `  Not a blocker. The question is role centrality, not the count: does '${slug}'s role\n` +
        `  collapse into one of the packs above? If it does, this is a re-skin — pick or author\n` +
        `  a hero that names what only '${slug}' does.`
    );
  }
  out.push(...nearNameWarnings(slug, skill, shipped, held));
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

  console.log(`note: depth-bar grandfathered ${grandfatherRemaining()}/${DEPTH_BAR_GRANDFATHERED.length} remaining`);

  const depth = depthStatus(skill, src);
  if (depth.state === "thin") {
    const reason = depthOverrideReason();
    if (reason) {
      console.warn(`warning: DIVE-2859 depth bar OVERRIDDEN for '${skill}' (${slug}) — reason: ${reason}`);
    } else {
      console.error(
        `REFUSED: pack '${slug}' curated hero skill '${skill}' clears neither depth arm (DIVE-2859).\n` +
          `  Checked ${src}:\n` +
          `    Arm A (references/ with >=1 file): FAIL\n` +
          `    Arm B ('## Worked example' heading + fenced block below it): FAIL\n` +
          (depth.detail ? `    PROVENANCE.md present but not exempt: ${depth.detail}\n` : "") +
          `  Not gameable by padding — line count is not a criterion. Add a references/ file,\n` +
          `  add a worked example, stage/fix a PROVENANCE.md if this is a byte-identical\n` +
          `  vendored copy, or re-run with SKILL_DEPTH_BAR_OVERRIDE="<reason>" to ship anyway\n` +
          `  with the reason on record.`
      );
      process.exit(1);
    }
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

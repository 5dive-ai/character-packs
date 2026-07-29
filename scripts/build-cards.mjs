#!/usr/bin/env node
// Emit each pack's `**Skills:**` line in card.md from that pack's manifest.
//
// WHY THIS EXISTS (DIVE-2300). Every card.md carries a Skills line. For the 11
// packs from `quant` onward it happened to be correct, and both creative and dev
// assumed a generator produced them. There was no generator: 11 authors copied
// the previous pack's shape by hand. That convention held on discipline alone and
// the 8 packs before it had already drifted, 7 of 8 misstating what the pack
// ships, 3 of them advertising a generic housekeeping skill as the character's
// ONLY skill and hiding the real hero.
//
// So this file is the mechanism everyone believed already existed. It owns ONE
// line per card and leaves every other byte alone, which is what lets authored
// copy survive a regeneration.
//
// Usage:
//   node scripts/build-cards.mjs           # rewrite drifted Skills lines
//   node scripts/build-cards.mjs --check    # exit 1 if any card is stale (CI)
//
// `--check` is the load-bearing half. A repair with no assert leaves the class
// open, because nothing stops the next hand-authored card from drifting the same
// way. If only one of the two ever runs, it should be this one.

import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PACKS_DIR = join(ROOT, "packs");
const SEP = " · ";
const SKILLS_RE = /^\*\*Skills:\*\*[\s\S]*?(?=\n\n)/m;

// Packs whose Skills line is authored prose rather than a list, and stays that
// way. An exemption must still ASSERT SOMETHING WEAKER, never skip: an
// unexplained allowlist entry is exactly how this bug class returns invisibly on
// the one pack nobody rechecks. See checkProse() for what these are held to.
const PROSE_PACKS = {
  don: {
    reason:
      "22 skills. A full backticked list is accurate and unreadable, and it " +
      "contradicts the one character whose card argues 'one memorable idea beats " +
      "ten features'. His line stays prose: hero named first, count kept true.",
  },
};

const packs = () =>
  readdirSync(PACKS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

function manifestSkills(slug) {
  const p = join(PACKS_DIR, slug, "manifest.json");
  if (!existsSync(p)) return null;
  const skills = JSON.parse(readFileSync(p, "utf8")).skills;
  return Array.isArray(skills) ? skills : null;
}

const renderLine = (skills) =>
  `**Skills:** ${skills.map((s) => `\`${s}\``).join(SEP)}`;

// Prose cards assert the two properties that actually matter to a reader: the
// hero is what the pack really leads with, and any count stated in words is
// true. That still fails if someone edits the manifest and forgets the card,
// which is the whole point of not simply skipping them.
function checkProse(slug, line, skills) {
  const problems = [];
  const hero = skills[0];
  if (!line.includes(hero)) problems.push(`hero '${hero}' not named in the prose`);
  // Any number the prose states about itself must be true. Take the first one:
  // a card that says "19 marketing skills" has to still say something true after
  // someone adds a 20th to the manifest. Prose counts the real skills and names
  // the three defaults separately, so either figure is acceptable.
  const stated = line.replace(/`[^`]*`/g, "").match(/\b(\d+)\b/);
  if (stated) {
    const n = Number(stated[1]);
    const generics = ["compile-knowledge", "notify-user", "find-skills"];
    const real = skills.filter((s) => !generics.includes(s)).length;
    if (n !== real && n !== skills.length)
      problems.push(`states ${n} against ${real} real / ${skills.length} total`);
  } else {
    problems.push("states no count, so nothing anchors it to the manifest");
  }
  return problems;
}

const check = process.argv.includes("--check");
const rows = [];
let stale = 0;
let broken = 0;

for (const slug of packs()) {
  const cardPath = join(PACKS_DIR, slug, "card.md");
  const skills = manifestSkills(slug);
  if (!existsSync(cardPath)) {
    rows.push([slug, "NO CARD", ""]);
    broken++;
    continue;
  }
  if (!skills) {
    rows.push([slug, "NO MANIFEST SKILLS", ""]);
    broken++;
    continue;
  }

  const card = readFileSync(cardPath, "utf8");
  const found = card.match(SKILLS_RE);
  if (!found) {
    rows.push([slug, "NO SKILLS LINE", ""]);
    broken++;
    continue;
  }
  const current = found[0];

  if (PROSE_PACKS[slug]) {
    const problems = checkProse(slug, current, skills);
    if (problems.length) {
      rows.push([slug, "PROSE FAIL", problems.join("; ")]);
      broken++;
    } else {
      rows.push([slug, "prose ok", PROSE_PACKS[slug].reason.slice(0, 40) + "..."]);
    }
    continue;
  }

  const want = renderLine(skills);
  if (current === want) {
    rows.push([slug, "ok", `${skills.length} skills`]);
    continue;
  }

  const had = (current.match(/`/g) || []).length / 2;
  rows.push([slug, check ? "STALE" : "rewritten", `${had} -> ${skills.length}`]);
  stale++;
  if (!check) writeFileSync(cardPath, card.replace(SKILLS_RE, want), "utf8");
}

const w = Math.max(...rows.map((r) => r[0].length));
for (const [slug, status, note] of rows)
  console.log(`  ${slug.padEnd(w)}  ${status.padEnd(10)}  ${note}`);

if (broken) {
  console.error(`\n${broken} pack(s) could not be verified. This is a hard failure.`);
  process.exit(1);
}
if (check && stale) {
  console.error(
    `\n${stale} card(s) misstate what their pack ships. Run: node scripts/build-cards.mjs`
  );
  process.exit(1);
}
console.log(
  check
    ? `\nAll ${rows.length} cards match their manifests.`
    : `\n${stale} card(s) rewritten, ${rows.length - stale} already correct.`
);

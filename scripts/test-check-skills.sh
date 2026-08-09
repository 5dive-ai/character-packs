#!/usr/bin/env bash
# Tests for scripts/check-skills.mjs (DIVE-2409, DIVE-2870, DIVE-2859).
#
# Each arm is graded independently — no `set -e`, because a fail-fast harness
# cannot tell you which assertion broke. Every refusal arm asserts three things:
# the exit code, that the message NAMES the slug and the skill, and that the
# success path was never reached. A rc-only assertion stays green when the
# guard's condition is deleted, so it grades nothing.
#
# Fixtures live outside /tmp on purpose: the resolver excludes /tmp paths, so a
# fixture there would pass the refusal arms for the wrong reason.

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCRIPT="$HERE/check-skills.mjs"
FIX="${HOME}/.cache/dive2409-fixture.$$"
pass=0; fail=0

cleanup() { rm -rf "$FIX"; }
trap cleanup EXIT

ok()   { printf '  PASS  %s\n' "$1"; pass=$((pass+1)); }
bad()  { printf '  FAIL  %s\n' "$1"; fail=$((fail+1)); }
check(){ if [ "$2" = "$3" ]; then ok "$1"; else bad "$1 (want '$3', got '$2')"; fi; }
has()  { case "$2" in *"$3"*) ok "$1";; *) bad "$1 (missing '$3')";; esac; }
hasnt(){ case "$2" in *"$3"*) bad "$1 (unexpected '$3')";; *) ok "$1";; esac; }

# Every fixture clears the DIVE-2859 depth bar on Arm A by default (a
# references/ file), so arms unrelated to the depth bar don't have to think
# about it. The dedicated "hero depth bar" section below uses mkskill_thin to
# deliberately withhold that and exercise the bar itself.
mkskill() {
  mkdir -p "$1/references"
  printf -- '---\nname: %s\n---\nfixture\n' "$(basename "$1")" > "$1/SKILL.md"
  printf 'reference material\n' > "$1/references/notes.md"
}
mkskill_thin() { mkdir -p "$1" && printf -- '---\nname: %s\n---\nfixture\n' "$(basename "$1")" > "$1/SKILL.md"; }

# ---- fixture -----------------------------------------------------------
# alpha claims [hero-a, sec-b]; both bundled. Staging root carries hero-a.
mkdir -p "$FIX/packs/alpha" "$FIX/staged"
mkskill "$FIX/packs/alpha/skills/hero-a"
mkskill "$FIX/packs/alpha/skills/sec-b"
mkskill "$FIX/staged/hero-a"
printf '{"skills":["hero-a","sec-b"]}\n' > "$FIX/packs/alpha/manifest.json"
printf '{"packs":[{"slug":"alpha"}]}\n'   > "$FIX/index.json"

# A vendored copy inside our own packs/ and an ephemeral plugin cache. Both hold
# a real SKILL.md for `ghost-c`; neither is a source.
mkskill "$FIX/packs/alpha/skills-vendored/ghost-c"
mkskill "$FIX/vendor/.tmp/plugins/ghost-c"

# Points at a file that does not exist until the held-buffer section below
# creates it — heldPacks() must degrade to [] until then, same as shippedPacks()
# degrades when INDEX_PATH is absent. Set from the start so no earlier arm can
# fall through to the DEFAULT (the real host promote-queue.txt) and get
# contaminated by real HELD data. SKILL_DEPTH_BAR_OVERRIDE is explicitly
# unset for the same reason on the depth bar itself.
export PACKS_DIR="$FIX/packs" INDEX_PATH="$FIX/index.json" PROMOTE_QUEUE_PATH="$FIX/promote-queue.txt"
unset SKILL_DEPTH_BAR_OVERRIDE
run() { HERO_SOURCE_ROOTS="$1" node "$SCRIPT" "${@:2}" >"$FIX/out" 2>"$FIX/err"; echo $?; }

echo "audit"
rc=$(run "$FIX/staged")
check "green: both skills bundled -> rc 0" "$rc" 0
has   "green: reports the ok line" "$(cat "$FIX/out")" "every manifest hero skill is bundled"

mv "$FIX/packs/alpha/skills/hero-a" "$FIX/packs/alpha/skills/.hidden-hero"
rc=$(run "$FIX/staged")
check "RED hero unbundled -> rc 1" "$rc" 1
has   "RED hero: names the slug"   "$(cat "$FIX/err")" "alpha"
has   "RED hero: names the skill"  "$(cat "$FIX/err")" "hero-a"
has   "RED hero: says HERO"        "$(cat "$FIX/err")" "HERO"
hasnt "RED hero: ok line never reached" "$(cat "$FIX/out")" "every manifest hero skill is bundled"
mv "$FIX/packs/alpha/skills/.hidden-hero" "$FIX/packs/alpha/skills/hero-a"

# Distinctness: the same absence in a SECONDARY slot must NOT block the ship.
# Without this arm the hero arm would also pass an implementation that failed on
# any missing skill, and the hero/secondary grading would be untested.
mv "$FIX/packs/alpha/skills/sec-b" "$FIX/packs/alpha/skills/.hidden-sec"
rc=$(run "$FIX/staged")
check "DISTINCT secondary unbundled -> rc 0" "$rc" 0
has   "DISTINCT secondary: warns by name" "$(cat "$FIX/err")" "secondary skill 'sec-b'"
mv "$FIX/packs/alpha/skills/.hidden-sec" "$FIX/packs/alpha/skills/sec-b"

echo "preflight"
rc=$(run "$FIX/staged" --hero alpha hero-a)
check "green: staged hero resolves -> rc 0" "$rc" 0
has   "green: prints the resolved dir" "$(cat "$FIX/out")" "$FIX/staged/hero-a"

rc=$(run "$FIX/staged" --hero bravo nowhere-skill)
check "RED unresolvable hero -> rc 1" "$rc" 1
has   "RED unresolvable: names the slug"  "$(cat "$FIX/err")" "bravo"
has   "RED unresolvable: names the skill" "$(cat "$FIX/err")" "nowhere-skill"
hasnt "RED unresolvable: never says ok"   "$(cat "$FIX/out")" "ok:"

# Poisoned find: a SKILL.md that exists ONLY in an excluded location must still
# refuse. This is what separates the exclusion list from "nothing was there".
rc=$(run "$FIX/packs/alpha/skills-vendored:$FIX/vendor/.tmp/plugins" --hero charlie ghost-c)
check "EXCLUSION vendored+cache only -> rc 1" "$rc" 1
has   "EXCLUSION: names the skill"      "$(cat "$FIX/err")" "ghost-c"
hasnt "EXCLUSION: never says ok"        "$(cat "$FIX/out")" "ok:"

# Liveness for the exclusion arm: the SAME dir, moved to a non-excluded root,
# DOES resolve — so the refusal above is the exclusion talking, not a broken
# resolver.
mkskill "$FIX/staged/ghost-c"
rc=$(run "$FIX/staged" --hero charlie ghost-c)
check "LIVENESS same skill from a durable root -> rc 0" "$rc" 0

echo "role centrality (warn only, never blocks)"
# Shipped cast for these arms: 'lead-x' leads pack one and is CARRIED by pack two,
# which leads with its own 'lead-y'. That split is what separates the two columns.
printf '{"packs":[{"slug":"one","skills":["lead-x","sec-b"]},{"slug":"two","skills":["lead-y","lead-x"]}]}\n' > "$FIX/index.json"
mkskill "$FIX/staged/lead-x"; mkskill "$FIX/staged/lead-y"; mkskill "$FIX/staged/compile-knowledge"

rc=$(run "$FIX/staged" --hero three lead-x)
check "collision: still exits 0 (warn, never fail)" "$rc" 0
has   "collision: warns"                 "$(cat "$FIX/err")" "hero collision"
has   "collision: names the leader"      "$(cat "$FIX/err")" "already LEADS: one"
has   "collision: carried column is separate" "$(cat "$FIX/err")" "carried as a SECONDARY by: two"
hasnt "collision: does NOT list a carrier as a leader" "$(cat "$FIX/err")" "LEADS: one, two"
has   "collision: asks role centrality"  "$(cat "$FIX/err")" "role centrality"
has   "collision: still resolves"        "$(cat "$FIX/out")" "ok:"

# creative's explicit negative, and the whole point of splitting the columns: a
# candidate hero that is only CARRIED elsewhere, never LED, must stay silent.
# (This is the vesper case — leads playwright-e2e, which nobody leads, while
# carrying code-review, which two packs lead. Only the hero slot is tested.)
# 'sec-b' is a secondary of pack one and the hero of nobody. Without this arm the
# collision arm would pass an implementation that warns on any repeat anywhere.
mkskill "$FIX/staged/sec-b"
rc=$(run "$FIX/staged" --hero three sec-b)
check "SILENT carried-but-never-led -> rc 0" "$rc" 0
hasnt "SILENT: no collision warning for a carried-elsewhere skill" "$(cat "$FIX/err")" "hero collision"

# A pack must not collide with itself on a re-run.
rc=$(run "$FIX/staged" --hero one lead-x)
check "SELF: re-running the owning slug -> rc 0" "$rc" 0
hasnt "SELF: does not warn against itself" "$(cat "$FIX/err")" "hero collision"

rc=$(run "$FIX/staged" --hero three compile-knowledge)
check "generic hero: exits 0" "$rc" 0
has   "generic hero: warns with its OWN reason" "$(cat "$FIX/err")" "generic hero"
hasnt "generic hero: not reported as a collision" "$(cat "$FIX/err")" "hero collision"

# Audit runs the generic fence but NOT the collision one — collision would fire on
# six shipped packs every CI run. lead-x leads 'one' and is carried by 'two'.
mkdir -p "$FIX/packs/gen" && mkskill "$FIX/packs/gen/skills/compile-knowledge"
printf '{"skills":["compile-knowledge"]}\n' > "$FIX/packs/gen/manifest.json"
printf '{"packs":[{"slug":"alpha","skills":["hero-a","sec-b"]},{"slug":"gen","skills":["compile-knowledge"]}]}\n' > "$FIX/index.json"
rc=$(run "$FIX/staged")
check "audit: generic hero warns, does not fail" "$rc" 0
has   "audit: names the generic leader" "$(cat "$FIX/err")" "gen: leads with the generic"
hasnt "audit: no collision noise in CI"  "$(cat "$FIX/err")" "hero collision"

echo "held buffer (DIVE-2870 — collision widened beyond shippedPacks())"
# 'echo-service' is HELD as hero for slug 'four' in promote-queue.txt but has
# never shipped, so shippedPacks()/index.json cannot see it. This is the exact
# blind window in community/wiki/a-collision-check-that-reads-shipped-output-cannot-see-the-buffer.md.
printf '{"packs":[{"slug":"one","skills":["lead-x","sec-b"]}]}\n' > "$FIX/index.json"
cat > "$FIX/promote-queue.txt" <<'EOF'
# HELD drip order:
#   four  hero=echo-service   (held, not yet shipped)
EOF
mkskill "$FIX/staged/echo-service"

rc=$(run "$FIX/staged" --hero five echo-service)
check "held: still exits 0 (warn, never fail)" "$rc" 0
has   "held: warns a collision"   "$(cat "$FIX/err")" "hero collision"
has   "held: names the HELD slug" "$(cat "$FIX/err")" "is HELD as hero (not yet shipped) by: four"
has   "held: still resolves"      "$(cat "$FIX/out")" "ok:"

# A pack must not collide against its own held entry.
rc=$(run "$FIX/staged" --hero four echo-service)
check "held SELF: re-running the owning slug -> rc 0" "$rc" 0
hasnt "held SELF: does not warn against itself" "$(cat "$FIX/err")" "hero collision"

echo "near-name cluster (DIVE-2870 — calibrated warn, not an exact collision)"
# 'inbox-triage' shares the 'triage' token with shipped 'ticket-triage' —
# genuinely distinct roles, same suffix, per the maw/desk case in
# community/wiki/hero-skill-sourcing.md. Reset the queue so only index.json
# drives this arm.
printf '# empty\n' > "$FIX/promote-queue.txt"
printf '{"packs":[{"slug":"six","skills":["ticket-triage"]}]}\n' > "$FIX/index.json"
mkskill "$FIX/staged/inbox-triage"
rc=$(run "$FIX/staged" --hero seven inbox-triage)
check "near-name: exits 0 (warn only)" "$rc" 0
has   "near-name: warns"             "$(cat "$FIX/err")" "near-name"
has   "near-name: names the sibling" "$(cat "$FIX/err")" "'ticket-triage' (shipped, six)"
hasnt "near-name: not reported as an exact collision" "$(cat "$FIX/err")" "hero collision"

# The negative: no shared token must stay silent, or the check is noise.
mkskill "$FIX/staged/study-plan"
rc=$(run "$FIX/staged" --hero seven study-plan)
check "near-name SILENT: no shared token -> rc 0" "$rc" 0
hasnt "near-name SILENT: no warning fires" "$(cat "$FIX/err")" "near-name"

echo "hero depth bar (DIVE-2859 — REFUSE at preflight, not just the spec)"
# Isolate from collision/near-name state above.
printf '{"packs":[]}\n' > "$FIX/index.json"
printf '# empty\n' > "$FIX/promote-queue.txt"

# 1. RED — a thin fixture clears neither arm. Named per house convention: never
# a real cast slug or skill name, so a future grep for the real thing doesn't
# snag on a fixture.
mkskill_thin "$FIX/staged/zzz-fixture-thin"
rc=$(run "$FIX/staged" --hero nine zzz-fixture-thin)
check "depth RED thin -> rc 1"        "$rc" 1
has   "depth RED: names the slug"     "$(cat "$FIX/err")" "nine"
has   "depth RED: names the skill"    "$(cat "$FIX/err")" "zzz-fixture-thin"
has   "depth RED: cites the ticket"   "$(cat "$FIX/err")" "DIVE-2859"
has   "depth RED: says which arms failed" "$(cat "$FIX/err")" "Arm A"
hasnt "depth RED: never says ok"      "$(cat "$FIX/out")" "ok:"

# 2. GREEN — Arm A alone (references/ with >=1 file, no Worked example).
mkskill "$FIX/staged/arm-a-hero"
rc=$(run "$FIX/staged" --hero nine arm-a-hero)
check "depth GREEN Arm A alone -> rc 0" "$rc" 0
hasnt "depth GREEN Arm A: no REFUSED"   "$(cat "$FIX/err")" "REFUSED"

# 3. GREEN — Arm B alone (Worked example + fence, no references/). Needs its
# own positive test or nothing proves Arm B fires at all.
mkdir -p "$FIX/staged/arm-b-hero"
printf -- '---\nname: arm-b-hero\n---\nfixture\n\n## Worked example\n\n```\nstep 1\n```\n' > "$FIX/staged/arm-b-hero/SKILL.md"
rc=$(run "$FIX/staged" --hero nine arm-b-hero)
check "depth GREEN Arm B alone -> rc 0" "$rc" 0
hasnt "depth GREEN Arm B: no REFUSED"   "$(cat "$FIX/err")" "REFUSED"

# 4. RED — the heading alone is not the arm; a fenced block must follow it, or
# the heading becomes a magic word that a 60-second stub can paste in.
mkdir -p "$FIX/staged/heading-only-hero"
printf -- '---\nname: heading-only-hero\n---\nfixture\n\n## Worked example\n\nprose, no fence.\n' > "$FIX/staged/heading-only-hero/SKILL.md"
rc=$(run "$FIX/staged" --hero nine heading-only-hero)
check "depth RED heading-without-fence -> rc 1" "$rc" 1
has   "depth RED heading-without-fence: cites the ticket" "$(cat "$FIX/err")" "DIVE-2859"

# 5. GREEN — a grandfathered slug that fails both arms still passes, and the
# run prints the remaining-count note. 'tldr' is one of the real 15 frozen at
# DIVE-2859 landing; nothing else in this suite resolves any of the 15, so the
# count goes from 0 to exactly 1 the moment this fixture exists.
mkskill_thin "$FIX/staged/tldr"
rc=$(run "$FIX/staged" --hero nine tldr)
check "depth GREEN grandfathered -> rc 0" "$rc" 0
hasnt "depth GREEN grandfathered: no REFUSED" "$(cat "$FIX/err")" "REFUSED"
has   "depth GREEN grandfathered: prints remaining count" "$(cat "$FIX/out")" "note: depth-bar grandfathered 1/15 remaining"

echo "hero depth bar: VENDORED (byte-identical to a declared upstream + LICENSE travels)"
mkdir -p "$FIX/upstream/vendored-ok"
printf -- '---\nname: vendored-ok\n---\nupstream content, unmodified\n' > "$FIX/upstream/vendored-ok/SKILL.md"
mkdir -p "$FIX/staged/vendored-ok"
cp "$FIX/upstream/vendored-ok/SKILL.md" "$FIX/staged/vendored-ok/SKILL.md"
printf 'MIT, Copyright (c) 2026 Upstream Author\n' > "$FIX/staged/vendored-ok/LICENSE"
printf -- '# Provenance\n\n- **Upstream path (this host):** `%s`\n' "$FIX/upstream/vendored-ok" > "$FIX/staged/vendored-ok/PROVENANCE.md"
rc=$(run "$FIX/staged" --hero nine vendored-ok)
check "depth GREEN vendored (byte-identical + LICENSE) -> rc 0" "$rc" 0
hasnt "depth GREEN vendored: no REFUSED" "$(cat "$FIX/err")" "REFUSED"

# RED — edited past the declared upstream: this is now a fork, so the arms
# apply like anything else instead of a one-line exemption staying valid forever.
mkdir -p "$FIX/upstream/vendored-fork" "$FIX/staged/vendored-fork"
printf -- '---\nname: vendored-fork\n---\nupstream content\n' > "$FIX/upstream/vendored-fork/SKILL.md"
printf -- '---\nname: vendored-fork\n---\nEDITED locally, no longer matches upstream\n' > "$FIX/staged/vendored-fork/SKILL.md"
printf 'MIT\n' > "$FIX/staged/vendored-fork/LICENSE"
printf -- '# Provenance\n\n- **Upstream path (this host):** `%s`\n' "$FIX/upstream/vendored-fork" > "$FIX/staged/vendored-fork/PROVENANCE.md"
rc=$(run "$FIX/staged" --hero nine vendored-fork)
check "depth RED vendored fork -> rc 1" "$rc" 1
has   "depth RED vendored fork: names the reason" "$(cat "$FIX/err")" "no longer byte-identical"

# RED — byte-identical but the LICENSE never travelled with the staged copy.
# A pack is a DISTRIBUTION; the notice has to travel with it.
mkdir -p "$FIX/upstream/vendored-nolicense" "$FIX/staged/vendored-nolicense"
printf -- '---\nname: vendored-nolicense\n---\nupstream content\n' > "$FIX/upstream/vendored-nolicense/SKILL.md"
cp "$FIX/upstream/vendored-nolicense/SKILL.md" "$FIX/staged/vendored-nolicense/SKILL.md"
printf -- '# Provenance\n\n- **Upstream path (this host):** `%s`\n' "$FIX/upstream/vendored-nolicense" > "$FIX/staged/vendored-nolicense/PROVENANCE.md"
rc=$(run "$FIX/staged" --hero nine vendored-nolicense)
check "depth RED vendored no LICENSE -> rc 1" "$rc" 1
has   "depth RED vendored no LICENSE: names the reason" "$(cat "$FIX/err")" "no LICENSE file"

echo "hero depth bar: SKILL_DEPTH_BAR_OVERRIDE (env var, reason required, not a flag)"
# RED — the bare habit-reach value '1' is explicitly refused, same as an empty
# or whitespace-only reason: it must not be reachable the way a boolean flag is.
rc=$(SKILL_DEPTH_BAR_OVERRIDE=1 run "$FIX/staged" --hero nine zzz-fixture-thin)
check "override RED bare '1' -> rc 1" "$rc" 1
has   "override RED bare '1': still cites the ticket" "$(cat "$FIX/err")" "DIVE-2859"

rc=$(SKILL_DEPTH_BAR_OVERRIDE="   " run "$FIX/staged" --hero nine zzz-fixture-thin)
check "override RED whitespace-only -> rc 1" "$rc" 1

# GREEN — a real reason bypasses the refusal and is echoed into the output so
# the override leaves a why behind, on the record.
rc=$(SKILL_DEPTH_BAR_OVERRIDE="hero is a thin wrapper by design, see DIVE-9999" run "$FIX/staged" --hero nine zzz-fixture-thin)
check "override GREEN with reason -> rc 0" "$rc" 0
has   "override GREEN: reason is echoed"  "$(cat "$FIX/err")" "DIVE-9999"
has   "override GREEN: says OVERRIDDEN"   "$(cat "$FIX/err")" "OVERRIDDEN"

echo
printf '%d passed, %d failed\n' "$pass" "$fail"
[ "$fail" -eq 0 ]

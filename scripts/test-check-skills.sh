#!/usr/bin/env bash
# Tests for scripts/check-skills.mjs (DIVE-2409).
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

mkskill() { mkdir -p "$1" && printf -- '---\nname: %s\n---\nfixture\n' "$(basename "$1")" > "$1/SKILL.md"; }

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

export PACKS_DIR="$FIX/packs" INDEX_PATH="$FIX/index.json"
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

echo
printf '%d passed, %d failed\n' "$pass" "$fail"
[ "$fail" -eq 0 ]

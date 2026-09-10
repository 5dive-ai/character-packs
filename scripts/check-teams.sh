#!/usr/bin/env bash
# teams/ registry integrity — the guard that MOVED WITH THE ARTIFACT (DIVE-4196).
#
# Team templates used to live in 5dive-ai/5dive and were graded there by
# tests/plugin_contract_unit.sh T13 (index.json vs the files on disk vs
# install.sh's staging list). Two of those three declarations no longer exist:
# nothing is staged and nothing is bundled. What survives is the one that can
# still drift here — index.json advertising a slug the repo does not contain,
# which is exactly #807/#808 (`deploy-team`, `distribution`): the CLI lists the
# slug from the index and then answers "no template" on import.
#
# It is a SET COMPARISON, not a grep for a slug: it reds on the template that
# was ADDED, which is the direction the drift travels.
#
# schemaVersion is checked against the template's OWN `version:` line rather
# than being a second hand-maintained value. The CLI refuses a template whose
# declared version is newer than it can read; if the index said 2 while the file
# said 3, the refusal would fire on the wrong population.
set -uo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

PASS=0; FAIL=0
t() { # t <name> <expected> <actual>
  if [[ "$2" == "$3" ]]; then PASS=$((PASS+1)); printf 'ok   - %s\n' "$1"
  else FAIL=$((FAIL+1)); printf 'FAIL - %s\n       expected: %s\n       actual:   %s\n' "$1" "$2" "$3"; fi
}

[[ -f teams/index.json ]] || { echo "FAIL - teams/index.json missing"; exit 1; }
jq -e '.companies | type == "array" and length > 0' teams/index.json >/dev/null \
  || { echo "FAIL - teams/index.json has no companies[]"; exit 1; }

idx_slugs=$(jq -r '.companies[].slug' teams/index.json | sort)
ondisk=$(cd teams && printf '%s\n' *.5dive.yaml | sed 's/\.5dive\.yaml$//' | sort)
t "T1 index.json advertises exactly the templates teams/ contains" "$ondisk" "$idx_slugs"
t "T2 ...and neither list is empty, so T1 cannot pass by comparing blanks" "yes" \
  "$([[ -n "$idx_slugs" && -n "$ondisk" ]] && echo yes || echo no)"

# Every entry's declared path resolves, and its schemaVersion is the file's own.
bad_path=""; bad_ver=""
while IFS=$'\t' read -r slug path sv; do
  [[ -f "$path" ]] || { bad_path+="$slug "; continue; }
  file_v=$(sed -n 's/^version:[[:space:]]*"\{0,1\}\([0-9][0-9]*\)"\{0,1\}[[:space:]]*$/\1/p' "$path" | head -1)
  [[ "$file_v" == "$sv" ]] || bad_ver+="$slug(index=$sv,file=${file_v:-none}) "
done < <(jq -r '.companies[] | [.slug, (.path // ""), (.schemaVersion|tostring)] | @tsv' teams/index.json)
t "T3 every index entry's path exists" "" "${bad_path% }"
t "T4 every index entry's schemaVersion equals the template's own version:" "" "${bad_ver% }"

# The roster the dashboard renders must be the roster the import provisions.
bad_roster=""
while IFS= read -r slug; do
  idx_keys=$(jq -r --arg s "$slug" '.companies[]|select(.slug==$s)|.roster[].key' teams/index.json | sort | tr '\n' ',')
  yaml_keys=$(sed -n '/^agents:/,$p' "teams/$slug.5dive.yaml" \
    | sed -n 's/^  \([a-z0-9][a-z0-9_-]*\):[[:space:]]*$/\1/p' | sort | tr '\n' ',')
  [[ "$idx_keys" == "$yaml_keys" ]] || bad_roster+="$slug(index=$idx_keys yaml=$yaml_keys) "
done <<<"$idx_slugs"
t "T5 every index roster matches its template's agents block" "" "${bad_roster% }"

printf '\n%d passed, %d failed\n' "$PASS" "$FAIL"
[[ $FAIL -eq 0 ]]

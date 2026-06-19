# 5dive character packs

A **git registry** of curated, importable AI-agent persona packs for [5dive](https://github.com/5dive-ai/5dive).
A pack is a persona (CLAUDE.md + config + skill refs), optionally with **distilled
seed memory** ([see below](#memory--pre-trained-packs)) — **never** raw private memory or secrets.
You bring your own keys + bot; the pack brings the character.

## Browse / import

```bash
5dive agent import <slug> --as=<your-name>      # pull a pack straight from this repo
```

The CLI reads [`index.json`](index.json) (the registry manifest) to list packs and resolves
`packs/<slug>/` for the pack body. No api.5dive.com dependency — self-hosters import directly
from GitHub, the same way [5dive-ai/skills](https://github.com/5dive-ai/skills) and
[5dive-ai/5dive-templates](https://github.com/5dive-ai/5dive-templates) already work.

## Registry layout

```
index.json                 # registry manifest (registryFormat:1) — array of pack entries
packs/<slug>/
  manifest.json            # pack manifest (packFormat:1) — config + skill/plugin refs, no secrets
  CLAUDE.md                # the persona / system prompt
  avatar.png               # square character avatar (optional; shown in browse + set on import)
  skills/<skill>/SKILL.md  # bundled skill bodies — pack is self-contained, no separate repo lookup
  card.md                  # human-readable preview card (optional)
  memory/MEMORY.md         # (optional) index for distilled seed memory — see Memory
  memory/seed-memory.md    # (optional) distilled, leak-checked lessons — see Memory
```

Each `index.json` entry: `slug`, `name`, `tagline`, `character`, `track`, `tags`,
`path`, `avatar` (optional), `packFormat`, `includesMemory`, `skills`, `skillsBundled`,
and optional `rarity` / `model` / `effort` (shown on the marketplace card).

## Memory — pre-trained packs

A pack can ship **distilled seed memory** so an imported agent starts *seasoned, not
day-one*. These are the persona's hard-won lessons — the corrections it has accumulated
on the job — **distilled to their transferable essence and stripped of anything specific**
(no names, paths, secrets, internal tooling, or company specifics). It is *not* raw memory:
it's reviewed, leak-checked, and company-agnostic, so it makes any imported agent better
without leaking the source.

**How it ships.** The pack carries a `memory/` folder and declares it in the manifest:

```jsonc
// packs/<slug>/manifest.json
{
  "includes": { "memory": "distilled" },   // "false" = no memory (default)
  "memoryFiles": ["seed-memory.md"]         // files under memory/ to seed
}
```

```
packs/<slug>/memory/
  MEMORY.md          # index that the agent loads each session
  seed-memory.md     # frontmatter + the distilled lessons (type: feedback)
```

On `5dive agent import <slug> --as=<name>`, the CLI fetches `memory/` and seeds those files
into the new agent's memory store, so it boots already knowing them. Set
`"includesMemory": true` on the pack's `index.json` entry so the marketplace shows it ships
pre-trained. (The agent keeps learning from *your* corrections after import — the seed is
just the head start.)

**Still forbidden:** raw/private/operational memory. Distilled = reviewed transferable
lessons only. `5dive agent export <name> --with-memory` runs a deny-by-default redaction +
review gate to produce a publishable `memory/` from a live agent — never hand-copy raw memory.

## Publish a pack

Publishing is a **pull request with a mandatory human review gate** — never auto-published.

1. Produce a pack with `5dive agent export <name>` (config-only by default; `--with-memory`
   runs the deny-by-default redaction + review gate before any memory is included).
2. Add `packs/<slug>/` (manifest.json, CLAUDE.md, optional card.md) and a new entry in `index.json`.
3. Open a PR. A maintainer reviews for: no secrets/private memory, on-brand persona, working skill refs.
4. On merge it's instantly importable by everyone.

**Hard rules:** no `.env`, tokens, SSH keys, `.credentials.json`, or operational/customer memory.
The export tripwire + allowlist already enforce this; review is the second line.

## Tracks

- **Track A** — curated official cast (maintained by 5dive).
- **Track B** — community-published packs (PR + review).

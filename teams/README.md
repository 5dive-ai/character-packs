# 5dive company templates

A **git registry** of pre-wired multi-agent companies for
[5dive](https://github.com/5dive-ai/5dive) — the same repo the character packs
live in, because a team is a marketplace artifact like a pack is.

```bash
5dive team ls                 # browse this registry, live
5dive team import <slug>      # provision the whole roster
```

## Why they are here and not in the CLI repo

They used to ship inside `5dive-ai/5dive` and be staged onto a box by
`install.sh` **at install time only**. Publishing a template therefore needed a
PR to the CLI repo, an edit to a hand-maintained staging list, a release cut and
a self-update on every box — and a box that had already installed never received
it at all. Measured 2026-09-10: a host on 0.29.0 had 4 staged templates while
that tag shipped 6.

Reading them from this registry means a template published here reaches every
box on its next `5dive team ls`, with no release. That is the whole point.

## Layout

| file | what it is |
| --- | --- |
| `index.json` | the manifest the CLI and the dashboard read |
| `<slug>.5dive.yaml` | one template |
| `SCHEMA-v2.md` | the schema those templates are written against |

Each `index.json` entry carries `path` and `schemaVersion`. `schemaVersion` must
equal the template's own `version:` line — the CLI **refuses** a template
declaring a schema newer than it can read, naming the version, rather than
half-parsing it into a roster missing whatever the new keys wired. That refusal
is what replaces the guarantee bundling used to give for free.

## Adding a template

1. Add `teams/<slug>.5dive.yaml`.
2. Add its entry to `teams/index.json` (`path`, `schemaVersion`, and a `roster`
   matching the template's `agents:` block — the dashboard renders that roster).
3. `bash scripts/check-teams.sh` — it set-compares the index against the files
   on disk, so an index that advertises a slug the repo does not contain reds
   here instead of on a customer's import (#807, #808).
4. `bash scripts/check-team-skills.sh` — every skill a template names is a
   reference into `5dive-ai/skills`, resolved months later on a customer's box.

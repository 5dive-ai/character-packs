## New / updated character pack

- **Slug:** 
- **Character / role:** 

### Author checklist
- [ ] `packs/<slug>/manifest.json` (packFormat:1) — config + skill refs only, **no secrets**
- [ ] `packs/<slug>/CLAUDE.md` — the persona
- [ ] New/updated entry in `index.json`
- [ ] No `.env`, tokens, SSH keys, `.credentials.json`, or private/operational memory
- [ ] Skill refs resolve (published skills only)

### Maintainer review gate (required — never auto-merge)
- [ ] Confirmed no secrets / private memory
- [ ] Persona is on-brand and works standalone
- [ ] Pack imports cleanly: `5dive agent import <slug> --as=test`

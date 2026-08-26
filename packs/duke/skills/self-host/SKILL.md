---
name: self-host
description: >-
  Move it off the platform and onto a box you can point at — decide what's worth
  self-hosting, migrate it off a managed service onto hardware or a plain VPS you own,
  and prove your backups are real by restoring them. Use this when someone wants to
  leave a SaaS/PaaS/managed database for self-hosted, is standing up a homelab or a
  single-box deploy, is weighing "should we self-host this or keep paying for it",
  is fighting lock-in or a surprise cloud bill, or is setting up (and actually
  testing) backups and restores. This is the ownership-and-migration side of infra:
  choosing to own the box, getting the app onto it cleanly, and making the restore
  boring. For keeping an already-running service healthy and on-call ready use
  `runbook`; for a live outage use `incident-response`.
compatibility: "No special requirements. Works from a description of the app, its current managed dependencies, and the target hardware/VPS."
metadata:
  author: 5dive
  version: "1.0"
  license: company-agnostic
---

# Self-host

If you don't own the box, you're renting an opinion. The cloud is just someone
else's computer, and the bill is someone else's incentive. Your job is to move a
thing off a managed platform onto hardware (or a plain VPS) you control, without
losing data and without trading a mystery bill for a mystery outage. The win is
"same app, half the cost, none of the magic" — and a restore you have actually run.

## First: should this even be self-hosted?

Self-hosting is a trade, not a virtue. You take on ops you were paying someone to do.
Say yes when:

- **The managed premium is real and recurring** — you're paying platform margin for
  something a $10-40/mo box or existing hardware runs fine (static sites, small
  Postgres, object storage, a queue, internal tools, media).
- **Lock-in or egress is the actual pain** — data-egress fees, per-seat pricing that
  scales worse than your usage, a proprietary API you can't leave.
- **You want the data on hardware you can point at** — privacy, sovereignty, or just
  the ability to `ssh` in.

Say no (keep paying) when: the service is genuinely hard to run safely yourself
(managed Postgres HA, email deliverability, a CDN's global edge), when downtime is
expensive and you have no on-call, or when the labor to run it costs more than the
bill you're trying to cut. Self-hosting to save $20/mo and spending a weekend a month
on it is a bad trade — name that out loud.

## Migrating off a managed platform

The order that keeps you sane:

1. **Inventory what the platform was silently doing for you.** TLS certs, backups,
   log rotation, the load balancer, secrets injection, cron, auto-restart on crash,
   OS patching. Each of these is now yours. Write the list before you move anything —
   the forgotten one is what bites.
2. **Reproduce the environment, not just the app.** Runtime version, env vars,
   system packages, file/volume mounts. Containerize it (Docker/Compose) so the box
   is cattle, not a pet you hand-tuned and can never rebuild.
3. **Move data last and deliberately.** Dump → transfer → restore → **verify row
   counts / checksums**, then cut over. For a live DB, replicate or take a consistent
   dump during a short freeze; never `cp` a database file that's being written to.
4. **Put the boring platform jobs back.** Reverse proxy + auto-TLS (Caddy or
   nginx+certbot), a process supervisor / `restart: unless-stopped`, log rotation,
   unattended security upgrades, a firewall (only the ports you mean). This is the
   half of the platform bill you were actually paying for.
5. **Cut over with a rollback.** Keep the old platform running until the new box has
   served real traffic and a backup has been restored. DNS TTL low before the switch
   so you can fail back fast.

## Backups: trust the restore, not the backup

A backup you have never restored is a rumor. The only test that counts is bringing
the data back on a *different* box and watching the app come up clean.

- **3-2-1, actually:** 3 copies, 2 different media/locations, 1 off-site (and off the
  same provider/account — a backup in the same account a billing lock or a fat-finger
  can delete is one copy, not two).
- **Automate the backup, schedule the restore drill.** Backups that only run when you
  remember don't run. A restore you only do in a crisis is a first attempt during a
  crisis. Put both on a timer.
- **Restore drill = the real test.** Spin a scratch box, restore the latest backup,
  bring the app up against it, check row counts / a known record / a login. Time it —
  that number is your real RTO. If the drill fails, the backup was decorative.
- **Encrypt backups and know the RPO/RTO.** How much data can you lose (backup
  frequency) and how long to be back (restore time)? Pick them on purpose; test that
  reality matches.
- **Watch for silent rot:** a backup job that's been erroring for weeks, a full disk
  that stopped new snapshots, a rotated-out retention window. Alert on "last
  successful backup age", not just on failures.

## Homelab / single-box hygiene

- **Rebuildable, not hand-fed.** Everything in a compose file / a short provisioning
  script in git. If the box dies, you rebuild from the repo + the last restore, not
  from memory.
- **Cable management is uptime.** Label it, tidy the runs, document what's plugged
  where. The 3am you save is your own.
- **Power, heat, and a UPS** for anything you care about; a homelab that browns out on
  a storm isn't hosting anything.
- **Off-box monitoring.** A box can't tell you it's down. Uptime checks and backup-age
  alerts live somewhere that survives the box dying.

See `references/migration-and-restore-checklists.md` for a platform-exit checklist and
a restore-drill runbook.

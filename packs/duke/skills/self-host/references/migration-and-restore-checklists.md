# Self-host reference: platform-exit + restore-drill checklists

## Platform-exit checklist (fill in before you move anything)

What the managed platform was doing for you — claim each one on the new box:

- [ ] **TLS certs** → reverse proxy with auto-renew (Caddy, or nginx + certbot cron)
- [ ] **Backups** → automated dump + off-box/off-account copy (see restore drill below)
- [ ] **Process supervision / auto-restart** → `restart: unless-stopped` or systemd unit
- [ ] **Load balancer / routing** → reverse proxy config, health check endpoint
- [ ] **Secrets injection** → `.env` not in git, or a secrets file with locked perms
- [ ] **Cron / scheduled jobs** → system cron or a scheduler container
- [ ] **Log rotation** → `logrotate` or container log limits (don't fill the disk)
- [ ] **OS patching** → unattended-upgrades (security) on a schedule
- [ ] **Firewall** → default-deny inbound, open only the ports you actually serve
- [ ] **Monitoring / uptime** → off-box check + alerting (a down box can't page you)

Environment reproduction:

- [ ] Runtime + version pinned (not "latest")
- [ ] System packages / libs listed
- [ ] Env vars captured (and secrets rotated out of the old platform)
- [ ] Volumes / persistent paths mapped
- [ ] Whole thing in a compose file / provisioning script **committed to git**

Cutover:

- [ ] Lower DNS TTL a day ahead (fast failback)
- [ ] New box served real traffic on a test hostname first
- [ ] A backup taken on the new box has been **restored and verified** before cutover
- [ ] Old platform kept running until the new box is proven; decommission after.

## Restore-drill runbook (run on a timer, not just in a crisis)

The only backup test that counts. Never restore onto the live box during a drill.

1. **Provision a scratch box** (separate VM / container) — clean, like a disaster would give you.
2. **Pull the latest backup** from the off-box/off-account location (prove that copy is reachable, not just the local one).
3. **Restore the data** (DB import, file extract) onto the scratch box.
4. **Bring the app up** against the restored data.
5. **Verify for real:**
   - row counts / table sizes match expectation
   - a known record exists and is correct
   - a login / a core user action works end to end
6. **Time it.** Start-to-working = your real RTO. Record it; if it grew, find out why.
7. **On failure, the backup is broken — fix it now, not during the outage.** Common
   causes: partial/corrupt dump, missing schema step, wrong version, an untested
   dependency (extensions, secrets, a companion service).
8. **Tear down** the scratch box.

Cadence: automate the backup daily (or tighter, per RPO); run the restore drill on a
schedule (weekly/monthly per how much the data matters). Alert on **last-successful-
backup age** and **last-successful-drill age** — a silent-failing backup job is the
classic way "we have backups" turns into "we had backups."

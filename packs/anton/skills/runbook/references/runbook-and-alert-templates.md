# Runbook template + alert-review checklist

## Runbook template (one per failure mode)

```
# Runbook: {failure mode / alert name}

**Trigger:** {the exact alert or symptom that sends you here}
**Severity:** {expected sev if this fires — see incident-response severity matrix}
**Owner:** {team/person who owns this service}

## Verify it's real
- {command / dashboard link / endpoint to confirm the symptom from outside}
- If NOT confirmed → the alert is lying; retune it (see checklist below), don't act.

## Mitigate (fastest safe path first)
1. {rollback / failover / flag-off — copy-pasteable command}
2. {next step if 1 doesn't work}
3. ...

## Escalate
- If the steps above don't restore service in {N} minutes, escalate to {owner/team}.
- Stop digging and escalate when: {clear condition — don't hero it past this line}.

## Verify recovery
- {how to confirm the user-facing symptom is actually gone, from outside}

## Prevention follow-up
- {the system change that would stop this recurring — feeds back into hardening}
```

If any step reads "investigate" or "figure out what's wrong," it isn't done — a
runbook is a checklist, not a hint. The test: a tired on-call who has never seen
this service can follow it and restore service without waking anyone else.

## Alert-review checklist (run periodically on every alert)

For each alert, answer:

- [ ] **Actionable?** When it fires, is there something a human must do *now*? If
      no → demote to dashboard/ticket, don't page.
- [ ] **Symptom, not cause?** Does it alert on user pain (errors, latency, SLO
      burn), not on a proxy metric (CPU, memory, disk) that may not hurt anyone?
- [ ] **Has a runbook?** Is there a linked runbook for exactly this alert? If no →
      write it or stop paging on it.
- [ ] **Fires only when real?** Check the last N firings: how many were real vs
      noise? >20% noise → retune (raise threshold, add for-duration/hysteresis) or
      delete. Flappy alerts train people to ignore the pager.
- [ ] **Right severity + routing?** Sev1 pages, sev3 tickets. No 3am page for a
      thing that can wait until Monday.
- [ ] **Still relevant?** Does the thing it watches still exist and still matter?
      Delete alerts for retired services — stale alerts are pure noise.

**Error-budget quick reference** (downtime budget per 30-day month):
- 99%   → ~7h 12m
- 99.9% → ~43m
- 99.95%→ ~22m
- 99.99%→ ~4m 20s

Spend the budget on purpose (risky deploys, maintenance) rather than burning it by
surprise. When the budget's nearly gone, freeze risky changes until it recovers.

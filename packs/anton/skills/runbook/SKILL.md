---
name: runbook
description: >-
  Keep a service so boring nobody notices it's there — author and maintain
  operational runbooks, tune alerts so they fire on real user pain and nothing else,
  and harden uptime *before* the 3am page instead of after. Use this when writing or
  reviewing a runbook for a service or a recurring failure, designing or pruning
  alerts (killing noisy/flappy alerts, fixing alert fatigue, mapping every alert to
  an action), setting SLOs and error budgets, deciding what's worth paging a human
  for, prepping or cleaning up an on-call rotation, hardening a deploy or a fragile
  dependency, or answering "how do we stop getting paged for this." This is the
  proactive, prevention side of reliability. For commanding a live incident that is
  already on fire, use `incident-response` instead.
compatibility: "No special requirements. Works from a description of the service, its alerts, or an existing runbook the model can read."
metadata:
  author: 5dive
  version: "1.0"
  license: company-agnostic
---

# Runbook

Your job is to make sure nobody ever has to think hard at 3am — because you already
did the thinking, wrote it down, and tuned the alert so it only fires when it should.
The reliability nobody notices is the reliability that's working. You are not the
person who fixes the fire; you're the reason the fire is small and the on-call knows
exactly what to do.

## The two rules that govern everything

1. **Every alert points at a runbook.** An alert with no runbook is a 3am puzzle
   handed to a half-asleep human. If you can't write down what to do when it fires,
   you don't understand the failure well enough to be paging on it yet.
2. **Every page teaches you to prevent the next one.** A page that fires and gets
   hand-waved away is a bug in your alerting. Either it was a real problem (→ fix the
   system so it can't recur, or write the runbook) or it wasn't (→ retune or delete
   the alert). Pages are expensive; treat each one as a signal about your alerting,
   not just about the service.

## Writing a runbook a half-asleep on-call can follow

A runbook is not documentation — it's a checklist for a specific bad state, written
for someone tired, stressed, and not the author. It must have:

- **Trigger** — the exact alert or symptom this runbook answers. One runbook per
  failure mode, not one giant doc.
- **Verify** — how to confirm it's really happening (the command / dashboard /
  endpoint to check), so you don't act on a lying alert.
- **Mitigate** — the numbered steps to restore service, fastest safe path first
  (usually rollback / failover / flag-off), copy-pasteable commands where possible.
- **Escalate** — who/what to pull in if the steps don't work, and when to stop
  trying and escalate rather than dig.
- **Verify recovery** — how to confirm the user-facing symptom is actually gone.

Test it by imagining you're paged at 3am having never seen this service. If a step
says "investigate the issue," it's not a runbook yet. See the reference template.

## Alert tuning: signal vs noise

The goal is a pager that only fires when a human needs to act *now*. Everything else
is a dashboard or a ticket, not a page.

- **Alert on symptoms, not causes.** Page on "users are seeing errors / latency is
  over the SLO", not on "CPU is at 80%". High CPU that hurts nobody is not an
  incident; it's a graph.
- **SLO-based alerting + error budgets.** Define the SLO (e.g. 99.9% of requests
  succeed), alert when you're burning the error budget fast enough to breach it.
  This is what separates "wake someone up" from "look at it Monday."
- **Kill flappy and noisy alerts on sight.** An alert that cries wolf trains people
  to ignore the pager, which is how the real one gets missed. Add hysteresis /
  for-duration, raise thresholds to real pain, or delete it. Alert fatigue is a
  reliability risk, not a nuisance.
- **Every page must be actionable.** If the on-call can't do anything about it right
  now, it's not a page. Route it to a dashboard or a ticket.

## Hardening before the fire

- **Deploys:** gradual rollout, health checks, easy one-command rollback, feature
  flags for anything risky. The best incident is the deploy that auto-rolls-back.
- **Dependencies:** know your critical path and its blast radius. Timeouts,
  retries with backoff, circuit breakers, graceful degradation. Assume every
  dependency will fail — *and yes, it's usually DNS* (check resolution/TTL/caching
  early, it's the boring cause that hides behind exotic theories).
- **Measure uptime in nines and know what each nine costs** — 99.9% is ~43 min/month
  of downtime budget; spend it deliberately.

## On-call readiness / handoff

- The rotation should hand over *state*, not just a pager: what's fragile right now,
  what's mid-mitigation, what changed. A handoff is a written transfer.
- Before you rotate off, every alert that fired should have a runbook or a
  follow-up. Don't hand the next person a mystery you already solved.
- When an `incident-response` postmortem produces an action item ("add an alert",
  "write the runbook", "make it auto-rollback") — that lands here. Turning a
  postmortem action item into a tuned alert + a runbook is how the next occurrence
  of that incident becomes a boring 3am non-event.

See `references/runbook-and-alert-templates.md` for the runbook template and an
alert-review checklist.

---
name: incident-response
description: >-
  Command a live incident from the moment the channel catches fire to the moment
  it's green — triage the severity, stabilize the system (mitigate / rollback /
  feature-flag), keep the channel calm and blameless with one clear commander, then
  drive the postmortem nobody argues with. Use this for sev1/sev2 outages, "prod is
  down", degraded or partial service, error-rate or latency spikes, a bad deploy
  that needs rolling back, on-call handoffs mid-incident, incident status comms, and
  writing the postmortem + action items afterward. Reach for it whenever something
  is broken in production RIGHT NOW and someone has to run the response. NOT for
  chasing down a single reproducible bug in a calm codebase — that's diagnostics.
  This is the coordination and decision layer under fire.
compatibility: "No special requirements. Works from a description of the incident, logs, or a chat transcript the model can read."
metadata:
  author: 5dive
  version: "1.0"
  license: company-agnostic
---

# Incident response

You are the person who walks into the burning channel and finds it boring. Your
job is not to be the smartest engineer in the room — it's to make the room calm,
make the next decision, and get the system back to green. Everything else waits.

## The one rule that governs everything

**Mitigate first, understand later.** During an active incident the goal is to
stop the bleeding, not to find the root cause. Restore service by the fastest safe
path — roll back, fail over, flip a flag, shed load — and only *then* investigate
why. A perfect diagnosis that arrives after twenty more minutes of downtime is a
worse outcome than a rollback that works in ninety seconds. Say this out loud when
the channel starts theorizing while prod is down: "we do the why later."

## First 60 seconds: take command

One incident has exactly one commander. If nobody has said "I've got it", you say
it. Then:

1. **Confirm it's real.** Is a user-facing thing actually broken, or is a dashboard
   lying? Check the symptom from the outside (the actual endpoint / the actual
   user path), not just the alert.
2. **Set the severity** (see the reference). Sev drives everything: who you page,
   how loud you go, how often you update.
3. **Establish one channel.** All incident talk goes there. Kill side-DMs — they
   fragment the picture.
4. **Assign roles if it's big:** commander (decides), ops (hands on keyboard),
   comms (updates stakeholders). On a small one, that's all you.

## Stabilize: the decision tree

Ask, in order:

- **Did a recent change cause this?** (deploy, config, feature flag, infra change
  in the last hour). If yes → **roll it back.** Rollback beats forward-fix almost
  every time under fire: it's the path you already know works. Don't debug the new
  code while it's live — revert to the last known-good, then debug offline.
- **Is it a dependency?** (a downstream API, DNS, a database, a cloud region). If
  yes → fail over, degrade gracefully, or cut the dependency out of the hot path.
  You often can't fix someone else's outage — you route around it.
- **Is it load?** → shed it: rate-limit, queue, scale out, turn off the expensive
  non-critical feature.
- **Feature flag** the broken surface off if you have one. Fastest mitigation that
  exists — no deploy needed.

If none of these apply and you're genuinely stuck, that's when you pull in the
owner of the failing system — but keep the channel narrow, not a crowd.

## Comms discipline

- **No blame in the channel.** "the deploy broke it" not "who deployed this." The
  why and the who go in the postmortem, calmly, later. Blame in the moment makes
  people defensive and slow.
- **Status cadence by severity** — even "no change, still investigating, next
  update in 15" is a status. Silence makes stakeholders panic and DM people, which
  pulls responders off the fix. Use the update template in the reference.
- **The worse it gets, the quieter you get.** Short, factual, present-tense.
  Calm is contagious; so is panic.

## Declaring green + handoff

- Green means the *user-facing symptom* is gone and confirmed from the outside —
  not "the fix is deployed." Verify the actual path recovered.
- If it's a long one, hand off explicitly: current state, what's been tried, what's
  monitoring, what would re-page. A handoff is a written state transfer, not "you
  watch it now."
- Leave when it's green, not a second before, and not a second after you're needed.

## The postmortem (blameless, within ~24–48h)

The postmortem is the deliverable that makes the *next* incident shorter. It is
blameless by construction — it examines the system and the process, never a person.
Structure (template in the reference):

- **Timeline** — detection → mitigation → resolution, in UTC, factual.
- **Impact** — who/what was affected, how long, magnitude. Real numbers only.
- **What went well / what hurt** — including detection and comms, not just the tech.
- **Root cause(s)** — the honest technical why, plus the contributing process gaps.
- **Action items** — each with an owner and a due date, each one thing that makes
  this class of incident less likely or faster to resolve. An action item without
  an owner is a wish, not a fix.

Good action items change the system (add the alert, add the runbook, add the
guardrail), not the humans ("be more careful"). Hand the durable ones to whoever
owns prevention — see the `runbook` skill for turning a postmortem action item into
a tuned alert + a runbook so the next 3am page is boring.

See `references/incident-severity-and-comms.md` for the severity matrix, the
status-update template, and the postmortem template.

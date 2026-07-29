# Incident severity matrix + comms templates

## Severity matrix

| Sev | Meaning | Examples | Response |
|---|---|---|---|
| **Sev1** | Critical, broad user-facing outage or data loss/security breach | Site down, checkout broken, data being lost/exposed | Page immediately, all-hands, commander + comms, updates every 15–30 min |
| **Sev2** | Major degradation, significant subset affected, workaround may exist | One key feature down, one region degraded, severe latency | Page on-call, commander, updates every 30–60 min |
| **Sev3** | Minor / partial, limited impact, not urgent | Non-critical feature glitch, cosmetic, single-tenant | Ticket + next-business-day, no paging |

Rule of thumb: **when unsure between two severities, pick the higher one.** You can
always downgrade; under-calling loses time you never get back.

## Status update template (post in the incident channel)

```
[SEV{n}] {short title} — {INVESTIGATING | IDENTIFIED | MONITORING | RESOLVED}
Impact: {what users see, who's affected}
Now: {what we're doing this minute}
Next update: {time}
```

Post one on declaration, one on each state change, and one on the cadence above even
when nothing changed ("no change, still investigating"). Silence is not a status.

## Postmortem template (blameless)

```
# Postmortem: {title} — {date}

**Severity:** SEV{n}   **Duration:** {detection → resolved}   **Author:** {name}

## Summary
{2–3 sentences: what broke, blast radius, how it was resolved.}

## Impact
{Who/what, how long, magnitude — real numbers only. No estimates dressed as facts.}

## Timeline (UTC)
- HH:MM — {event: change shipped / alert fired / detection / mitigation / green}
- ...

## Root cause
{The honest technical why + the contributing process/system gaps. No names.}

## What went well
{Detection, tooling, comms, decisions that helped.}

## What hurt
{Gaps in detection, tooling, comms, or process — the system, never the person.}

## Action items
| Action | Owner | Due |
|---|---|---|
| {system change that prevents or shortens this class of incident} | {name} | {date} |
```

**Blameless invariant:** every sentence examines the system or the process. If a
sentence names a person as the cause, rewrite it to name the gap that let the
mistake reach production (missing guardrail, missing test, missing alert, unclear
runbook). People make mistakes; good systems make mistakes cheap.

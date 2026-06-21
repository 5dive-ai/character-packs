---
name: support-reply
description: Drafting customer support replies that resolve the issue and keep the relationship intact — triaging by severity, structuring the response (acknowledge, diagnose, resolve, close), matching the user's tone, asking the right troubleshooting questions, and handling angry users, refunds, and bug reports. Use when the user wants to write or improve a support reply, respond to a complaint or bug report, handle a refund request, decide when to escalate, or turn recurring tickets into docs/FAQ. Keywords support, customer support, help desk, ticket, reply, refund, escalation, troubleshooting, bug report, angry customer, FAQ.
version: 1.0.0
license: MIT
---

# Support Reply Guide

Good support is calm, fast, and human. The person on the other end is frustrated, confused, or
both — your job is to make them feel handled and then actually handle it. Sound like a person
who happens to work there, not a policy document with a name attached.

> The reply they remember isn't the one with perfect grammar. It's the one where someone clearly
> read their message, got the problem, and fixed it (or owned what they couldn't).

## Triage first

Before drafting, score the ticket. Severity sets your tone, depth, and speed.

| Severity | Looks like | Response posture |
| --- | --- | --- |
| Critical | Outage, data loss, can't log in, billing charged wrong, security | Drop everything, ack in minutes, escalate now |
| High | Core feature broken for this user, blocked workflow | Fast reply, diagnose, set a clear expectation |
| Normal | "How do I…", config question, minor bug with a workaround | Solve it; link a doc if one exists |
| Low | Feature request, "would be nice", praise, vague musing | Acknowledge warmly, log it, no rush |

Urgency ≠ severity. An angry user with a low-severity issue still needs a fast, warm reply —
just not an engineering fire drill. Read for *emotional* urgency too.

## Anatomy of a good reply

Four beats, in order. Skip none, but keep each tight.

1. **Acknowledge** — show you read it and you get why it matters. One line.
2. **Diagnose** — what's happening / what you need to find out. Don't guess in a way that sounds
   final.
3. **Resolve or next-step** — the fix, OR the specific thing you're doing and by when.
4. **Close** — leave the door open. "Anything else I can do?" / "Reply here if it acts up again."

Never end on a diagnosis with no action. Every reply moves the ticket forward by exactly one
concrete step.

## Tone calibration

Match the user, then nudge toward calm.

- **Mirror their register.** Casual "hey this is broken lol" → casual reply. Formal/enterprise →
  a touch more buttoned-up. Don't be peppy at someone who's furious.
- **Stay human.** Contractions, plain words, short sentences. "Sorry about that" beats "We
  apologize for the inconvenience."
- **No corporate stiffness.** Kill "kindly," "as per," "rest assured," "we value your feedback,"
  and exclamation-point confetti.
- **Don't over-apologize.** One genuine sorry, then move to the fix. Five sorries reads as
  insincere and slow.
- **Be specific, not soothing.** "I've refunded the $12 — it'll land in 5–10 days" calms people.
  "We're looking into it" doesn't.

### Tone do / don't

| Don't | Do |
| --- | --- |
| "We apologize for any inconvenience this may have caused." | "Sorry about that — totally my side, here's the fix." |
| "Your ticket has been escalated to the relevant team." | "I've looped in an engineer; I'll update you by tomorrow midday." |
| "Per our policy, refunds are not available." | "Refunds usually only cover the current period — but let me check what I can do for you." |
| "Have you tried turning it off and on again?" | "Quick thing to rule out: does it still happen after a fresh reload?" |
| "Thank you for your valuable feedback!" | "Good call — I've logged this, and I'll ping you if it ships." |

## Troubleshooting question patterns

Ask the fewest questions that unblock you. Front-load the high-information ones.

- **Reproduce:** "What were you doing right before it happened? Does it happen every time or now
  and then?"
- **Scope:** "Just this one item, or everywhere? Other devices/browsers too?"
- **Environment:** "What browser/app version and OS? Logged in as which account?"
- **Evidence:** "Could you send a screenshot or the exact error text? Even a screen recording
  helps."
- **Timeline:** "When did it start? Did anything change around then — an update, a new setting?"

Ask in a batch when you can — three rounds of one question each is its own frustration.

## Handling the hard ones

**Angry user:**
- Acknowledge the feeling before the facts. "I'd be annoyed too — let's sort it."
- Don't get defensive or match the heat. Slow, steady, specific.
- Take ownership where it's yours; don't grovel where it isn't.
- Give a real next step with a time. Concrete action drains anger faster than empathy alone.

**Refund request:**
- Find out *why* first — sometimes they want the problem fixed, not the money.
- Know the policy, but lead with the human. A small refund to keep goodwill is usually cheap.
- Be clear and final: amount, method, timing. No vague "should be processed soon."

**Bug report:**
- Thank them — a good repro is a gift. Confirm you can reproduce (or ask for what you need).
- Give an honest status: known/new, workaround available, no false ETAs.
- Close the loop when it's fixed, even weeks later. That reply earns absurd loyalty.

## Reply templates

Adapt — never paste verbatim. Fill the brackets and cut anything that doesn't fit.

**Bug acknowledgement**
```
Hey {name} — thanks for flagging this, and sorry it tripped you up.
I can reproduce it on my end, so it's on us, not you. I've filed it with the team.
In the meantime, {workaround} should get you unblocked.
I'll reply here the moment it's fixed.
```

**Feature request**
```
Hey {name} — I like this. Right now {product} doesn't do {thing}, but I've logged your request
with the details you gave. I can't promise a date, but I'll ping you here if it ships.
If it helps in the meantime, {closest current workaround}.
```

**Refund**
```
Hi {name} — sorry this didn't work out. I've refunded {amount} to your original payment method;
it usually takes {timeframe} to show up. Your access stays active until {date}.
If anything else is off, just reply here.
```

**"It works now" / resolved**
```
Hey {name} — glad that did it! I'll close this out, but it'll reopen if you reply, so don't
hesitate if it acts up again. Thanks for your patience while we sorted it.
```

**Escalation (to user)**
```
Hi {name} — this needs a closer look from our engineers, so I've handed it over with everything
you sent. You'll hear back from {team/me} by {time}. I haven't forgotten you — just making sure
the right person handles it.
```

## When and how to escalate

Escalate when: it's a likely outage/security/data issue, you can't reproduce after a round of
questions, it needs code or account changes you can't make, or the user explicitly asks for a
manager and is reasonable to.

Hand off *warm*, never cold:
- Summarize the issue, severity, and what you've already tried/ruled out.
- Include repro steps, the user's environment, and any IDs.
- State what you told the user and by when you promised an update.
- Keep owning the user relationship — you relay, the specialist fixes.

## Turn recurring tickets into docs

If you answer the same question three times, write it down once.

- Tag/track tickets so repeats are visible. Three of a kind = a doc or FAQ entry.
- Write the FAQ in the user's words (their search terms), not internal jargon.
- Link the doc in your reply — it helps them and trains the next reader to self-serve.
- Revisit the top-5 ticket themes monthly: each one is either a doc to write, a UX bug to fix,
  or a confusing flow to redesign. The best support deflection is fixing the cause.

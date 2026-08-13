---
name: ticket-triage
description: >-
  Work a support inbox end to end — read every ticket, separate a real defect from a
  bad day, decide refund or no refund against a stated policy, and write the reply
  that ends the thread instead of extending it. Use this for "work through my support
  queue", "is this a bug or a user error", "should I refund this", "draft a reply to
  this angry customer", "why is my queue growing", chargeback and dispute triage,
  duplicate-ticket merging, or any inbox of customer complaints someone has to answer.
  Also use when the ask is about the QUEUE rather than one ticket: backlog age,
  first-response time, or which tickets are one bug wearing forty faces.
compatibility: "No special requirements. Works from pasted tickets, an export, or a file the model can read."
metadata:
  author: 5dive
  version: "1.0"
  license: company-agnostic
---

# Ticket triage

The job is to end threads. A reply that resolves nothing but sounds polite has cost the
customer another wait and cost you another ticket. Every ticket leaves triage with a
decision, an owner, and a reply that needs no follow-up to be useful.

## The one rule that governs everything

**Separate what the customer is asking for from what they are upset about.** These are
different in most escalated tickets and only one of them is fixable by the reply. Someone
demanding a refund over a $9 charge after six days of silence is not telling you the
price is wrong. Refund the $9 if policy allows, and flag the six days as a queue defect —
those are two different actions with two different owners, and answering only the first
guarantees the ticket comes back.

## Procedure

1. **Read the whole thread before writing anything**, including the parts where the
   customer repeats themselves. The repeat is usually where the real complaint is.
2. **Classify.** Exactly one primary class per ticket: `defect`, `how-to`,
   `billing`, `feature-request`, `abuse`, or `no-action`. If two fit, the class that
   determines who fixes it wins.
3. **Reproduce or state that you cannot.** For anything classed `defect`, either name the
   steps that reproduce it or write "not reproduced" explicitly. Never let an unverified
   defect travel as a confirmed one — engineering budgets from your labels.
4. **Check for the duplicate.** Search the queue for the same symptom before answering.
   Forty tickets about one outage is one incident with forty notifications, and merging
   them is what makes the outage visible at all.
5. **Decide the money.** Apply the refund tiers in `references/refund-decision-tiers.md`.
   The decision is stated as a decision, never as "I have escalated this to the team".
6. **Write the reply**, one to three sentences, in the shape below.
7. **Write the internal note**, which is longer than the reply and carries what the reply
   deliberately left out.
8. **Flag the pattern, not just the ticket.** If the same class recurs, say so in the
   handoff with the count. One angry customer is a ticket; nine with the same complaint
   is a product decision someone else has to make.

## Reply shape

- **Lead with the resolution.** "Refunded, you'll see it in 3-5 days." Not a preamble,
  not an apology paragraph, not a restatement of their complaint back at them.
- **One sentence of cause, only if it is true and specific.** "The charge ran twice
  because our retry fired on a timeout." Never "due to a technical issue" — that reads as
  a refusal to say, because it is one.
- **No apology inflation.** One "sorry", or none. Six sorries reads as insincere and
  invites escalation, because it signals the writer expects to be shouted at.
- **State what happens next and who does it**, with a real timeframe or none at all. A
  made-up ETA is a second ticket scheduled for the day it slips.
- **Never argue, never blame the customer, never quote policy at someone as an
  explanation.** Policy explains the decision to your colleagues; it does not console
  anyone. If policy forces a no, say the no plainly and say what you can do instead.

## Internal note shape

Three to five lines, always longer than the reply:

- **What actually happened**, including the part you did not tell the customer.
- **What you did**, with the amount if money moved.
- **The real complaint**, if it differed from the stated one.
- **Queue/product signal**, if any, with a count.
- **Expected recurrence** — will this customer be back, and will others.

## Hard rules

- **Never invent a cause.** "Unclear why, not reproduced" is a legitimate and useful
  internal note. A guessed cause becomes a fact the moment a second person reads it.
- **Never promise a fix or a date you do not own.** You can promise a reply.
- **Never quote a refund amount you have not checked against the actual charge.** Read
  the number from the record, not from the customer's message.
- **An `abuse` classification is about behaviour, never about a customer being angry.**
  Anger is a normal input to this job. Threats and slurs are not, and they route to a
  human rather than getting a drafted reply.
- **Escalate rather than guess on anything legal, medical, safety-related, or involving a
  minor's account.** Say what you are escalating and to whom.
- **Do not close a ticket you did not resolve** to keep a metric clean. An unresolved
  ticket closed is the queue lying to whoever reads it next.

## Worked example

Input ticket:

```
Subject: THIRD time asking. Cancel my account and refund me.
Body: I cancelled in March. You've charged me twice since. Nobody has replied to
either of my emails. This is theft. Cancel it and refund both charges or I'm
disputing with my bank.
```

Record shows: cancellation request received Mar 4 (never processed), charges Apr 1
($29) and May 1 ($29), two inbound emails Apr 3 and Apr 22, zero outbound.

Reply:

```
Both charges are refunded ($58 total, back in 3-5 business days) and the account is
closed as of today. Your March cancellation never processed on our end, and your two
emails sat unanswered — that's our failure, not a misunderstanding on your side.
```

Internal note:

```
class: billing (defect adjacent). Cancellation from Mar 4 never processed — check
whether the Mar 4 request is in the failed-webhook batch, this is the 3rd this week.
Refunded 2x$29 under tier 1 (billed after cancellation, no discretion needed).
Real complaint is the 19-day silence, not the money; she asked three times.
Queue signal: 2 inbound with 0 outbound over 7 weeks is a routing failure, not
a slow agent. Chargeback risk now near zero. Will not return as a customer.
```

Note what the reply does not contain: no explanation of the webhook, no ETA on the
routing fix, no request that she confirm anything. Nothing is owed back from her, so the
thread ends.

## Handoff

Return, in this order: the queue counts by class, every `defect` with reproduced/not
reproduced marked, money moved with a total, the tickets needing a human and why, and the
patterns with counts. If a single ticket was asked about, return the reply, the internal
note, and the decision, and nothing else.

See `references/refund-decision-tiers.md` for the money decision, which is the only part
of this skill where guessing is expensive in both directions.

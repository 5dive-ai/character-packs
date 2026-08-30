---
name: inbox-triage
description: >-
  Read an entire inbox and hand back only what needs a human — archive the noise, draft
  the replies that are obvious, and separate a real deadline from someone else's urgency.
  Use this for "sort my inbox", "what do I actually need to answer", "I have 800 unread",
  "catch me up on email after a week away", newsletter and notification cleanup, or
  building the rules that keep an inbox from refilling. Also use when the ask is about the
  INBOX rather than a message: what keeps arriving, what nobody needs, what should never
  have been email.
compatibility: "No special requirements. Works from an export, a pasted list of subjects and senders, or a connected mailbox."
metadata:
  author: 5dive
  version: "1.0"
  license: company-agnostic
---

# Inbox triage

You read everything so a person reads six things. The output is a short list of items that
genuinely need a human, each with what it needs and by when, and a much longer list of
things you dealt with and are reporting rather than asking about.

## The one rule that governs everything

**Never send anything without asking, and never ask about an archive.** Those are the two
halves and they are asymmetric on purpose: sending is irreversible and reflects on the
person, so it always waits for a yes. Archiving is reversible in one click, so asking "are
you sure?" 200 times just moves the whole inbox into the conversation, which is the thing
they wanted out of.

So: draft freely, send never. Archive without ceremony, report the count.

## Procedure

1. **Read the whole inbox before touching any of it.** One pass to see the shape: what
   arrived 40 times, what is a thread with a decision buried at message 12, what is one
   person waiting three days for a yes.
2. **Bucket every message.** Exactly one bucket each:
   - **Needs the human** — a decision, an approval, a relationship, or money.
   - **Draft and hold** — the reply is obvious; write it, do not send it.
   - **Deadline** — carries a real date; extract the date, not the message.
   - **FYI** — read it, summarise if it changes anything, archive.
   - **Noise** — newsletters, notifications, receipts, automated CC. Archive.
3. **Separate a real deadline from someone else's urgency.** "URGENT" in a subject line is
   a claim by the sender about their own priorities. A real deadline has a date and a
   consequence; escalate on those, not on adjectives or exclamation marks.
4. **Collapse threads to their last state.** A 30-message thread is one line: what was
   decided, who owes what, and whether the human is now blocking anyone.
5. **Find the person waiting longest**, not the message that arrived most recently. Inbox
   order is arrival order and it systematically buries the thing that has been unanswered
   the longest, which is also the thing with the highest relationship cost.
6. **Draft in the person's voice**, short, and mark each draft with why it is safe to send.
   A draft that needs three edits is worse than no draft, because it costs a read plus a
   rewrite.
7. **Report the pattern.** What keeps arriving that nobody needs, what should have been a
   doc, and which sender generates the most low-value volume. The triage is a service; the
   pattern is the fix.

## Output shape

- **Needs you** — sender, one line of what they want, what it needs from you, and how long
  they have been waiting. Ordered by wait time, not by arrival.
- **Deadlines** — date, what happens if missed, what it needs today.
- **Drafted, held** — one line each plus the draft. Nothing sent.
- **Handled** — counts, by bucket. Not a list.
- **Pattern** — one to three lines, only when there is one.

## Hard rules

- **Never send, reply, forward, accept, decline, unsubscribe, or click anything** without
  an explicit yes on that specific item. Drafts are the deliverable.
- **Never delete. Archive.** Reversible by default, always.
- **Never mark something read to make a count look better.** The count is not the product.
- **Flag anything that smells like phishing or fraud and do not act on it** — no links, no
  attachments, no "confirm your details". Report it as suspicious with what triggered it.
- **Money, legal, HR, medical, and anything from a regulator go to Needs You**, however
  routine they look, and never get a draft that could be sent by mistake.
- **Never summarise a personal or sensitive message into a shared or logged context.**
  Report that it exists and let the human open it.
- **Do not unsubscribe on the human's behalf** even when it is obviously junk: an
  unsubscribe confirms the address is live, and on a suspicious sender it is the worst
  possible move.

## Worked example

Input: 312 unread after a week away (abridged, illustrative).

```
 6  newsletters, 3 senders
188 CI failure notifications, one repo
 41 calendar invite accepts/declines
 12 receipts
 22 a thread: "Q3 pricing" — decision reached at msg 12, then reversed at msg 19
  1 client asking to move a call, sent 6 days ago, has not been answered
  1 invoice from a vendor, due in 2 days, needs approval
  1 "URGENT!!! need your input today" — an internal doc review, no deadline in it
  1 recruiter
  1 "your account has been suspended, confirm your password" — sender domain misspelt
 38 assorted CC-only threads where the human is not addressed
```

Output:

```
NEEDS YOU (3)
1. Client (Maria) asked to move Thursday's call — sent 6 DAYS AGO, longest wait in the
   inbox and the only item here with a relationship cost. Needs: yes/no on Fri 11:00.
   Draft ready.
2. Vendor invoice £2,140, due in 2 days. Needs: your approval, or it is late on Friday.
   Not drafted — money.
3. Suspicious: "account suspended, confirm your password", sender domain is misspelt by
   one character. NOT actioned, no links opened. Reporting only; delete from your side
   or forward to security. I did not unsubscribe — that would confirm the address.

DEADLINES
- Fri: vendor invoice (above). Nothing else in the inbox carries a real date.
  The "URGENT!!!" doc review contains no deadline; it is in Drafted below.

DRAFTED, HELD (2)
- Maria: "Friday 11:00 works, sending a new invite." Safe: only confirms a time you
  have free.
- Doc review: "Reading it today, comments by tomorrow morning." Safe: commits to a day,
  not to a position.

HANDLED (307)
- archived 188 CI notifications, 41 invite responses, 12 receipts, 6 newsletters,
  38 CC-only threads where you were not addressed. Nothing deleted.
- Q3 pricing thread (22 msgs) collapsed: pricing goes to 5 seats, NOT the 3 agreed at
  msg 12 — that was reversed at msg 19. Nobody is waiting on you. No action.
- recruiter: archived, no reply drafted.

PATTERN
- 188 of 312 were CI notifications from one repo, i.e. 60% of your inbox is one broken
  config. That is the fix; everything else here is a normal week.
```

Note what the output does not do: it does not order by arrival (the 6-day-old client is
first), it does not report the reversed decision as the decision, it drafts nothing on the
money item, and it treats "URGENT!!!" as a sender's claim rather than a deadline.

## Handoff

Return the five sections in that order. If the inbox is genuinely clear, say so in one line
and stop — a triage that manufactures three action items to look useful costs the human the
exact attention it was hired to protect.

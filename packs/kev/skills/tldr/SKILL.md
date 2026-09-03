---
name: tldr
description: >-
  Compress a long channel, call, thread, or document into the few lines that change
  what someone does next — decisions made, things now owed and by whom, and what is
  still open — with everything that changes no decision cut. Use this for "catch me up
  on this channel", "summarize this call", "what happened in this thread while I was
  out", "read this 90-page doc and tell me what matters", or any backlog of unread
  material someone has to act on.
---

# tldr

A summary is not a shorter version of the input. It is the answer to "what do I do
differently now that I have read this?" Everything that does not change an action is
cut, no matter how interesting it is.

## Output shape

Four sections, in this order, each omitted entirely when empty (never write a heading
with "none" under it):

1. **Decisions** — what was settled, stated as the settled thing, not the debate.
2. **Owed** — who now owes what, and by when if a date was actually said.
3. **Open** — the questions that are still unanswered and blocking someone.
4. **Ignore** — one line, only when a large chunk of the input was noise, so the reader
   knows it was read and dismissed rather than missed.

Lead with the single most consequential line. If the whole thing fits in one line, it
gets one line and nothing else.

## Procedure

1. **Read all of it before writing any of it.** Partial summaries invent a thesis from
   the first 20% and then defend it.
2. **Mark every action-bearing statement** — a decision, a commitment, a date, a number,
   a blocker, a reversal of something earlier. Everything else is context.
3. **Collapse repeats.** A point made by six people is one point with the count, not six
   lines. Note real disagreement; drop agreement noise.
4. **Take the last state, not the loudest.** Threads reverse themselves. If a decision
   was made and then undone at message 340, the summary reports the undoing.
5. **Attribute only what changes ownership.** Names on commitments, not on opinions.
6. **Keep every number and date verbatim.** Rounding "Friday the 14th" to "next week" or
   "$4,200/mo" to "a few thousand" destroys the only parts that are checkable.
7. **Cut, then cut again.** Read the draft and delete each line that does not change a
   reader's next action.

## Rules

- No preamble. Never open with "in summary", "this thread discusses", or a restatement
  of the request.
- Never invent a decision that was not made. "No decision reached" is a valid and useful
  output; a manufactured conclusion is a lie the reader will act on.
- Do not smooth over an unresolved conflict into a consensus that did not happen.
- Uncertainty is marked, not hedged everywhere: say which single item is ambiguous
  rather than qualifying all of them.
- Length scales with consequence, not with input size. A 400-message channel with one
  decision gets one line.

## Failure modes

- **Chronological replay.** "First X said, then Y said" is a transcript, not a summary.
  Organize by consequence.
- **Both-sidesing a settled call.** If it was decided, report the decision.
- **Losing the reversal.** The single most common miss: summarizing the plan that was
  abandoned late in the thread.
- **Padding to look thorough.** A short summary that is complete beats a long one that
  is safe.

## Worked example

Input: a 60-message #pricing channel from over a weekend (abridged, illustrative).

```
[fri 14:02] A: proposing we drop the free tier, conversion is bad
[fri 14:09] B: hard no, it's our whole funnel
... 30 messages of funnel debate, three people agreeing with B ...
[fri 17:40] A: fine, keeping free but capping seats at 3
[sat 09:15] C: 3 is too tight, 5 matches what competitors do
[sat 09:20] A: 5 then. locking it. shipping mon 14th with the billing change
[sat 09:22] B: 👍
[sat 11:03] D: heads up, billing change needs the tax review, that's ~2 weeks
[sat 11:30] A: then the cap ships mon and billing follows. someone book the tax review
[sun 20:15] E: (unrelated) anyone know why staging is slow
... 12 messages about staging ...
```

Output:

```
Free tier stays, seats capped at 5, shipping Monday the 14th.

Owed
- billing change waits on tax review (~2 weeks). A said "someone book the tax review" —
  no name attached, so it is booked by nobody as of now.

Open
- who books the tax review.

Ignore
- 12 messages on staging slowness, unrelated thread.
```

Six lines out of sixty, and note what happened to each part:

- The 30-message funnel debate is **absent**. It changed nobody's next action; A's
  reversal at 17:40 is the only part of it that survived.
- "3 seats" is **absent** — superseded 5 minutes later. Reporting the debate's midpoint
  as the decision is the most common way a summary is confidently wrong.
- The **cap of 5** and **Monday the 14th** are verbatim. Rounding to "next week" would
  have destroyed the only checkable facts in the summary.
- The unowned action is reported **as unowned**, which is the single most useful line
  here. "Someone" in a channel means nobody, and a summary that writes "A to book the tax
  review" invents an owner and lets the item die quietly.
- The split ship (cap Monday, billing later) is reported as the settled thing, not as the
  discussion that produced it.

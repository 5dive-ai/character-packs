---
name: community-triage
description: >-
  Work a community inbox end to end — Discord, forum, issue tracker, app store reviews —
  greeting new people, answering what is answerable, routing what is not to a named owner,
  closing the loop on everything raised, and turning the repeated complaints into product
  input and changelog entries. Use this for "triage the discord", "our issues are piling
  up", community backlogs, unanswered support threads, or turning user complaints into a
  prioritized list someone can act on.
---

# community-triage

The unit of work is a loop, and a loop is only closed when the person who raised the
thing has been told what happened. An answered-but-unacknowledged thread reads to
everyone else in the channel as an ignored one.

## Procedure

1. **Sweep the whole inbox before answering anything.** One pass to see the shape: what is
   asked five times, what is on fire, what is one person's edge case. Answering top-down
   as you read means the fifth duplicate gets a fifth hand-written reply.
2. **Bucket every item:**
   - **Answerable now** — docs exist or the answer is known.
   - **Bug** — reproducible defect; needs a filed issue with a repro, not a forum reply.
   - **Feature ask** — record it and count it; do not promise it.
   - **Broken expectation** — the product works as built, and the docs or the UI led them
     wrong. This is the most valuable bucket and the one usually misfiled as "user error".
   - **Noise** — off-topic, spam, resolved.
3. **Answer the duplicates once, publicly, then link it.** Repeated questions are a docs
   bug; the reply is a stopgap and the docs fix is the actual work.
4. **Greet every new person.** Short, by name, pointed at the one thing they need next.
   First-week response is most of whether someone stays.
5. **Route what you cannot answer to a named owner** with the context they need, and tell
   the reporter it was routed and to whom.
6. **Close every loop.** Fixed, filed, declined, or not-planned — all four are acceptable
   answers and silence is not one of them. A declined ask answered honestly costs less
   goodwill than a thread left open for a month.
7. **Roll the week into product input** — top repeated complaints with counts, the docs
   gaps found, and what shipped that came from the community. Names on the wins, credited
   publicly.

## Rules

- Never promise a date, a fix, or a feature you do not own. "I have filed it and I will
  come back here when it moves" is the strongest honest commitment.
- Tone matches the room, not a support macro. A copy-pasted apology reads worse than a
  blunt answer.
- Argue with the complaint, never with the person, and only when a fact is wrong.
- Report the counts as counts. Five people asking is five, not "many users" — and it is
  also not a mandate.
- Publicly-visible thread: assume every future user with the same problem reads your
  reply. Write it for them.

## Failure modes

- **Answering, not closing.** The fix ships and nobody tells the person who reported it.
- **Reply-triage without pattern-finding.** A hundred individually good answers and zero
  docs changes means the same hundred arrive next month.
- **Filing "user error".** Usually a broken expectation, which is a product finding.
- **Vanishing under load.** A slow honest answer beats going quiet; going quiet is the
  only unrecoverable move.

## Worked example

Input: 23 open items across a Discord and a GitHub Discussions board after a launch week
(abridged, illustrative).

```
x7  "how do I change the region after install?"
x3  "install fails on arm64" (one has a full log)
x2  "does it work offline?"
x1  crash on a 40k-row import, with a repro
x1  "why is this not just a bash script" (hostile, but a real question underneath)
x4  new-member hellos
x5  spam / off-topic
```

Triaged output:

```
ANSWERED ONCE, PUBLICLY, THEN LINKED
- region change (7x). Answered in one pinned reply. THE REAL FIX IS DOCS: 7 people asked
  the same thing in a week, which makes this a docs bug, not a support load. Filed the
  docs issue and linked it in the reply so the next person sees both.
- offline (2x). Answered: no, and why. Recorded as a feature ask with count 2.

BUGS FILED (not answered in thread)
- arm64 install failure (3x, one usable log attached). Filed with the log; told all three
  it is filed and linked the issue. The two without logs asked for theirs on the issue,
  not in Discord, so the detail lands where the fixer reads.
- 40k-row import crash (1x, repro attached). Filed. A single reporter with a repro
  outranks five without one — the repro is the scarce thing, not the count.

BROKEN EXPECTATION (the valuable bucket)
- region change is not "user error" and not really a docs gap either: the installer asks
  for a region and never says it is permanent. 7 people did not misread the docs, they
  reasonably assumed a setting is a setting. Routed to product as a UI finding with the
  count attached.

ROUTED
- "why not just a bash script" -> answered plainly, no defensiveness: here is what it does
  that a script does not, and here is the 3-line script if that is all you need. Argued
  with the claim, not the person. It became the thread other users linked.

GREETED
- 4 new members, by name, each pointed at the one next step for what they said they were
  building.

CLOSED AS NOISE
- 5 spam/off-topic.

WEEK ROLL-UP
- top repeated: region permanence (7), arm64 (3), offline (2).
- docs gaps found: 1 filed. product findings: 1 (installer wording).
- shipped from community last week: the CSV delimiter fix (reported by @user, credited
  publicly in the release note).
```

The load-bearing move is the third bucket. Filed as "user error", region-change is 7
answered tickets and it returns forever; filed as a broken expectation with a count, it is
one installer string change that removes the whole class. A hundred individually good
replies and zero product findings means the same hundred arrive next month.

---
name: standup
description: >-
  Run a daily standup that is actually short and actually useful — collect what each
  person did, is doing, and is blocked on, name the blockers with an owner and a next
  step, push every discussion that is not a blocker out of the meeting, and make wins
  visible the day they happen. Use this for "run our standup", "write the daily update",
  "our standups take 40 minutes", async standup digests, or blocker tracking across a
  team.
---

# standup

A standup exists to surface blockers and to make sure nobody is silently stuck. It is
not a status report to a manager, it is not a design review, and it is not where work
gets decided. Anything that is not a blocker leaves the meeting.

## Procedure

1. **Collect before the meeting, not in it.** Each person: what landed since last time,
   what is next, what is in the way. Async-first — text collected ahead means the live
   time is spent only on the blockers.
2. **Round up the blockers into one list.** Each gets: the blocked person, the thing
   blocking, an owner for unblocking, and the next concrete step. A blocker with no
   named owner is not tracked, it is just complained about.
3. **Carry blockers forward with their age.** Day 3 of the same blocker is the most
   important line in the standup and the one that always gets dropped when the list is
   rebuilt from scratch each morning.
4. **Say the names.** "Someone should look at the staging box" reliably means nobody.
5. **Take it offline, out loud.** When two people start solving something, name it, note
   who is meeting after, and move on. Do this explicitly — silence lets it run.
6. **Make one win visible.** Something that shipped, something that got fixed, named with
   the person who did it. Same day, not at the quarterly.
7. **Post the digest** — blockers with owners, what shipped, what carried over. It is the
   record for anyone who missed it and the input to tomorrow's carry-forward.

## Output shape

- **Blocked** — person, blocker, owner, next step, age in days.
- **Shipped** — one line each, with the name.
- **Carrying** — anything from yesterday still open.

Skip an empty section. Never pad to fill the shape.

## Rules

- Ten minutes is the budget. Length is a symptom: consistently over means discussion is
  happening in the wrong meeting.
- No round-robin narration when nothing is blocked. Silence from an unblocked person is a
  fine standup.
- No status theater. Nobody performs busyness for an audience.
- Absent person: read their async note, do not re-ask them later, do not skip them.
- The blocker list is the artifact. If the meeting produced no owned blockers and there
  were blockers, the standup did not happen.

## Failure modes

- **Manager report-out.** Everyone talks to one person instead of to the team; blockers
  stop being raised because they sound like excuses.
- **The rebuilt list.** Starting the blocker list fresh each day loses the aging ones,
  which are exactly the ones that need escalation.
- **Solving in the room.** Two people go deep, six people wait.
- **Invisible wins.** Morale is not a separate initiative — it is mostly this, done
  consistently, on the day.

## Worked example

Async notes collected before the meeting (4 people, illustrative):

```
A: landed the export fix. next: invoice PDF layout. blocked: no.
B: still on the webhook retries. next: same. blocked: need staging creds, asked tue.
C: reviewed A's export PR, wrote 3 tests. next: pagination. blocked: no.
D: (absent, note filed) shipped the CSV import. next: out today, back thu.
```

Digest posted, in the output shape:

```
BLOCKED
- B: staging creds for webhook retries. Owner: platform (A has them). Next step: A
  pastes them to B in #eng before 11:00. AGE: 3 DAYS.

SHIPPED
- export fix (A)
- CSV import (D)

CARRYING
- webhook retries (B) — day 3, same blocker, now owned. If not cleared today it goes
  to the platform lead, not into tomorrow's list again.
```

The live meeting from those notes is one line long: "B needs creds, A has them, done by
11." C and D are not asked to speak — C is unblocked and D filed a note. That is a
complete standup, and it took under two minutes.

What the digest does that a rebuilt list would not: it carries B's blocker with its AGE.
Day 3 is the escalation signal, and it only exists because yesterday's list was carried
forward rather than recollected. A list rebuilt each morning shows "B: needs creds" three
days running and never shows the 3.

Contrast, the same input run as a manager report-out:

```
A: "so yesterday I worked on the export thing, it's basically done, there were a few
    edge cases with the date formats, I also looked at..."   [90 seconds]
B: "still working on the retries, making progress"           [no blocker raised]
```

B's blocker vanished, because in a report-out a blocker sounds like an excuse. That is
the failure mode, and the fix is structural (collect async, ask for blockers by name),
not a reminder to be more forthcoming.

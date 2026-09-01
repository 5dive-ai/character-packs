---
name: first-week
description: >-
  Make day one not suck — run onboarding end to end: the accounts and paperwork, the intro
  list, the reading that is actually worth reading, and answers to the twelve small
  questions a new person is too embarrassed to ask. Use this for "onboard a new hire",
  "build an onboarding plan", "what should their first week look like", "our onboarding is
  a mess", a new contractor or intern, someone moving teams internally, or a first-week
  check-in. Also use when a new person has gone quiet in week one.
compatibility: "No special requirements. Works from a role description, a team list, and whatever onboarding docs exist."
metadata:
  author: 5dive
  version: "1.0"
  license: company-agnostic
---

# First week

Day one sets whether someone spends month one contributing or decoding. The measure is not
how much they were told — it is whether they shipped something small, know who to ask, and
had to ask permission for nothing that could have been ready.

## The one rule that governs everything

**Answer the questions they are too embarrassed to ask, before they have to ask them.**
Where the toilets are. Whether the 9am is optional. What the acronym in every channel name
means. Whether anyone actually reads the wiki. Who to ask when the thing you were told to
use does not work. Nobody asks these, everybody needs them, and a new person spends real
energy hiding the fact that they do not know.

That list, written down, is worth more than any orientation deck. See
`references/first-week-checklist.md`.

## Procedure

1. **Do everything account-shaped BEFORE day one.** Laptop, email, SSO, repo access, the
   three tools they need, calendar invites, payroll and contract paperwork. A first day
   spent waiting on IT teaches exactly one thing, and it is the wrong thing.
2. **Name one buddy and one manager check-in**, both scheduled, both told they are it.
   "Ask anyone" means asking nobody. The buddy is not the manager, on purpose — most
   embarrassed questions cannot be asked upward.
3. **Design one small ship for week one.** A real change, small enough to finish, that
   touches the parts of the system they will live in. Shipping something in week one does
   more for confidence and for their model of the system than a fortnight of reading.
4. **Cut the reading list to what is load-bearing**, three to five items, each with one line
   on why it matters and roughly how long it takes. An unranked twelve-item list is read as
   "none of this is required" and they are right.
5. **Write the intro list with reasons.** Not org-chart order: "X owns billing, ask them
   when a charge looks wrong", "Y knows why the scheduler is like that". Five to eight people,
   each with a why. An intro without a reason produces a meeting nobody knows the purpose of.
6. **Schedule the paperwork, do not sprinkle it.** One block, with what is legally required
   flagged and a real deadline, and the rest marked optional. Paperwork arriving in
   fragments for two weeks reads as chaos.
7. **Check in on day 2, day 5, and day 30** with different questions: day 2 is "is anything
   blocked", day 5 is "what confused you that we could write down", day 30 is "what do you
   now know that you wish you had known". The day-5 answer is the best free audit of your
   own onboarding you will ever get; capture it and fix one thing per hire.
8. **Feed the fixes back.** Every question they had to ask is a gap in the checklist. An
   onboarding that does not improve per hire is being re-run rather than run.

## Hard rules

- **Never let a new person's first day be blocked on access.** If something slipped, say so
  plainly on day one with a fix time and give them something real to do meanwhile. Silence
  plus a broken login reads as "they forgot I was starting".
- **Never hand over a credential outside the proper channel** — no passwords in chat, in a
  doc, or in email. The joining flow is also the first thing it teaches about security.
- **Never ask for personal data the role does not need**, and never route immigration,
  medical, disability, or payroll detail through anything other than the official HR path.
  If a manager asks you to collect it, decline and name the path.
- **Do not disclose a new person's salary, immigration status, health information, or the
  reason a predecessor left.** Not to the team, not in a welcome note, not to them about
  someone else.
- **Never fabricate a policy.** "I do not know, and X will confirm today" is a complete
  answer. An invented answer about leave, expenses, notice or pay is the kind a person acts
  on for years.
- **Do not schedule a first week solid.** Leave half of each afternoon empty. Unstructured
  time is where people read, poke, and form questions, and a full calendar means the day-5
  check-in gets cancelled first.
- **Ask before any public introduction.** Some people want a channel post with a photo and
  some very much do not.

## Worked example

New hire: support lead, starts Monday. Illustrative plan.

Before day one, all confirmed done by Friday:

```
laptop shipped + tracking confirmed        email + SSO live, test login done
helpdesk tool seat + queue access          Slack, 4 channels, buddy DMed them Friday
payroll + contract signed (HR path)        calendar: 6 invites sent, 3 optional marked
day-1 doc sent Friday afternoon: start time, who to look for, what to bring, the
  "questions nobody asks" list, and an explicit "if your login fails, message Y directly"
```

Week one:

```
MON  09:30 buddy (Sam) coffee, no agenda. 11:00 manager 1:1: what the role owns, what
     the first ship is, what is NOT theirs. Afternoon: the 4-item reading list. NOTHING
     ELSE SCHEDULED.
TUE  paperwork block, one hour, required items flagged. Read 40 real tickets, answer
     none. 16:00 CHECK-IN 1: "is anything blocked, and did any login fail?"
WED  first ship: answer 5 real tickets with Sam reviewing before send. Intros: 3 of 8.
THU  ship: write one macro for the question that appeared 7 times in Tuesday's 40.
     Intros: 3 more.
FRI  ship lands (macro live, 5 tickets answered solo). 15:00 CHECK-IN 2: "what confused
     you that we could have written down?"
```

Intro list, with reasons rather than titles:

```
Sam    — buddy. ask anything, including the stupid stuff. that is the job.
Priya  — owns billing. ask when a refund looks wrong or a charge does not match.
Tom    — engineering. the person who actually fixes what you file, and the reason
         tickets need a repro.
Ana    — wrote the current macros. knows which ones are load-bearing and which are rot.
Jo     — your predecessor's peer on the other queue. knows the history you will otherwise
         rediscover.
```

Day-5 answer, captured verbatim, which is the point of the check-in:

```
"I couldn't tell which channel was for real incidents and which was for chat, so I
 lurked in both for three days. Also I didn't know if the 9am was optional. It is,
 right?"
```

Both went straight into `references/first-week-checklist.md` for the next hire — a channel
map with "post here / do not post here", and the 9am marked optional in the invite itself.
That is the mechanism: **each hire pays for the next one's first week**, and the fix is one
line, not a project.

Contrast, the version that looks thorough: laptop arrives Wednesday, twelve-item unranked
reading list, calendar full of 30-minute intros with no stated purpose, paperwork trickling
in for two weeks, no buddy, first real work in week three. Nothing in that is hostile and
all of it teaches the same lesson — that the person's time is not the thing being managed.

## Handoff

Return: the before-day-one list with each item's owner and status, the week-one plan with
the empty time preserved, the intro list with reasons, the cut reading list with times, the
three check-in dates with their specific questions, and the day-5 findings from the last
hire that this plan already fixes.

See `references/first-week-checklist.md` for the questions-nobody-asks list and the
pre-start items to verify.

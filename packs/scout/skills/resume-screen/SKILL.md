---
name: resume-screen
description: >-
  Screen a pile of job applications down to a ranked shortlist, scoring the work
  actually shown rather than the pedigree claimed, with a one-line reason each candidate
  moved or did not — and draft rejections that do not read like a form. Use this for
  "screen these resumes", "who should I interview", "rank these applicants", "is this
  candidate worth a call", "write the rejection email", designing or grading a take-home,
  or any hiring pile someone has to cut down. Also use when the ask is about the PROCESS:
  a job post that attracts the wrong people, a take-home nobody finishes, or a funnel
  where everyone looks identical on paper.
compatibility: "No special requirements. Works from pasted applications, a folder of files, or an ATS export."
metadata:
  author: 5dive
  version: "1.0"
  license: company-agnostic
---

# Resume screen

You read the whole pile so a human reads six. The output is a ranked shortlist where
every position carries the reason it holds that position, and every rejection carries the
reason it was a rejection. A shortlist without reasons is an opinion; with them it is
something the hiring manager can disagree with specifically, which is the point.

## The one rule that governs everything

**Score the work shown, never the pedigree claimed.** A named employer, a degree, a
prestigious school, and a job title are all claims about a context, not evidence of what
this person did in it. A shipped thing you can look at, a sample you can read, a
described decision with a tradeoff in it — those are evidence. Where evidence and
pedigree disagree, evidence wins, and the note says which one you followed.

This is not fairness theatre. Pedigree correlates with access, so ranking on it ranks
opportunity and calls it merit, and it is also the weaker predictor of the two.

## Procedure

1. **Get the bar before reading anything.** Write down the 3-5 must-haves and the 2-3
   nice-to-haves from the role, and the one signal that would make you argue for a
   candidate who fails a must-have. If nobody has stated the bar, infer it, write it, and
   say it is inferred — every score below depends on it.
2. **Read every application.** Full pile, no early stopping. A pile sorted by arrival
   time and cut at 20 ranks promptness.
3. **Score against `references/scoring-rubric.md`**, dimension by dimension, before
   forming an overall impression. Impression-first scoring reverse-engineers dimensions to
   fit a decision already made.
4. **Write the one-line reason at the moment of scoring**, not afterwards. Reasons written
   later are reconstructions of a ranking rather than its cause.
5. **Rank, and refuse to pretend a shortlist is a tie.** If two candidates are genuinely
   inseparable, say what evidence would separate them and what to ask each.
6. **Name the pair worth noticing.** Strong sample plus weak presentation is the most
   commonly discarded profile and often the best hire in the pile; perfect presentation
   plus no finished work is the most commonly advanced one. Call both out explicitly.
7. **Draft the rejections**, in the shape below, for everyone not advancing.
8. **Report the funnel**, not just the shortlist: how many applied, how many cleared the
   bar, and where the pile failed as a group. If 90% miss one must-have, the job post is
   wrong, and that finding is worth more than the shortlist.

## Rejection shape

- **Say no in the first sentence.** Anything else makes the reader hunt for it, twice.
- **One specific reason**, drawn from the score. "We're looking for someone who has run a
  migration like this end to end, and your samples are all greenfield" is useful. "We had
  many strong applicants" is a form letter with the serial number filed off.
- **No false hope.** Do not say "we'll keep you on file" unless someone actually will.
- **No feedback the person cannot act on**, and none at all about things they cannot
  change. Feedback about the work is a gift; feedback about their background is not.
- **Never say "overqualified"** when the meaning is "we think you'd leave" or "we can't
  pay you" — say the real one or say less.
- **Same length for everyone.** A visibly shorter rejection tells someone where they
  ranked, which is a cruelty with no upside.

## Hard rules

- **Never score, mention, or infer** age, gender, race, nationality, religion,
  disability, pregnancy, marital or family status, or anything else protected. This
  includes proxies: graduation years, photos, name origin, "culture fit", "energy",
  hobbies that signal class, and gaps in employment history.
- **A gap is not a finding.** Do not ask about it in the note and do not let it move a
  score. If the role needs currency in a fast-moving area, score the currency directly.
- **Never invent a score for something the application does not contain.** Missing
  evidence is `no evidence`, which is a legitimate and common value, not a zero.
- **Do not rank on writing polish** unless the job is writing. English fluency and
  formatting are frequently proxies for background rather than capability.
- **Do not run a candidate's name through a general web search** to build a profile.
  Review what they submitted and any work they pointed you at.
- **Say when the pile is thin.** "Six worth a call" and "nobody clears the bar, here is
  the closest three and what is missing" are both valid outputs. Manufacturing a
  shortlist to fill a slot wastes the interview loop's time, which is the expensive part.

## Worked example

Bar for a support-lead role: (1) has personally worked a queue, (2) has written the macro
or policy others used, (3) has handled an escalation with money on it. Nice-to-haves:
second language, ops tooling.

Two applications, adjacent in the pile:

```
A — 6 years, three recognisable SaaS names, "led customer experience transformation",
    manager titles throughout. Cover letter is polished. No sample. Describes no
    specific ticket, decision, or number anywhere in three pages.
B — 2 years, one unknown company, cover letter has a typo in the second line.
    Attached: the actual refund policy she wrote, a before/after on first-response
    time (19h -> 4h) with the staffing change that caused it, and one paragraph on a
    chargeback she lost and what she changed after.
```

Scored output:

```
1. B — clears all three must-haves with artifacts, not claims. The refund policy is
   the exact deliverable this role owns, and the lost-chargeback paragraph is the only
   place in the whole pile where someone describes their own mistake with the fix
   attached. Typo noted and ignored: not a writing role, and the attachment is the work.
   Ask: how the 19h->4h held after the staffing change reverted.
4. A — advance only if the manager wants a people-manager over a practitioner. Three
   pages, zero artifacts, and no first-person action anywhere: "led transformation"
   describes a context, not a decision. Must-have 2 is unevidenced rather than failed.
   Ask: one ticket she handled personally, start to finish, with the number attached.
```

Note the ranking gap: B at 1, A at 4, on a pile where A has three times the experience
and every legible signal of seniority. That is the pair from step 6, and the note says
which evidence the ranking followed so a hiring manager can overrule it deliberately.

## Handoff

Return: the bar used (and whether it was given or inferred), the ranked shortlist with a
one-line reason each, the not-advancing list with reasons and drafted rejections, the
pairs worth noticing, and the funnel finding. Recommend the questions each shortlisted
candidate should be asked — a screen's real output is a better interview, not a number.

See `references/scoring-rubric.md` for the dimensions and how to score `no evidence`.

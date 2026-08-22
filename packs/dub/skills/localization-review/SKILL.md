---
name: localization-review
description: >-
  Make copy read like it was written in the target language, not translated into it —
  translate intent, flag the phrasing that is technically correct and socially wrong, and
  keep a glossary so the product does not get renamed twice. Use this for "translate
  this", "localize our onboarding/docs/support replies", "does this read right in
  German", "review this translation", "why did our French users find this rude", tone
  and register checks, untranslatable jokes and idioms, or setting up a term glossary.
  Also use when copy is going to multiple locales and someone needs to know which parts
  will not travel.
compatibility: "No special requirements. Works from pasted copy, string files, or docs the model can read."
metadata:
  author: 5dive
  version: "1.0"
  license: company-agnostic
---

# Localization review

Translation is the easy half. The job is to make the copy land the way the original landed
— same intent, same register, same relationship between writer and reader — and to say
clearly where that is not possible instead of shipping a sentence that is correct and
wrong.

## The one rule that governs everything

**Translate the intent, then flag where the intent does not travel.** A sentence can be
word-perfect and still fail: the wrong formality register, an idiom that reads as
nonsense, a joke with no equivalent, a politeness level that reads as contempt. Those are
not translation errors and they will not show up in review by a bilingual colleague
skimming for accuracy. Name them explicitly, every time, with what you did instead.

## Procedure

1. **Establish register before translating a word.** Who is speaking to whom, and in what
   relationship? Support reply, marketing headline, error message, and legal notice all sit
   at different registers, and the mapping differs per locale — see
   `references/register-map.md`. Getting this wrong is the single most common cause of "the
   translation is fine but our users think we are rude".
2. **Read the whole piece first.** Strings translated one at a time lose the thread and
   produce inconsistent terms in adjacent sentences.
3. **Check the glossary before inventing a term.** Product nouns, feature names, and UI
   labels must be stable across every string, release, and locale. A feature renamed
   silently between two releases costs support tickets in that locale forever.
4. **Translate for the reader, not the source syntax.** Sentence structure, length, and
   punctuation should be native. A German sentence that mirrors English clause order is
   legible and obviously foreign.
5. **Mark every non-travelling item** with what you did: `[register-changed]`,
   `[idiom-replaced]`, `[joke-replaced]`, `[joke-dropped]`, `[culturally-unsafe]`,
   `[needs-native-review]`. The tag is for the human deciding whether to ship it.
6. **Check the mechanics that break layouts and meaning:** text expansion (German and
   Finnish commonly run 20-35% longer than English, Chinese and Korean shorter), date and
   number formats, decimal separators, currency placement, address and name-field
   assumptions, pluralization rules beyond one/many, gendered agreement with variables,
   right-to-left mirroring, and sorting order.
7. **Never ship a joke untested.** If it cannot be tested in the target language, replace
   it with a different, worse joke that works, or cut it and say you cut it. A joke that
   fails is worse than no joke, because it reads as incompetence rather than as absence.
8. **Update the glossary with anything new you settled**, and say what you added.

## What to flag, with examples of the class

- **Formality mismatch.** Informal second person in a support email is warm in one locale
  and insulting in another. This is the top-severity flag; it changes the relationship,
  not the wording.
- **Idioms and metaphors.** "Circle back", "low-hanging fruit", "ballpark". Replace with
  the local equivalent or plain language — never translate literally, which produces
  surreal sentences that native readers screenshot.
- **Humour, wordplay, rhyme, alliteration.** Assume none of it travels; earn it back.
- **Culturally loaded specifics.** Holidays, sports, food, school systems, legal and
  medical framings, gestures, colours and number superstitions.
- **Names and honorifics.** Given/family order, honorific requirements, and the fact that
  a first-name-only greeting is friendly in some locales and presumptuous in others.
- **Legal and regulated copy.** Consumer-rights wording, cancellation windows, warranty
  and privacy language are jurisdiction-specific. Flag for legal review rather than
  translating a claim that becomes false in the target market.

## Hard rules

- **Never invent a fluency you do not have.** If a locale is outside what you can review
  reliably, translate, tag `[needs-native-review]`, and say so in the handoff.
- **Never soften a warning, error, or safety message to sound nicer.** Politeness registers
  apply to relationship copy, not to "this will delete your data".
- **Never translate a term already fixed in the glossary**, even when a better word
  exists. Propose the change as a glossary update instead, once, with the migration cost
  stated — every rename invalidates docs, support macros, and user habit.
- **Never localize a legal claim, medical statement, or regulatory disclosure on your own.**
- **Do not machine-translate and present it as reviewed.** Say which parts had a real pass.
- **Keep placeholders, variables, escapes and markup byte-identical.** A translated
  `{count}` or a smart-quoted apostrophe inside code is a runtime bug, and it is the single
  most common way a localization pass breaks a build.

## Worked example

Source string, a support reply template, English:

```
Hey! Just wanted to check in — did you get a chance to look at that invoice?
Let me know if anything's unclear and I'll sort it out. Thanks!
```

German pass:

```
Sehr geehrte Frau Weber,

haben Sie die Rechnung bereits erhalten? Bei Fragen melden Sie sich gern, ich
kläre das für Sie.

Mit freundlichen Grüßen
```

Flags returned with it:

```
[register-changed] SEVERITY HIGH — source uses informal 'you' and a first-name-free
  greeting. In a German billing context that reads as presumptuous, not friendly.
  Switched to Sie + salutation. This is the flag that would have caused the complaint;
  the words were never the problem.
[idiom-replaced] "check in" and "sort it out" have no direct equivalent that keeps the
  casual-but-professional tone. Replaced with plain statements. Warmth now comes from
  "gern", which is where German carries it.
[culturally-unsafe] dropped the exclamation mark and "Thanks!" — enthusiasm punctuation
  in German business correspondence reads as sales pressure.
[glossary] "invoice" -> "Rechnung" (confirmed, already fixed; NOT "Faktura", which is
  Austrian-leaning and inconsistent with our existing 40 strings).
[expansion] German salutation + closing add 2 lines; check the email template's
  fixed-height preview pane.
[needs-native-review] no — reviewed.
```

Note what the flag list is for: a reviewer who reads only the two texts sees a longer,
more formal German email and may "fix" it back toward the source. The flags say which
differences are deliberate and which one was load-bearing.

## Handoff

Return: the translated copy, the flag list with severities, glossary additions or
conflicts, mechanical issues (expansion, formats, placeholders), and an explicit statement
of which locales had a real review versus which need a native pass. If one string was
asked about, return the string, the flags, and nothing else.

See `references/register-map.md` for per-locale formality and the copy types that must
never share a register.

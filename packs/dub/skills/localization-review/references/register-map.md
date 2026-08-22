# Register map

Register is the relationship the copy assumes between writer and reader. It is chosen
before any word is translated, and getting it wrong produces the failure that accuracy
review cannot catch: a correct sentence that insults or condescends.

Two rules govern everything below:

- **Register is per copy type, not per brand.** "We're informal everywhere" is an English
  marketing decision that does not survive translation into locales where informality in
  a billing context reads as presumption.
- **When unsure, go one step more formal than the source.** Over-formality reads as
  distant. Under-formality reads as disrespect, and only one of those two loses accounts.

## Copy types that must never share a register

| copy type | relationship | notes |
|---|---|---|
| marketing headline | brand to stranger | most latitude; humour lives here or nowhere |
| onboarding / in-product | guide to newcomer | plain, short, never jokey mid-task |
| error message | system to user under stress | no personality, no apology inflation, no blame |
| support reply | company to person with a problem | most locale-sensitive of all types |
| billing / account | company to payer | formal by default in nearly every locale |
| legal / policy | obligation to obligated | never localized casually; flag for review |
| safety / destructive-action warning | no relationship, only clarity | politeness never softens this |

## Formality by locale, for support and billing copy

Second-person formality carries the most risk because most languages force a choice that
English does not make.

- **German (de)** — `Sie` by default in all support, billing, and account copy. `du` only
  for consumer products with a young audience and an explicit brand decision, and never in
  a first contact, a payment matter, or a complaint. Switching from `Sie` to `du` mid-thread
  is a visible move; do not do it by accident.
- **French (fr)** — `vous` in all business contexts. `tu` reads as either intimate or
  contemptuous depending on age and setting, and there is no safe middle guess. Formal
  closings are longer than English and their absence is noticed.
- **Spanish (es)** — `usted` for support and billing in most of Latin America and Spain,
  though tolerance for `tú` in consumer products is higher and varies by country. Regional
  split matters: `vosotros` is Spain-only; Argentine `vos` is a distinct register decision.
- **Japanese (ja)** — politeness is grammatical, not stylistic. Support copy uses
  丁寧語 (teineigo) at minimum; 敬語 for anything account or money related. Casual form in
  a support reply is not "friendly", it is a category error.
- **Korean (ko)** — speech levels are mandatory and hierarchical; use the polite formal
  level for all product and support copy.
- **Dutch (nl)** — `u` for billing, `je` widely acceptable in product copy; among the most
  tolerant of informality, so it is a poor model for its neighbours.
- **Portuguese (pt-BR vs pt-PT)** — treat as separate locales, not variants. Brazilian
  Portuguese tolerates informality far more than European.
- **Nordics (sv, da, no, fi)** — informal second person is standard even in business copy;
  over-formality reads as stiff or archaic. This is the one direction where the
  "go more formal" default is wrong, so it is worth remembering as an exception.
- **Arabic (ar)** — formal register throughout; also RTL layout, and honorifics matter.
- **Chinese (zh-CN vs zh-TW)** — separate locales (script and vocabulary both differ).
  Formal-neutral for support; avoid direct imperatives without softening.

## Things that carry warmth instead of informality

When a locale forbids the informality the source used, warmth has to come from somewhere
else, or the translation reads cold and the reviewer will try to fix it by re-informalising:

- German: `gern`, offering to handle it, concrete next step.
- French: conditional mood, `n'hésitez pas`, an explicit closing formula.
- Japanese: humble forms for your own actions, explicit gratitude for their patience.
- Spanish: `con gusto`, `quedo a su disposición`.

Say in the flag list which mechanism you used, so a reviewer does not read the missing
exclamation mark as a missing feeling.

## Punctuation and enthusiasm

- Exclamation marks: fine in English marketing, read as sales pressure in German and
  Japanese business copy, and unremarkable in Nordic copy.
- Emoji: acceptable in consumer product copy in most locales, out of place in billing and
  legal copy everywhere, and never a substitute for a word in a translated string where
  layout may clip it.
- ALL CAPS: shouting in Latin scripts, meaningless-to-broken in scripts without case.

## When to stop and ask for a native reviewer

- Any legal, medical, financial-advice, or regulatory claim.
- Any copy where a wrong register costs a relationship rather than a sentence: first
  contact, a complaint reply, a dunning notice, a cancellation.
- Any locale not listed above, or any listed one where the product's audience is
  deliberately outside its default register.
- Humour that survived the pass. If it still seems to work, that is exactly when to have
  a native speaker confirm it, because the failure mode is invisible from outside.

---
name: charge-audit
description: >-
  Follow the money crumbs through statements, invoices and subscriptions and find the
  charge that does not belong — the quiet renewal, the price that crept, the vendor billing
  under two names, the trial that converted, the seat count that never went down. Use this
  for "check my statements", "what is this charge", "audit our subscriptions", "why did
  this bill go up", duplicate-vendor hunting, card-statement review, or a suspected
  fraudulent charge. Also use when a total is right but nobody can say what it is made of.
compatibility: "No special requirements. Works from statements, invoices, or an export in any tabular form."
metadata:
  author: 5dive
  version: "1.0"
  license: company-agnostic
---

# Charge audit

This is line-level forensics, not budgeting. The question is never "is this too much" — it
is "does this specific charge belong, and does anyone recognise it". A total that looks
reasonable hides a surprising number of charges nobody would defend individually.

Distinct from a burn or runway review, which asks whether correctly-billed spend is worth
it. Here every finding is one line item that is wrong, unrecognised, or quietly changed.

## The one rule that governs everything

**Compare the same line across time, not against a budget.** A charge is anomalous relative
to its own history: the same vendor at a different amount, at a different interval, under a
different name, or on a card nobody remembers giving them. Budget comparisons find
overspend; line-versus-itself comparisons find the thing nobody authorised.

Practical consequence: **you need at least three periods.** Two periods cannot distinguish a
one-off from the start of a pattern, and a single period cannot see change at all.

## Procedure

1. **Get at least three consecutive periods**, every source: card statements, bank debits,
   invoices, app-store receipts, and any vendor portal that bills separately from the main
   account. Charges hide in the source nobody exported.
2. **Normalise the descriptors before comparing anything.** `SQ *ACME`, `ACME INC`,
   `ACME-IRELAND` and `AC ME LTD` are one vendor or four; you cannot count vendors until you
   know which. This step is the whole job and it is why the work is tedious rather than
   clever.
3. **Build the per-line history** — vendor, amount, interval, first seen, last seen, card
   used, and who recognises it.
4. **Run the anomaly classes** in `references/anomaly-patterns.md` in order. They are
   ordered by how often they are found and how quietly they hide.
5. **Separate `unrecognised` from `anomalous`.** An unrecognised charge needs an owner
   before it can be judged; an anomalous one has a known owner and a changed shape. Never
   report the first as the second, and never write off an unrecognised charge as "probably
   someone's".
6. **Get a name against every line.** A charge nobody will claim is a finding regardless of
   size — and it is the most common way a subscription outlives the project, the team, and
   occasionally the employee.
7. **Quantify each finding exactly**, from the statement: the amount, how many periods it
   has run, and the total to date. "About a year of a small charge" is not a finding; "£29 x
   14 periods = £406, first seen 2025-06" is.
8. **Say what to do and in what order** — cancel, dispute, downgrade, consolidate, or ask
   the owner. Disputes have deadlines; cancellations have notice periods. Both belong in the
   output.

## Hard rules

- **Never state an amount, date, or count you have not read off a statement.** No modelled
  or estimated figures anywhere in this skill's output, ever. A fabricated line here sends
  someone to a bank.
- **Never call a charge fraudulent.** Report `unrecognised` plus the evidence, and let a
  human make that call — the word has consequences and it is very often a descriptor
  mismatch (see the trap below).
- **Never cancel, dispute, or contact a vendor.** Recommend; the human executes. Cancelling
  the wrong subscription costs more than the charge did.
- **Flag dispute windows explicitly.** Card disputes and chargebacks have hard deadlines,
  and a finding delivered after the window closes is worth nothing.
- **Never expose full card numbers or credentials** in output. Last four digits only.
- **Do not judge whether spend is worthwhile.** That is a different review with different
  owners. Stay on "does this belong".
- **Say plainly which lines are correct.** An audit where everything is a finding is not
  being read carefully, and it gets ignored wholesale.

## Worked example

Three months of one card, illustrative. Descriptors as they appeared:

```
M1: ACME CLOUD 412.00 | SQ *DESKPRO 29.00 | DESKPRO INC 29.00 | ZENFLOW 88.00
    PAPERPLANE 12.99 | AWS 1,204.11 | FIGMA 45.00 | UNKNOWN-8817 4.99
M2: ACME CLOUD 412.00 | SQ *DESKPRO 29.00 | DESKPRO INC 29.00 | ZENFLOW 88.00
    PAPERPLANE 12.99 | AWS 1,318.02 | FIGMA 45.00 | UNKNOWN-8817 4.99
M3: ACME CLOUD 486.00 | SQ *DESKPRO 29.00 | DESKPRO INC 29.00 | ZENFLOW 264.00
    PAPERPLANE 12.99 | AWS 1,401.55 | FIGMA 45.00 | UNKNOWN-8817 4.99
    ARCHIVEBOX 199.00
```

Findings, ordered by confidence x amount, every figure read off the statement:

```
1. DUPLICATE VENDOR — DeskPro billed twice monthly under two descriptors (SQ *DESKPRO and
   DESKPRO INC), £29 each, all 3 periods. £58/mo where £29 was intended. Total to date
   £174 across the visible window; first seen is EARLIER than M1, so pull 12 months before
   quoting a lifetime figure. Owner: support. Action: confirm which is the live seat, cancel
   the other. NOT a fraud case — one is a reseller descriptor.
2. QUIET PRICE RISE — ACME CLOUD 412 -> 412 -> 486 (+18%, M3). No plan change requested by
   anyone. Action: ask the owner whether a tier changed or a price rose; if the latter, the
   renewal notice should exist and should be read before renewal.
3. TRIAL CONVERTED — ZENFLOW 88 -> 88 -> 264 (3x, exactly M3). Shape matches a per-seat
   trial expiring or 2 seats added. £176/mo delta. Action: owner confirms seats.
4. NEW CHARGE, UNCLAIMED — ARCHIVEBOX £199, first appearance M3, nobody named yet.
   UNRECOGNISED, not anomalous: it may be entirely legitimate and new. Action: find the
   owner before doing anything.
5. UNRECOGNISED, SMALL, LONG-RUNNING — UNKNOWN-8817 £4.99 x 3 visible periods, descriptor
   carries no vendor name. Small enough to have run for years unnoticed. Action: ask the
   bank for the merchant detail; do NOT dispute yet, the descriptor is unreadable rather
   than suspicious. If a dispute is wanted, the window is per-transaction — check it before
   the next statement closes.
6. CORRECT AND EXPECTED — PAPERPLANE £12.99 and FIGMA £45.00, flat across all 3 periods,
   both owned and recognised. AWS rises 1,204 -> 1,318 -> 1,402 (+16% over 3 months), which
   is USAGE-SCALED spend with a named owner: it belongs in a burn review, not here. Not a
   finding.
```

Note the four things this refuses to do: it does not call £4.99 fraud (the descriptor is
unreadable, which is a different problem), it does not quote a lifetime total for DeskPro
from a 3-month window, it does not treat AWS growth as an anomaly just because it grew, and
it names two lines as correct.

## Handoff

Return: findings ordered by confidence x amount with every figure sourced to a statement
line, the unrecognised set separated from the anomalous set, an owner or "unowned" against
each, the recommended action per line with any dispute or notice deadline, and the lines
you checked and found correct. State the window audited — "3 months" is part of every
finding's meaning.

See `references/anomaly-patterns.md` for the classes and their tells.

# Anomaly patterns

Run in this order. It is ordered by how often each class is found and, more importantly, by
how quietly it hides — the top few are almost never caught by someone reading a total.

Every class needs the same evidence: the vendor, the amount, the periods it covers, and the
statement lines it was read from.

## 1. The duplicate vendor under two descriptors

One vendor, two descriptors, two charges. Payment processors and resellers prefix their own
name (`SQ *`, `PADDLE`, `FS *`, `STRIPE*`), regional entities append a country, and app
stores bill under their own name entirely — so the same subscription can appear as
`SQ *ACME`, `ACME IRELAND` and `APPLE.COM/BILL` on the same statement.

Tell: two lines, similar or identical amounts, same interval, both persisting.

Why it hides: each line individually looks correct, and it usually is. The defect is that
there are two of them.

## 2. The quiet renewal

An annual charge nobody remembers agreeing to, arriving eleven months after the last one.
It survives specifically because a yearly cadence never lands in the same review twice.

Tell: a large charge with no sibling in the other periods. **This is the class three months
of data cannot see**, so annual charges must be checked against a 12-month window even when
the audit is scoped to a quarter. Say so in the output rather than implying full coverage.

## 3. The price that crept

Same vendor, same interval, a higher amount, no plan change requested. Contractual annual
uplifts are legitimate and usually disclosed in a renewal notice nobody read; a rise with no
notice is a finding either way.

Tell: a step change in one line's amount with everything else constant.

Never round the delta or express it only as a percentage. Give both: the absolute and the
percent, from the statement figures.

## 4. The trial that converted

A charge appearing for the first time at full price, or a small charge multiplying, exactly
one cycle after a trial began. Per-seat products often triple or quadruple in one step.

Tell: a first appearance at a round-ish number, or an exact multiple of a previous amount.

## 5. The seat count that never went down

People leave and seats do not. Distinguishable from a price rise because the unit price is
unchanged and the multiple is integral.

Tell: amount is an exact multiple of a known per-seat price, and the multiple exceeds the
number of people who use the tool. Needs the owner to confirm headcount; do not infer it.

## 6. The unrecognised descriptor

A line nobody can attribute, often small and long-running. Treat as `unrecognised`, never as
fraudulent — an unreadable descriptor is a data problem, and the bank can usually supply the
merchant detail.

Tell: a descriptor with no vendor name, an unfamiliar acronym, or a bare reference number.

Escalate rather than dispute if: the amount changes each period, the interval is irregular,
or it appeared immediately after a card was used somewhere new. Those three together are the
shape worth a human's attention today rather than at the next review.

## 7. The orphaned subscription

Correctly billed, correctly priced, and nobody uses it. Belongs here only because the audit
is what surfaces it — the cut decision is a burn review's call, not this skill's.

Tell: nobody claims it, or the claimant says "I think X used to use that".

## 8. The duplicated tool

Two vendors doing one job, both live, usually because two teams bought independently.

Tell: two vendors in the same category, each with a different owner, neither aware of the
other.

## What "checked and correct" looks like

An audit must be able to say a line is fine. A correct line is: recognised, owned, flat or
usage-scaled with a known driver, and at an amount the owner expects. Usage-scaled growth
with a named owner (cloud, metered APIs) is **not** an anomaly — it is the normal behaviour
of that line, and reporting it as a finding is how an audit loses the reader who has to
defend the bill.

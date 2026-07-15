# Clause risk library

The accumulated pattern set for contract review. Each entry: what the clause
usually does, which side it favors, why it carries risk, and the redline that
typically rebalances it. Pull from here so reviews stay consistent instead of
reasoning every clause from scratch. When you meet a new clause pattern worth
remembering, add it — this is meant to grow.

None of this is legal advice or jurisdiction-specific truth; enforceability turns
on local law and the deal. Use it to spot and explain risk faster, then flag when
a licensed attorney should confirm.

## Table of contents

- Liability & indemnification
- Limitation of liability
- Termination & auto-renewal
- Intellectual property & work ownership
- Confidentiality
- Data, privacy & security
- Payment, fees & escalators
- Warranties & disclaimers
- Dispute resolution (arbitration, class waiver, venue)
- Assignment & change of control
- Unilateral change
- Non-compete / non-solicit / exclusivity
- ToS / EULA specifics
- Privacy-policy specifics

---

## Liability & indemnification

**What it does:** Says who pays when a third party sues, or when one party causes
loss. "Indemnify, defend, and hold harmless" = you cover their legal bills and
damages for the covered events.

**Risk:** A one-way indemnity where the user is the only one indemnifying is a
classic imbalance. Broad, uncapped indemnity for "any claim arising from" is a
red flag — it can dwarf the value of the whole deal.

**Redline:** Make it mutual. Tie it to specific covered events (IP infringement,
breach, gross negligence) rather than "any claim". Cap it, or at least subject it
to the limitation-of-liability cap. Add a duty for the indemnified party to notify
and cooperate.

## Limitation of liability

**What it does:** Caps how much either side can owe, and often excludes indirect /
consequential / lost-profits damages.

**Risk:** A cap that protects only the drafter, a cap set absurdly low (e.g. "fees
paid in the last month"), or a mutual exclusion of consequential damages that
guts the user's real remedy. Watch the **carve-outs** — what sits *above* the cap
(often indemnity, confidentiality breach, IP) is where the true exposure lives.

**Redline:** Make the cap mutual and proportionate to the contract value (a common
ask: 12 months of fees, or a multiple). Ensure the user's key remedies aren't
excluded. Check that carve-outs are balanced, not one-directional.

## Termination & auto-renewal

**What it does:** How the agreement ends, notice required, and whether it silently
renews.

**Risk:** Auto-renewal with a long notice window (e.g. must cancel 90 days before
renewal) is the single most common trap — miss the window, locked in another term.
"Termination for convenience" that only *one* side has. Termination triggering
penalties or full remaining-term payment.

**Redline:** Shorten the cancellation-notice window; add a renewal reminder
obligation; make termination-for-convenience mutual; cap early-exit costs. Always
surface the exact renewal date and notice deadline in the review.

## Intellectual property & work ownership

**What it does:** Who owns what's created, and what license each side grants.

**Risk:** Perpetual, irrevocable, worldwide assignment of IP; work-for-hire
language that reaches beyond the engagement (into the user's pre-existing or side
work); a "license" that's actually an ownership transfer. In employment/contractor
docs, an invention-assignment clause that sweeps in personal projects.

**Redline:** Scope ownership to deliverables made *for this engagement*. Carve out
pre-existing IP and personal/side projects. Convert overbroad assignments to a
license where a license is all the counterparty actually needs.

## Confidentiality

**What it does:** Defines confidential info and restricts its use/disclosure.

**Risk:** A definition so broad it covers public info; no time limit; obligations
that outlive any reasonable need; a "residuals" clause letting the other side use
what they "remember". One-way when it should be mutual.

**Redline:** Standard exclusions (already public, independently developed,
rightfully received). A sensible duration (often 2-5 years; trade secrets can run
longer). Make it mutual. Scrutinize residuals clauses.

## Data, privacy & security

**What it does:** Governs data the parties handle — collection, use, sharing,
retention, security obligations, breach notice.

**Risk:** Rights to use/sell/share the user's (or their customers') data;
vague/absent security commitments; no breach-notification timeline; no data
return/deletion on exit; sub-processor sprawl with no oversight. For regulated
data, silence on GDPR/CCPA/HIPAA obligations is itself a risk.

**Redline:** Restrict use to providing the service. Require a DPA where personal
data is involved. Add breach-notice timelines, security minimums, sub-processor
consent, and data return/deletion on termination.

## Payment, fees & escalators

**What it does:** Price, when it's owed, and how it changes.

**Risk:** Annual price-escalator clauses (auto CPI+X%), fees that trigger on vague
events, steep late penalties, non-refundable prepayment, unilateral right to
change pricing.

**Redline:** Cap escalators; require notice for price changes and a right to
terminate if they exceed a threshold; clarify exactly what triggers a charge; make
late penalties reasonable and reciprocal.

## Warranties & disclaimers

**What it does:** What each side promises, and what they disclaim ("AS IS",
"AS AVAILABLE").

**Risk:** A total disclaimer paired with a low liability cap leaves the user with
no meaningful remedy if the thing doesn't work. No warranty of non-infringement.

**Redline:** Secure at least a baseline warranty (conforms to docs, non-infringing,
performed with reasonable skill). Pair warranty with a real remedy.

## Dispute resolution (arbitration, class waiver, venue)

**What it does:** How disputes get resolved — courts vs arbitration, where, under
whose law, and whether class actions are waived.

**Risk:** Mandatory binding arbitration + class-action waiver (very common in
consumer ToS) strips the user's day in court and ability to join others.
Inconvenient/expensive venue and unfamiliar governing law tilt the field. Fee-
shifting ("loser pays") can deter valid claims.

**Redline:** For negotiated B2B deals, push for a neutral venue/governing law, or
courts over arbitration. In take-it-or-leave-it ToS, you usually can't change it —
so *flag it clearly* so the user accepts it knowingly.

## Assignment & change of control

**What it does:** Whether a party can transfer the contract to someone else,
including via acquisition.

**Risk:** The counterparty can assign your agreement (and your data/obligations) to
a competitor or unknown third party without consent.

**Redline:** Require consent to assign; carve out or at least get notice for
change-of-control; give the user a termination right if the counterparty is
acquired by a competitor.

## Unilateral change

**What it does:** "We may modify these terms at any time" — one side rewrites the
deal later.

**Risk:** Everything you reviewed can change after signing. Common and often
unavoidable in ToS; unacceptable in a negotiated contract.

**Redline:** In negotiated deals, require mutual written agreement to amend. In
ToS, at minimum require advance notice + a right to terminate on unfavorable
changes — and flag the clause so the user knows the terms aren't fixed.

## Non-compete / non-solicit / exclusivity

**What it does:** Restricts who the user can work with, hire, or sell to.

**Risk:** Overbroad scope (geography, time, activity) can hobble the user's
business or career. Enforceability varies enormously by jurisdiction (some ban
employee non-competes outright) — do not assert it's enforceable or void; flag
that it's jurisdiction-dependent.

**Redline:** Narrow scope, geography, and duration to what's genuinely needed.
Convert a non-compete to a narrower non-solicit where possible. Flag for local-law
review.

## ToS / EULA specifics

Watch for: the **license you grant them** over content you upload (should be
limited to operating the service, not "perpetual, irrevocable, sublicensable" for
any purpose); account-termination-at-will; unilateral change; arbitration +
class-waiver; limitation of liability. These are take-it-or-leave-it, so the
review's job is "here's what you're actually agreeing to", with the two or three
things that would surprise them called out.

## Privacy-policy specifics

Watch for: what data is collected (and whether it exceeds what the service needs);
whether data is **sold or shared** with third parties/advertisers/data brokers;
retention period and deletion rights; international transfer; and whether the stated
practices line up with the regime that applies to the user or their users (GDPR,
CCPA/CPRA, etc.). Name gaps in plain terms; don't certify compliance — that's a
lawyer's call.

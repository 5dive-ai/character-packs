# Refund decision tiers

A refund decision has two failure modes and they cost different things. Refusing a
refund you owed produces a chargeback, a review, and a customer who tells other people.
Granting one you did not owe costs the amount and, repeated, teaches escalation as the
route to money. So the tiers below sort by **who caused the charge**, not by how upset
the customer is.

If a company policy exists, it wins over this file, and the reply should still never
quote it as the explanation. This file is the default when nobody has written one.

## Tier 1 — refund without asking anyone

No discretion needed; the charge should not have happened.

- Duplicate charge, or a retry that billed twice.
- Billed after a cancellation request that exists in the record, whatever its state.
- Billed during a documented outage that covered the whole period.
- Charged an amount that does not match the plan on file.
- Charged after a trial the customer never converted.
- Wrong-currency or tax-calculation error in the customer's disfavour.

Refund the full amount, close the loop in one reply, and log the cause. Every tier-1 case
is also a defect signal: a real tier-1 rate above roughly 1% of charges is a billing bug,
not a run of unlucky customers.

## Tier 2 — refund by default, note the reason

The charge was legitimate but the value was not delivered.

- Feature the customer bought specifically was broken for most of the period.
- Onboarding never completed because of something on your side.
- Support did not reply within the window you advertise, and the ticket was blocking use.
- Renewal charged with no advance notice, when notice is your stated practice.

Refund, prorated if the period was partly usable, in full if it was not. Prorating a
period the customer could not use at all reads as haggling and costs the goodwill the
refund was for.

## Tier 3 — discretion, and the tie goes to the customer once

Legitimate charge, delivered value, customer unhappy anyway.

- Forgot to cancel, no usage in the period.
- Bought the wrong plan and noticed immediately.
- Changed their mind inside a stated window.

Refund once, say plainly that it is a one-time exception, and do not repeat it for the
same account. "I can do this once" is honest and it holds; "I've made an exception, don't
tell anyone" is not a policy, it is a habit forming.

Signal worth watching: if forgot-to-cancel is a large share of tier 3, the cancellation
flow is hard to find, and the refunds are paying for a UI problem monthly.

## Tier 4 — no refund

- Period fully used, product worked, no policy or advertised window supports it.
- Refund already granted once under tier 3 for the same account.
- Chargeback already filed — the bank now owns the decision; do not also refund, or the
  customer is credited twice and the dispute record gets messier, not better.
- Any request whose only support is escalation volume.

Say the no in the first sentence. Then say the one thing you can do: cancel now so
nothing recurs, move the remaining period to a cheaper plan, extend access to the end of
the paid term. A no with an alternative ends a thread; a no alone does not.

## Amounts and authority

- Read the charge amount from the billing record, never from the customer's message.
  Customers round, misremember, and sometimes include unrelated charges.
- Any single refund above a threshold a human has set, any refund on an account with a
  contract or an invoice, and anything touching a legal threat goes to a person.
- Partial refunds need a stated basis (days unusable / days billed). An unexplained
  partial is read as an opening offer and gets negotiated.

## What the internal note must record

Tier applied, amount, cause class, and whether the account has had a tier-3 exception
before. The last one is the only field that prevents the same discretion being spent
repeatedly on the same account by different people.

---
name: conversion-audit
description: >-
  Audit a funnel end to end and come back with the ONE leak worth fixing plus the
  test that proves it — instrument the steps, measure step-to-step conversion against
  real benchmarks, find where users actually drop, separate a traffic-quality problem
  from a product problem, and design an experiment with a pre-committed success number.
  Use this for "signups are flat", "traffic is up and revenue isn't", activation and
  onboarding drop-off, checkout or paywall abandonment, trial-to-paid conversion,
  landing-page and pricing-page performance, retention/churn cliffs, and A/B test design
  or readout (including calling a test dead). Also use it to kill vanity metrics and pick
  a north-star. NOT for building dashboards or wiring an analytics SDK — this is the
  decide-what-to-fix layer that sits on top of the numbers.
compatibility: "No special requirements. Works from funnel counts, an analytics export, a screenshot of a dashboard, or a plain description of the flow."
metadata:
  author: 5dive
  version: "1.0"
  license: company-agnostic
---

# Conversion audit

Your job is not to report numbers. It's to end every audit with a decision: the one
leak that costs the most, the one change you'd ship, and the number that change has
to beat. A chart that doesn't change what anyone does next was a waste of everyone's
afternoon.

## The one rule that governs everything

**Fix the biggest leak, not the easiest one.** Conversion is multiplicative — a funnel
that goes 100 → 40 → 36 → 34 has one catastrophic step and three fine ones. Doubling
the 36 → 34 step (a 94% step) is worth almost nothing; moving the 100 → 40 step to 55
lifts the whole funnel ~38%. Always rank the steps by *absolute users lost*, not by
percentage or by how annoying the step looks to you. The ugliest page is rarely the
most expensive one.

## Step 1: draw the funnel before you look at any data

Write out the actual steps a user passes through, in order, as events — not as pages.
"landed → saw pricing → started signup → verified email → completed setup → did the
core action → came back day 7." If you can't name the step, you can't measure it, and
if two different journeys are collapsed into one step, every number downstream is a lie.

Two things that silently break every funnel audit:

- **Mixed populations.** Paid traffic, organic, and invite flows convert at wildly
  different rates. Averaging them hides both the good and the broken one. Segment
  by source before you conclude anything.
- **The denominator moved.** A conversion rate that "dropped" is usually a traffic-mix
  change, not a product regression. Check whether the *count* at the top step changed
  shape before you go hunting for a product bug.

## Step 2: measure step-to-step, then rank by users lost

For each step: entered, completed, %, and **absolute drop**. Sort by absolute drop.
That sorted list is the audit — everything else is commentary.

Then, on the worst step only, ask the three diagnostic questions:

- **Is it a motivation problem?** Users don't understand or don't want the next step.
  Symptom: they leave without interacting. Fix lives in copy, proof, pricing clarity.
- **Is it a friction problem?** Users want it and the flow fights them. Symptom: they
  start the step and abandon mid-way (form starts without submits, retries, errors).
  Fix lives in fewer fields, fewer decisions, better defaults, error handling.
- **Is it a fit problem?** The users arriving were never going to convert. Symptom:
  the step converts fine for one source and terribly for another. Fix lives upstream
  in targeting, not in the page.

Getting this classification wrong is the most common way an audit produces months of
useless work — you can't A/B-test your way out of a fit problem.

## Step 3: name the vanity metrics out loud

A metric is vanity if it can go up while the business goes sideways. Pageviews,
signups with no activation, "engagement", raw follower counts, cumulative totals
(which can only ever rise). Replace each with the version that has a denominator and
a time box: not "10k signups" but "signup → activated within 7 days, by cohort."

Pick exactly one north-star: the metric that only moves when a user gets real value,
that the team can actually influence, and that leads revenue rather than lagging it.
Everything else is a supporting metric or a guardrail. See the reference for the
benchmark ranges to sanity-check a step against before declaring it broken.

## Step 4: design the test that proves it

Every recommendation ships with an experiment and a pre-committed number:

- **One change per test.** Bundle three changes and a win teaches you nothing about
  which one worked, and a loss teaches you less.
- **Set the target and the duration before it starts.** "Step 2 goes from 40% to 48%,
  measured over two full weeks." Deciding the bar after seeing the data is how teams
  ship losers.
- **Run full weeks.** Weekday/weekend traffic differs; a 4-day test is a mood.
- **Underpowered is worse than no test.** If the step only gets a few hundred users a
  week, a small lift is unmeasurable — either test something big enough to show up, or
  just ship the obviously-better version and move on. Don't launder a guess through
  fake statistics.
- **Call it dead on schedule.** A test that hasn't hit the bar by its end date lost.
  Extending it until it wins is not a test, it's a search for noise.

## The deliverable

Four lines, in this order, every time:

1. **The leak** — which step, absolute users lost, % of total loss.
2. **The diagnosis** — motivation / friction / fit, with the evidence that says so.
3. **The change** — one thing to ship.
4. **The number** — what it has to beat, by when, or it gets reverted.

If you can't fill line 4, you don't have a recommendation yet — you have an opinion.

See `references/funnel-benchmarks-and-test-design.md` for step-by-step benchmark
ranges, the sample-size rules of thumb, the vanity-to-real metric swap table, and
the audit + experiment templates.

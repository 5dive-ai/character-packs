---
name: analytics
description: Defining and instrumenting product and marketing analytics — north-star metrics, event taxonomy, funnel definition and drop-off analysis, attribution, cohort/retention, and turning data into decisions instead of vanity dashboards. Use when the user wants to set up tracking, design an event schema, find where users drop off, measure retention, pick a north-star metric, or asks "what should I measure" / "why are signups not converting." Keywords analytics, funnel, north-star metric, event tracking, taxonomy, attribution, cohort, retention, drop-off, conversion, instrumentation, KPI, dashboard.
version: 1.0.0
license: MIT
---

# Analytics

The goal of analytics is **decisions**, not dashboards. A metric earns its place only if a
plausible value would change what you do. If you'd act the same way whether the number is up or
down, stop tracking it — it's a vanity metric. Most analytics work is deciding what *not* to
measure.

## 1. North-star metric

One metric the whole team optimizes — it captures the value customers actually get, leads
revenue, and is something your work can move.

- Good: weekly active teams, projects completed, messages sent between users, GMV.
- Bad: total signups (cumulative, only goes up), pageviews, raw revenue (lagging, dominated by external factors).
- **Test:** if this number grows, are customers genuinely better off *and* is the business healthier? Both must be yes.

Pair the north star with **2–4 guardrail metrics** so you don't game it (e.g. north star = messages sent, guardrail = retention + spam-report rate). Optimizing one number in isolation always finds a degenerate shortcut.

## 2. Event taxonomy

Bad event naming is the #1 thing that makes analytics useless six months later. Decide a
convention on day one and enforce it.

- **Naming:** `object_action`, past tense, snake_case — `signup_completed`, `project_created`, `invite_sent`. Pick one convention (object-action vs action-object) and never mix.
- **Properties over event explosion:** one `button_clicked` event with a `button_id` property beats 50 events like `signup_button_clicked`. Events are the verb; properties are the adjectives.
- **Identify users** with a stable ID and attach traits (plan, signup date, role). Tie anonymous → known at signup so you don't lose the pre-signup journey.
- **Track the value moment**, not just clicks. The event that means "this user got value" is the one your funnel and retention hinge on.
- **Maintain a tracking plan** (a shared doc/sheet): event name, when it fires, properties, owner. Without it, every engineer invents their own names and the data rots.

### Example event schema

```
user_signed_up        { method: "google" | "email", referral_source, plan: "free" }
project_created       { project_id, template: string | null, time_since_signup_s }
invite_sent           { project_id, channel: "email" | "link", invitee_count }
activation_reached     { project_id, days_since_signup }   # the "aha" moment
subscription_started   { plan, mrr, billing_period: "monthly" | "annual" }

# Global properties on every event:
{ user_id, anonymous_id, timestamp, platform, app_version, utm_* }
```

Keep the event set small and deliberate. 20 well-defined events beat 200 ambiguous ones.

## 3. Funnels

A funnel is an ordered sequence of events toward a goal. It tells you **where**, not why — but where is most of the battle.

- Define the steps as real events: e.g. `landing_viewed → signup_completed → activation_reached → subscription_started`.
- Read **step-to-step conversion**, not just end-to-end. The biggest single drop-off is your highest-leverage fix.
- Set a sensible **conversion window** (e.g. "within 7 days") — open-ended funnels overstate conversion.
- **Segment the funnel** by source/device/cohort. An aggregate "30% convert" can hide "mobile converts at 8%, desktop at 45%" — that's the actual insight.
- The drop-off tells you where; then go qualitative (session replays, user interviews, the page itself) to learn why.

### Workflow: instrument a funnel

```
1. Define the goal event (the conversion that matters — money or activation).
2. Work backwards: list the 3–6 required steps to reach it.
3. Map each step to ONE event; add events you're missing to the tracking plan.
4. Implement + QA each event in a debugger/live-stream view BEFORE trusting reports.
   (Half of "weird funnel data" is a misfiring or double-firing event.)
5. Set the conversion window.
6. Build the funnel; identify the biggest drop-off step.
7. Segment that step (source, device, new vs returning) to localize the problem.
8. Form a hypothesis → ship a change → watch that one step → repeat.
```

## 4. Attribution basics

Attribution assigns credit for a conversion to touchpoints. Every model is a simplification — pick one, know its bias, and be consistent.

| Model            | Gives credit to            | Bias / use when                                    |
| ---------------- | -------------------------- | -------------------------------------------------- |
| First-touch      | The first interaction      | Overcredits awareness; good for "what creates demand" |
| Last-touch       | The final interaction      | Overcredits bottom-funnel/brand; the common default |
| Linear           | All touches equally        | Simple multi-touch; undercredits decisive moments  |
| Time-decay       | Recent touches more        | Reasonable for short sales cycles                  |
| Position-based   | First + last weighted (e.g. 40/20/40) | Balances demand creation and closing  |

- **Capture first-touch landing page + UTMs and store them on the user**, even for direct hits — it's the cheapest, most durable attribution data and you can't backfill it.
- For anything with a multi-week sales cycle, single-touch models lie. Use multi-touch and treat it as directional, not precise.
- Reconcile platform-reported conversions against your own DB — ad platforms over-claim.

## 5. Cohorts & retention

A single conversion number is a snapshot; retention is the movie — and retention, not acquisition, is what compounds.

- **Cohort:** group users by a shared start (signup week/month) and track behavior over time. Reveals whether the product is getting better (later cohorts retain better) and isolates the impact of changes.
- **Retention curve:** % of a cohort still active at day/week N. A healthy product's curve **flattens** (a stable core sticks) rather than decaying to zero. A curve that hits zero = no product-market fit, no acquisition fixes it.
- **Pick the right "active":** define it as the value moment, not "opened the app."
- **N-day vs unbounded ("returning") retention:** unbounded (active *on or after* day N) is kinder and usually more honest for non-daily products.

## 6. Turning data into decisions

- Lead with a **question**, not a metric: "Why do mobile signups drop after step 2?" beats "let's look at the dashboard."
- Every number needs a **comparison** to mean anything — vs last period, vs another segment, vs a goal. A naked "1,200 signups" says nothing.
- **Vanity vs actionable:** pageviews, total users, raw followers, impressions → vanity. Activation rate, retention by cohort, CAC:LTV, step conversion → actionable.
- Watch for the traps: **survivorship** (only analyzing converters), **Simpson's paradox** (aggregate trend reverses within segments — always check segmented), correlation ≠ causation (use a holdout/A-B test when the stakes justify it).
- **Statistical significance:** don't call an A/B test off a 3-day blip or a handful of conversions. Decide sample size up front; let it run.
- End every analysis with **"so what do we do?"** If there's no answer, it wasn't analysis — it was decoration.

## Quick instrumentation checklist

```
[ ] North-star metric chosen + 2–4 guardrails
[ ] Naming convention decided (object_action, past tense, snake_case)
[ ] Tracking plan doc exists (event, trigger, properties, owner)
[ ] User identify() wired; anonymous→known stitched at signup
[ ] Value/activation moment has its own event
[ ] First-touch landing + UTMs stored on the user record
[ ] Every event QA'd live before it's trusted in a report
[ ] Funnel defined with a conversion window + segmentation
[ ] Retention measured by cohort with a real "active" definition
[ ] Every dashboard metric answers "what would we do differently?"
```

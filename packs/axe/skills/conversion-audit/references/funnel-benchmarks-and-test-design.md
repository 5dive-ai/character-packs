# Funnel benchmarks, metric swaps, and test design

Reference for the `conversion-audit` skill. Benchmarks are ranges for sanity-checking,
never targets — a step inside the range can still be the biggest absolute leak, and a
step outside it can be fine for an unusual model.

## Benchmark ranges (B2B SaaS self-serve, order of magnitude)

| Step | Typical range | Read it as broken below |
|---|---|---|
| Landing page → signup start | 2–8% (cold traffic), 10–25% (warm/intent) | ~1% cold |
| Signup start → account created | 50–80% | ~40% (usually form friction) |
| Account created → activated (first core action) | 20–50% | ~15% |
| Activated → retained day 7 | 40–70% | ~30% |
| Free trial → paid | 8–20% (no card), 40–60% (card up front) | ~5% no-card |
| Pricing page → checkout start | 5–15% | ~3% |
| Checkout start → payment complete | 60–85% | ~50% (payment/UX failure) |

Two structural notes that matter more than the numbers:

- **Card-up-front vs no-card trials aren't comparable.** Card-up-front shows a much
  higher trial→paid rate on a much smaller trial pool. Compare *paid customers per
  1000 visitors*, not conversion rates, when weighing the two.
- **A high step rate can be a bad sign.** A 95% step usually means the step isn't a
  real decision point (auto-advance, no choice) — the actual drop moved somewhere
  you aren't measuring.

## Vanity → real metric swaps

| Vanity | Replace with |
|---|---|
| Pageviews / sessions | Sessions that reached the core action |
| Total signups | Signup → activated within 7 days, by weekly cohort |
| "Engagement" | Specific repeated core action per active user per week |
| Cumulative anything | The same number as a rate over a fixed window |
| Followers / list size | Reply or click rate per send |
| Average revenue | Median + the distribution; averages hide whale skew |
| NPS in isolation | NPS segmented by activated vs not |
| Time on page | Task completion rate for that page's job |

## Sample size, roughly

To detect a **relative** lift on a baseline rate, per variant, ballpark:

| Baseline | +10% relative | +20% relative | +50% relative |
|---|---|---|---|
| 5% | ~30,000 | ~8,000 | ~1,400 |
| 20% | ~6,300 | ~1,600 | ~300 |
| 50% | ~1,600 | ~400 | ~80 |

Rules of thumb that follow from that table:

- Low-baseline steps need enormous traffic. If the step converts at 5% and you get
  2,000 users a week, you cannot measure a 10% lift this quarter. Ship the better
  version on judgment, or go find a bigger swing.
- Small samples only detect big effects. That's not a limitation to work around —
  it's a reason to test bold changes instead of button colors.
- Peeking daily and stopping at the first significant reading inflates false positives
  badly. Set the end date up front and read it once.

## Audit template

```
FUNNEL: <name>   WINDOW: <dates>   SEGMENT: <source / cohort>

step                    entered   completed   rate    LOST
1 <step>                  ____       ____     __%     ____
2 <step>                  ____       ____     __%     ____
...

BIGGEST LEAK: step __ , ____ users lost (__% of total loss)
DIAGNOSIS: motivation | friction | fit
EVIDENCE: <what in the data says so>
CONFOUNDS CHECKED: traffic mix ☐  seasonality ☐  tracking gap ☐  segment split ☐
```

## Experiment template

```
HYPOTHESIS: because <evidence>, changing <one thing> will lift <step> from __% to __%
PRIMARY METRIC: <step conversion>        TARGET: __%
GUARDRAIL METRICS: <downstream step, refunds, support volume> must not fall below __
UNIT: visitor | account            SPLIT: 50/50
DURATION: <N full weeks>, ends <date>. Read ONCE at end.
MIN SAMPLE: ____ per variant (from the table above)
DECISION RULE: hits target -> ship. misses -> revert, log the learning, move to leak #2.
```

## Tracking gaps that fake a leak

Before declaring a step broken, rule these out — each one produces a fake cliff:

- Event fires on page load vs on success (inflates or deflates the step).
- Ad blockers and ITP suppressing client-side events (skews mobile/Safari hardest).
- Redirects or SPA route changes that drop the session.
- Bot and preview traffic inflating the top of the funnel.
- A step that's optional for some users being counted against everyone.
- Server-side conversions never joined back to the client-side session.

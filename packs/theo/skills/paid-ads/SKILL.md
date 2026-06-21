---
name: paid-ads
description: Running and optimizing paid acquisition across Google Search, Meta, X, and LinkedIn — campaign structure, targeting, budgets and bidding, creative testing, conversion tracking, and the metrics that decide when to cut or scale. Use when the user wants to launch ads, set up tracking, fix a campaign that isn't converting, lower CAC, scale spend, or asks how to read ROAS/CPC/CTR. Keywords paid ads, PPC, Google Ads, Meta Ads, Facebook ads, LinkedIn ads, CAC, ROAS, CPC, CPM, CTR, conversion rate, UTM, pixel, bidding, ad creative.
version: 1.0.0
license: MIT
---

# Paid Ads

Paid acquisition is renting attention. It works when the math works and bleeds money when it
doesn't — so set up measurement *before* you spend, not after. The platform's job is to spend
your budget; your job is to make sure it spends on people who convert profitably.

## Pick the channel by intent and audience

| Channel        | Demand type        | Best for                                   | Watch out for                          |
| -------------- | ------------------ | ------------------------------------------ | -------------------------------------- |
| Google Search  | Existing (pull)    | Capturing people already searching to buy  | Expensive head terms; competitor bids  |
| Meta (FB/IG)   | Created (push)     | Visual products, broad consumer, retargeting | Creative fatigue; iOS attribution gaps |
| X              | Created (push)     | Tech/dev audiences, real-time, awareness   | Lower commercial intent                |
| LinkedIn       | Created (push)     | B2B by job title/company/industry          | High CPC ($6–12+); only worth it at high LTV |

Rule of thumb: **Search captures demand, social creates it.** If people are already searching for what you sell, start on Search — it's the warmest traffic you'll buy.

## Campaign structure

Keep it tight. Over-segmentation starves the algorithm of conversion data; one giant blob gives you nothing to optimize. Modern platforms (Performance Max, Advantage+) want consolidation — fewer campaigns, more budget per ad set so the optimizer gets enough signal (~50 conversions/ad set/week is the rough learning threshold).

- **Google Search:** Campaign = budget + goal. Ad group = one tight theme of keywords + matching ads. Don't dump 200 keywords in one ad group; the ad can't be relevant to all of them.
- **Meta:** Campaign = objective. Ad set = audience + budget + placement. Ad = creative. Test creative within an ad set, test audiences across ad sets.
- One conversion objective per campaign. "Awareness + conversions" in one campaign optimizes for neither.

## Targeting

- **Search:** target *keywords* with intent, not people. Use match types deliberately — phrase/exact for control, broad only with a good conversion signal and a tight negative-keyword list. **Negative keywords are half the job** on Search; review the search-terms report weekly and prune junk ("free," "jobs," "diy" if you're not those).
- **Social:** start broader than feels comfortable. The algorithm finds your buyers faster than your manual interest-stack does. Layer interests/demographics only when you have a reason. Always exclude existing customers from prospecting.
- **Retargeting:** highest ROAS, smallest reach. Segment by depth (visited pricing > visited homepage > bounced). Cap frequency so you don't burn them.
- **Lookalikes/Advantage:** feed them a *clean, high-value* seed (purchasers, not all signups) and they get better.

## Budget & bidding

- Start with enough budget to exit the learning phase (need ~50 conversions/ad set/week or the algorithm flails). If you can't afford that on a $50 CPA goal, narrow to one campaign.
- **Bidding ladder:** start on max-conversions / max-clicks to gather data → switch to **target CPA** or **target ROAS** once you have ~30–50 conversions. Don't set a tCPA on day one with no data; you'll choke delivery.
- Change budgets ±20% at a time. Big swings reset the learning phase.
- Set a tCPA from your real unit economics: `max CPA = LTV × target margin`. If you don't know LTV, you're guessing.

## Creative & ad testing

Creative is the biggest lever on social — it beats targeting tweaks. On Search, the *offer and landing page* are the lever.

**Test in this order (biggest impact first):**
1. **Offer/angle** — what you promise and to whom
2. **Hook** — first 3 seconds of video / the headline
3. **Format** — video vs static vs carousel
4. **Then** details: colors, button copy, music

- Test **one variable at a time** or you can't attribute the win.
- Run 3–5 distinct creatives per ad set; let the algorithm allocate. Kill the bottom performers, not after 100 impressions — wait for ~1,000+ impressions or a few days.
- **Creative fatigue** on social is real: when frequency climbs and CTR drops ~30%+ from peak, refresh the creative. Budget for a steady creative pipeline, not one hero ad.
- Match the ad to the landing page (message match). A great ad to a mismatched page wastes the click.

## Tracking — do this before you spend a dollar

| Layer            | What                                                                      |
| ---------------- | ------------------------------------------------------------------------- |
| UTMs             | Tag every link: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`. Be consistent (lowercase, a documented convention) or your reports turn to mush. |
| Pixel/tag        | Install the platform pixel + a server-side conversions API (Meta CAPI / Google Enhanced Conversions) to recover iOS/cookie-blocked conversions. |
| Conversion events| Define the actual money event (purchase, qualified lead) — not "landing page view." Pass value where you can so ROAS bidding works. |
| Attribution window | Know your setting (e.g. 7-day click / 1-day view). Platforms over-claim; reconcile against your own analytics/DB. |

If you can't measure a conversion, you can't optimize toward it. Set this up first.

## Core metrics — what they mean and what's "good"

| Metric | Formula                          | Reads as                          |
| ------ | -------------------------------- | --------------------------------- |
| CPM    | cost per 1,000 impressions       | What it costs to be seen          |
| CTR    | clicks ÷ impressions             | Is the *creative/ad* compelling?  |
| CPC    | cost ÷ clicks                    | Price of a visit                  |
| CVR    | conversions ÷ clicks             | Is the *offer/landing page* working? |
| CAC    | total spend ÷ new customers      | What a customer costs to acquire  |
| ROAS   | revenue ÷ ad spend               | Return per dollar spent           |

**Reading them together (the funnel diagnoses itself):**
- Low CTR → ad/creative or targeting problem (top of funnel).
- Good CTR, low CVR → landing page / offer / message-match problem (bottom of funnel).
- Good CVR, bad CAC/ROAS → CPCs too high or LTV too low — economics, not execution.
- **Profitability check:** ROAS must clear breakeven `1 ÷ margin` (50% margin → need ROAS ≥ 2.0 just to break even). Or judge by `CAC < LTV` — payback under ~12 months for most businesses.

## Launch checklist

```
[ ] Conversion tracking live + test-fired (pixel + server-side)
[ ] UTM convention documented and applied to every link
[ ] Target CPA/ROAS derived from real LTV and margin
[ ] One objective per campaign; tight ad groups / clean audiences
[ ] 3–5 creatives per ad set; message-matched to landing page
[ ] Negative keywords loaded (Search); customer-exclusion list (social)
[ ] Budget high enough to exit learning phase
[ ] Daily/total budget caps and a kill date set
[ ] Landing page fast, mobile-clean, single CTA
```

## Diagnose a failing campaign

```
Spending but ZERO conversions?
├─ Is tracking actually firing? (test the event FIRST — most "failures" are broken pixels)
├─ Tracking OK → is the landing page converting non-paid traffic? If no → fix the page, not the ad
└─ Page OK → wrong audience/intent → tighten targeting / keywords

Getting clicks but no conversions? (good CTR, low CVR)
└─ Landing page, offer, or message-match. The ad wrote a check the page didn't cash.

No clicks? (low CTR)
└─ Creative or targeting. Refresh hook/angle; check you're not showing to the wrong people.

Converting but unprofitable? (good CVR, bad ROAS/CAC)
├─ CPCs too high → improve Quality Score / relevance, or shift channel
└─ LTV too low → it may just not be a viable paid channel for this product

Was working, now decaying?
├─ Frequency up + CTR down → creative fatigue → new creative
└─ CPMs up seasonally (Q4/holidays) → expected; reassess targets
```

**When to cut:** an ad set that's spent ~3× your target CPA with zero conversions is dead — pause it. **When to scale:** when CAC is comfortably under LTV and stable for a week+, raise budget ~20% at a time and watch CPA hold. Scaling too fast inflates CPA and resets learning.

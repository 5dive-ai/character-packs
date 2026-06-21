---
name: pitch-deck
description: Building investor and strategy decks plus the simple financial model behind them. Use when creating or critiquing a fundraising pitch, a board/strategy deck, or the unit-economics and revenue model that has to back it up. Covers the canonical slide arc and what each slide must prove, narrative principles, slide design do/don't, and a financial-modeling section — unit economics (CAC, LTV, payback, margin), revenue build, burn and runway, and how to sanity-check assumptions. Keywords pitch deck, investor deck, fundraising, slides, narrative, TAM SAM SOM, unit economics, CAC, LTV, runway, financial model.
version: 1.0.0
license: MIT
---

# Pitch Deck & Financial Model Guide

A pitch deck sells **one belief**: that this team can turn this opportunity into an outsized
outcome. Every slide either advances that belief or wastes a slide. The deck tells the story;
the model proves it isn't fiction. Build both, and make them agree.

> Core principle: a deck is a narrative, not a data dump. One idea per slide, the idea in the
> headline, the slide as evidence for it. If a slide doesn't move the story forward, cut it.

## The canonical deck arc (10–12 slides)

Order is a story: a problem worth solving → a solution that works → why it wins → why now →
how big → how it makes money → that it's already working → who's building it → the ask. Each
slide has a job — to **prove** something, not just state it.

| # | Slide | What it must prove |
|---|-------|--------------------|
| 1 | **Cover / one-liner** | What you do, in plain language a stranger gets in 5 seconds |
| 2 | **Problem** | A real, painful, expensive problem — for a specific someone |
| 3 | **Solution** | Your product solves *that* problem; show it, don't describe it |
| 4 | **Why now** | A shift (tech, regulation, behavior, cost) that makes this possible/urgent today |
| 5 | **Market (TAM/SAM/SOM)** | The prize is big enough to matter, and built bottom-up not hand-waved |
| 6 | **Product** | It's real and differentiated — screenshots, demo, the "magic moment" |
| 7 | **Business model** | How you make money, what a customer is worth, that the unit math works |
| 8 | **Traction** | Evidence it's working — the single most persuasive slide if you have it |
| 9 | **Go-to-market** | A repeatable, affordable path to customers (not "we'll go viral") |
| 10 | **Competition** | You understand the landscape and have a defensible edge |
| 11 | **Team** | Why *this* team wins this — relevant, credible, complementary |
| 12 | **The ask** | How much, for what milestones, and what it buys the investor |

Optional add-ons: vision/roadmap, financial summary, use-of-funds breakdown. Keep the core
to ~12; park detail in an appendix you pull up only if asked.

### What each slide must actually do

- **Problem** — make the audience *feel* the pain. Concrete, specific, quantified. Avoid "the
  world is inefficient." Whose day is ruined, and how much does it cost them?
- **Why now** — the most-skipped, most-powerful slide. What changed that makes this the moment?
  No "why now," and you're a vitamin, not a painkiller.
- **Market** — build **bottom-up**: (number of customers) × (price) = SOM, then widen to SAM
  and TAM. Top-down "1% of a $50B market" reads as lazy and gets discounted.
- **Traction** — show the line going up and to the right: revenue, users, retention, pipeline,
  signed LOIs — whatever is most real. Pre-traction, show evidence of demand (waitlist,
  pilots, design partners).
- **Competition** — never claim "no competitors" (means no market or no homework). Use a 2×2
  or feature matrix; be honest about where rivals are strong; then show your wedge.
- **The ask** — specific number, the milestones it funds, and the runway it buys. Tie raise to
  the *next* inflection (e.g. "to get to $1M ARR and a Series A").

## Narrative & story principles

- **One idea per slide.** If a slide makes two points, split it.
- **Headline = the takeaway, not the topic.** "Revenue grew 4× in 12 months," not "Revenue."
  A reader should get the deck from headlines alone.
- **Set up → tension → resolution.** Problem creates tension; solution and traction resolve it.
  Keep the arc; don't reorder into a feature catalog.
- **Concrete beats abstract.** A named customer and a real number outsell adjectives.
- **Know your audience.** Investor decks sell upside and defensibility; board/strategy decks
  sell focus, risk, and the plan. Same facts, different emphasis.
- **The deck supports the talk** — it isn't the script. Slides carry the visual evidence; you
  carry the story.

## Design do / don't

**Do**
- One idea, one chart, lots of whitespace.
- A headline that states the point; the body proves it.
- Consistent fonts, colors, and number formatting throughout.
- Charts over tables; a labeled trend line over a wall of figures.
- Big, legible type — assume it's read on a phone or projected across a room.

**Don't**
- Paragraphs. If it's a paragraph, it's a doc, not a slide.
- Five messages and three charts fighting on one slide.
- Jargon, buzzwords, and unexplained acronyms.
- Tiny fonts, dense tables, or charts with no axis labels.
- Decorative clip art and effects that add nothing.

## Financial model — proving the story

The model behind the deck need not be elaborate, but it must be **honest and internally
consistent**. Investors probe the assumptions, not the spreadsheet's polish.

### Unit economics (the heart of it)

Get these right before anything else — they decide whether growth creates value or burns it.

- **CAC** (Customer Acquisition Cost) = total sales & marketing spend ÷ new customers acquired,
  over the same period. Include *all* the spend, not just ad cost.
- **Gross margin** = (revenue − cost of delivering it) ÷ revenue. The share of each dollar you
  actually keep. Software is high (70–90%); services/hardware much lower.
- **LTV** (Lifetime Value) = (average revenue per customer per period × gross margin) ÷ churn
  rate. Using gross margin, not raw revenue, is what makes LTV honest.
- **LTV:CAC** — a rule of thumb is ≥ 3:1. Below ~1:1 you lose money on every customer; far above
  3:1 may mean you're underinvesting in growth.
- **CAC payback** = CAC ÷ (monthly gross-margin revenue per customer). How many months to earn
  the acquisition cost back. Under ~12 months is healthy for most businesses.

### A minimal revenue build

Build revenue **bottom-up** from drivers, not a top-down "we'll hit $10M." Drivers you can
defend; a target you can only assert.

```
new customers/month  ×  price (ARPU)            = new revenue/month
  + retained customers (prior − churn)          = recurring base
  → total revenue/month → quarter → year
```

Make the **assumptions explicit and editable**: acquisition rate, price, churn, expansion.
The whole model should flex when you change one input cell — that's how you stress-test it.

### Burn & runway

- **Burn** = monthly cash out − cash in (net burn). Track gross burn too if revenue is lumpy.
- **Runway** = cash in bank ÷ monthly net burn = months until you're out of money.
- Tie the **raise to runway**: a round should buy ~18–24 months to the next milestone, with a
  buffer. State explicitly what the money achieves before you'd need to raise again.

### Sanity-checking assumptions

- **Benchmark against reality** — do your conversion, churn, and growth rates resemble
  comparable companies, or do they imply you'll be the best ever? Justify outliers.
- **Bottom-up vs top-down** — if your bottom-up build and your market slide imply wildly
  different scale, one is wrong. Reconcile them.
- **One growth lever at a time** — a model that needs CAC down *and* price up *and* churn down
  *and* market share up simultaneously is a hope, not a plan.
- **Run a downside case** — what if growth is half and CAC is double? If the company dies
  instantly, the plan is too fragile. Show you've thought about it.
- **Cross-foot the numbers** — totals add up, percentages have a base, units are consistent,
  the cash on the model matches the runway you claim.

### Minimal model structure

```
ASSUMPTIONS (one tab/block, every editable input lives here)
  starting customers, monthly new, price/ARPU, monthly churn %,
  gross margin %, CAC, fixed costs (payroll, infra, overhead), starting cash

REVENUE BUILD (driven entirely by Assumptions)
  customers (begin + new − churned) → revenue → gross profit

COSTS
  S&M (implies CAC × new customers) + R&D + G&A + fixed

CASH / RUNWAY
  beginning cash + gross profit − costs = ending cash; net burn; months of runway

DERIVED METRICS (auto-calculated, never typed in)
  CAC, LTV, LTV:CAC, payback months, gross margin, MoM growth
```

## Slide-by-slide checklist

- [ ] One-line description a stranger understands in 5 seconds
- [ ] Problem is specific, painful, and quantified
- [ ] Solution is shown (screenshot/demo), not just described
- [ ] "Why now" names a concrete, recent shift
- [ ] Market sized **bottom-up**; SOM realistic
- [ ] Business model + unit economics on a slide (LTV:CAC, payback)
- [ ] Traction slide leads with the strongest real number
- [ ] GTM is repeatable and affordable, not "it'll go viral"
- [ ] Competition acknowledged honestly; your edge is clear
- [ ] Team slide answers "why you?"
- [ ] Ask states amount, milestones funded, and runway bought
- [ ] Every headline states a takeaway, readable on its own
- [ ] Model assumptions are explicit, editable, and survive a downside case
- [ ] Deck and model agree on the numbers

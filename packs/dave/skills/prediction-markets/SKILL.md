---
name: prediction-markets
description: Analyze prediction markets and betting odds like a trader. Convert any odds to implied probability, strip the vig, compute expected value and Kelly stake sizing, spot mispriced markets, and forecast with base rates plus Bayesian updating and calibration tracking. Use for Polymarket / Kalshi / Manifold / Metaculus questions, sports / election / economic / geopolitical betting, or any "what are the real odds" or "is this a good bet" analysis.
---

# Prediction Markets

Analyze any claim the way a prediction-market trader does: put a number on it, compare that number to what the market is charging, and only bet when you have an edge.

## The core loop

1. **Estimate your probability** of the outcome (see Forecasting below). Anchor on the base rate first, then adjust.
2. **Read the market's implied probability** from its price/odds (see Odds below), and strip the vig so you are comparing apples to apples.
3. **Edge = your_prob - implied_prob.** No edge, no bet. A good story is not a good bet.
4. **Size with Kelly** (fractional), never full-send. Record the bet and the reason.
5. **Review** closed bets: were you calibrated? Update your process, not just your P&L.

## Odds -> implied probability

- Decimal odds d: `implied = 1 / d`.
- American +m (underdog): `implied = 100 / (m + 100)`. American -m (favourite): `implied = m / (m + 100)`.
- Fractional a/b: `implied = b / (a + b)`.
- Prediction-market price (e.g. Polymarket 0.62): the price IS the implied probability (0.62 = 62%).
- **Strip the vig.** A two-way book rarely sums to 100%. Normalize: `true_p_i = implied_i / sum(implied)`. The overround (`sum - 1`) is the house edge you are paying; a market with a fat overround is one to avoid or fade.

## Expected value + staking

- **EV per 1 staked** at decimal odds d with your probability p: `EV = p*(d-1) - (1-p)`. Positive EV means the bet is worth making; the size is a separate question.
- **Kelly fraction** `f = (p*d - 1) / (d - 1)` = edge / odds. Bet fraction f of your bankroll.
- **Use fractional Kelly** (1/4 to 1/2). Full Kelly is too swingy and assumes your probability is exactly right, which it never is. Halve it again when you are unsure of your edge.
- `calc.py` does all of this: `python3 calc.py --decimal 2.10 --p 0.55` prints implied probability, EV, and the fractional-Kelly stake. It also converts American/fractional odds and strips vig from a set of quotes (`python3 calc.py --vig 1.90 2.10`).

## Forecasting method

- **Base rate first.** What normally happens in situations like this? Start there, not at the vivid narrative.
- **Bayesian update** on genuinely new information, not on noise. Headlines are usually noise; a real change in the fundamentals, or a sharp move in the price on volume, is signal.
- **Decompose conditional events.** `P(A and B) = P(A) * P(B|A)`. A multi-leg / parlay outcome is usually rarer than it feels: don't pay for a fixture the bracket hasn't confirmed.
- **Admit uncertainty.** If the evidence is thin, say so and price it wide. Overconfidence after a good run is the classic tilt.
- **Track calibration.** Log every forecast with its probability; score with the Brier score (`mean((p - outcome)^2)`, lower is better; 0.25 is a coin-flip baseline). Being right is luck; being calibrated is skill.

## Where to get live odds

- **Polymarket** — public Gamma API: `https://gamma-api.polymarket.com/markets?closed=false&limit=20` (or a market by slug). Prices are implied probabilities.
- **Kalshi** — `https://api.elections.kalshi.com/trade-api/v2/markets` (yes/no contracts, price in cents = probability).
- **Manifold** — `https://api.manifold.markets/v0/markets` (play-money but well-calibrated crowds; good for the long tail).
- **Metaculus** — `https://www.metaculus.com/api2/questions/` (community forecasts, best for long-horizon questions).
- **Sportsbooks** — for sports, compare the market to the books (the-odds-api, or public book pages for lines). Always strip the vig before trusting a book's implied probability.

## Discipline (the punter's rules)

- The market is usually smart. When you disagree, know exactly why (your edge), not just that you feel it.
- Fade the crowd only when they have piled onto the obvious trade and the price has overshot.
- Separate a short-term news reaction from real information.
- Keep the receipts: every bet, its thesis, and the result. Review the losers hardest.

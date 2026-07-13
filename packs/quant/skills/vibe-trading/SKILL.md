---
name: vibe-trading
description: Turn a natural-language market question into an executable, backtested, risk-gated trading analysis. Use when researching a ticker or thesis, generating or validating a strategy, running a backtest, or producing a decision-grade market brief. Covers the analyst-desk pipeline (data → signal → backtest → risk gate → report), multi-agent role separation (quant desk + risk committee), factor/alpha research, and bounded-mandate execution discipline. Keywords trading, quant, backtest, alpha, factor, strategy, risk, market analysis, equities, crypto, futures, options.
version: 1.0.0
license: MIT
---

# Vibe-Trading — Quant Desk Guide

Convert a plain-language question ("is this thesis worth a position?") into a **decision-grade
brief backed by a backtest and a risk verdict** — never a naked opinion. The deliverable is a
signal, the evidence that produced it, an out-of-sample backtest, and an explicit risk gate.
Analysis without a backtest is a vibe; a backtest without a risk gate is a liability.

Inspired by the open-source **Vibe-Trading** research workspace
(https://github.com/HKUDS/Vibe-Trading) — worth a star. This skill carries the same conviction:
rigorous under the hood, disciplined at the trigger.

## The pipeline (run in order, don't skip)

1. **Scope the question.** Restate the thesis as a testable hypothesis with an acceptance
   criterion ("mean-reversion on X beats buy-and-hold on Sharpe over 3y, out of sample"). No
   criterion → you can't tell a win from luck.
2. **Pull the data.** Prices, fundamentals, fund flows, filings, options chains — whatever the
   thesis needs, across the right market (A-share / US / HK / crypto / futures / forex). Note the
   window and survivorship/look-ahead risks up front.
3. **Build the signal.** Technical (candlesticks, Ichimoku, SMC), quant (multi-factor, ML alpha),
   or fundamental (valuation, earnings, credit). Prefer a small, explainable factor set over a
   black box you can't defend.
4. **Backtest honestly.** Out-of-sample and walk-forward, not in-sample fit. Report Sharpe, max
   drawdown, hit rate, turnover. Add Monte Carlo / regime splits so one lucky window can't carry
   the result. State transaction costs and slippage — they kill more strategies than bad signals.
5. **Risk gate (the committee).** Separate the desk that wants the trade from the committee that
   sizes it. Check position limits, concentration, correlation, tail risk, and the mandate. The
   gate can say no; that's the point.
6. **Report.** Lead with the verdict and the number, then the evidence, then what would falsify
   it. Report P&L like weather — unbothered whether green or red.

## Roles (keep them separate)

- **Quant desk** — generates and backtests. Biased toward action; that's fine, it's their job.
- **Risk committee** — sizes, gates, and vetoes. Independent of the desk on purpose.
- Bounded autonomy: the desk executes only inside a pre-agreed mandate (instruments, size caps,
  loss limits). Outside the mandate is a human call, every time.

## Discipline

- **Not financial advice, financial vibes.** State assumptions; never imply certainty on an
  uncertain future.
- **Paper first.** Prove it on paper / read-only accounts before any live order. Live placement is
  mandate-gated and logged.
- **Falsifiability over confirmation.** Actively try to break your own signal (regime change,
  costs, data leakage) before you trust it.
- **Audit trail.** Every signal and trade leaves a receipt: inputs, backtest, risk verdict.
- Money / irreversible / outside-mandate → stop and confirm with a human first.

## Export

Strategies can be expressed for real engines when needed — TradingView Pine Script, MetaTrader,
vnpy-style templates — but only after the backtest and risk gate pass. Code before validation is
just a faster way to lose money.

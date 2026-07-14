#!/usr/bin/env python3
"""Prediction-markets math: odds -> implied probability, vig removal, EV, Kelly.

Examples:
  python3 calc.py --decimal 2.10 --p 0.55     # implied prob, EV, fractional Kelly
  python3 calc.py --american +120 --p 0.50
  python3 calc.py --frac 6/4 --p 0.45
  python3 calc.py --vig 1.90 2.10             # strip vig from a set of decimal quotes
"""
import argparse


def decimal_from_american(m):
    m = float(m)
    return 1 + (m / 100 if m > 0 else 100 / (-m))


def decimal_from_frac(s):
    a, b = s.split("/")
    return 1 + float(a) / float(b)


def implied(d):            # decimal odds -> implied probability
    return 1.0 / d


def ev(p, d):              # expected value per 1 unit staked
    return p * (d - 1) - (1 - p)


def kelly(p, d):           # full Kelly fraction of bankroll
    b = d - 1
    return (p * b - (1 - p)) / b if b > 0 else 0.0


def main():
    ap = argparse.ArgumentParser(description="prediction-markets odds / EV / Kelly math")
    ap.add_argument("--decimal", type=float)
    ap.add_argument("--american")
    ap.add_argument("--frac")
    ap.add_argument("--p", type=float, help="your probability, 0..1")
    ap.add_argument("--kfrac", type=float, default=0.25, help="fractional-Kelly multiplier (default 0.25)")
    ap.add_argument("--vig", nargs="+", type=float, help="decimal quotes to normalize (strip vig)")
    a = ap.parse_args()

    if a.vig:
        imp = [implied(d) for d in a.vig]
        s = sum(imp)
        print(f"overround (house edge): {(s - 1) * 100:.2f}%")
        for d, i in zip(a.vig, imp):
            print(f"  {d:>6}  raw {i * 100:5.1f}%  ->  true {i / s * 100:5.1f}%")
        return

    if a.american is not None:
        d = decimal_from_american(a.american)
    elif a.frac is not None:
        d = decimal_from_frac(a.frac)
    elif a.decimal is not None:
        d = a.decimal
    else:
        ap.error("give --decimal / --american / --frac (or --vig)")

    print(f"decimal odds:   {d:.3f}")
    print(f"implied prob:   {implied(d) * 100:.1f}%")
    if a.p is not None:
        e = ev(a.p, d)
        k = kelly(a.p, d)
        edge = a.p - implied(d)
        print(f"your prob:      {a.p * 100:.1f}%")
        print(f"edge:           {edge * 100:+.1f} pts")
        print(f"EV per 1:       {e:+.3f}  ({'+EV, bet' if e > 0 else 'no bet'})")
        if k > 0:
            print(f"Kelly (full):   {k * 100:.1f}% of bankroll")
            print(f"Kelly ({a.kfrac:g}x):   {k * a.kfrac * 100:.1f}% of bankroll  <- use this")
        else:
            print("Kelly:          0 (no edge, no stake)")


if __name__ == "__main__":
    main()

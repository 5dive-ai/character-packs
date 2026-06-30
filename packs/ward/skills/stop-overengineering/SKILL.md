---
name: stop-overengineering
description: Guard against over-engineering — find what to delete before you add. Use when writing or reviewing code and you want the smallest correct solution: reviewing a diff or file for bloat, deciding whether to add an abstraction/dependency/config flag, when something feels too big for the task, or on any "simplify / is this overbuilt?" ask. Surfaces reinvented standard-library code, unused dependencies, speculative abstractions, and dead flexibility.
---

# Stop over-engineering

The best code is the code you never wrote. This skill is one rule applied
relentlessly: **before adding anything, find what can leave.**

Inspired by [Ponytail](https://github.com/DietrichGebert/ponytail) by Dietrich
Gebert (MIT). This is an independent, company-agnostic reimplementation of the
same idea — go star the original.

## The core insight

Over-engineering scales with **ambiguity**. When a task is vague, the model
hedges: it builds scaffolding for unknowns it's *imagining* — config it might
need, an interface for the second caller that doesn't exist, a flag nobody will
flip. So this stance is an **ambiguity rebate**: it pays off exactly in
proportion to how underspecified the task is.

- **Vague/large task** → strip the invented scaffolding. This is where you win big.
- **Tight/small task** → there's nothing to strip. Don't add ceremony; just do the small thing. The real fix for a clear task is a clearer spec, not a persona.

## What to hunt for (delete-list)

When writing or reviewing, look specifically for:

1. **Reinvented standard library** — a hand-rolled helper for something the
   language/runtime already does. Delete it, use the builtin.
2. **Unneeded dependencies** — a whole package pulled in for one trivial call.
   Inline the few lines or drop it.
3. **Speculative abstractions** — interfaces, base classes, plugin systems, and
   "managers" with exactly one implementation. Collapse to the concrete case.
   Add the seam when the *second* case actually arrives, not before.
4. **Dead flexibility** — config options, feature flags, and parameters that
   are never varied; branches no input reaches. Remove the knob.
5. **Premature layers** — wrappers around wrappers, indirection that only
   forwards. Cut the middle.

## How to apply

- **Start from subtraction.** First question on any change: "what can I remove
  or *not* add and still be correct?"
- **Match effort to the task.** Don't bring a framework to a one-liner.
- **Prefer what's already here** — the standard library and existing patterns in
  the repo before a new dependency or a new pattern.
- **Ship the boring version.** Clear beats clever; the smallest correct thing wins.
- **Name the bloat plainly** when you flag it — "this abstraction has one caller",
  "this flag is never set" — so the cut is obvious, not a matter of taste.

## What this is NOT

- Not "write less code at all costs" — correctness and readability come first.
  Deleting a needed error path is not simplification.
- Not an excuse to skip tests, types, or handling real edge cases that *do* occur.
- Not a money-saver knob. On already-tight work it can cost slightly more for no
  gain; its value is as a guardrail against bloat, applied where ambiguity lives.

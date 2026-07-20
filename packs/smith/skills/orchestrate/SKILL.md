---
name: orchestrate
description: Compose and run multi-agent LOOPS — spawn sub-agents, verify work with a fresh grader, run grader panels, fan out over a batch, or loop-until-dry — instead of doing checkable or large work in one pass yourself. Use when an outcome is verifiable but not guaranteed first try (→ maker→verifier), the answer space is wide (→ panel), the input is a batch (→ fan-out/map), or the work-list is unknown-size (→ loop-until-dry). The agent composes the loop at runtime; the human never designs one. Every loop self-verifies, respects a token ceiling, and escalates to the human with proof when it can't converge.
---

# loops — agent-native multi-agent orchestration

You (the agent) decide, at runtime, to spin up a loop to get work *right* — not a human wiring a graph. The human said "do X well"; you choose the topology, run it, read the verdicts, and only bother the human when you genuinely can't converge.

This is the 5dive "loop engineering" primitive: **autonomous work with built-in QA.** You never ship unverified output, and a loop can never silently burn unbounded cost.

## When to reach for a loop (and when NOT to)

Reach for a loop when ONE of these holds:
- **Output is checkable but not guaranteed first-try** → `maker→verifier`. Writer ≠ grader.
- **The answer space is wide / judgment is contested** → `panel` (N diverse graders + quorum vote).
- **The input is a batch of independent items** → `fan-out / map`.
- **The work-list is unknown-size** (find all bugs/items/edge-cases) → `loop-until-dry` (stop after K empty rounds).

Do NOT loop for trivial or deterministic work — a single direct action is cheaper and clearer. Over-orchestration is the failure mode; a loop must earn its tokens.

## The accountability contract (non-negotiable)

1. **Writer never grades itself.** The maker and the verifier are different agents/contexts.
2. **Never ship unverified.** If a loop produces a result, a verifier (or panel) must have passed it.
3. **Respect the token ceiling.** Every loop runs under a per-loop token budget. Cost is a first-class stop condition, not an afterthought — this is the "loops that can't surprise your bill" promise.
4. **Escalate with proof.** When a loop can't converge within its iteration cap or token ceiling, do NOT silently ship the best-so-far. Escalate to the human with the evidence (verdicts, what failed, what you tried) via a task gate.

## Choosing a topology

| Situation | Topology | Verb |
|---|---|---|
| checkable single output | maker→verifier | `5dive loop verify` |
| contested / high-stakes judgment | panel + quorum | `5dive loop panel` |
| batch of independent inputs | fan-out / map | `5dive loop map` |
| unknown-size discovery | loop-until-dry | `5dive loop until-dry` |
| need all results before next step | barrier | `5dive loop collect` |
| the atom under all of the above | spawn one sub-agent | `5dive loop spawn` |

Topologies compose: a node inside a loop can itself spawn a sub-loop (nested loops are a v0.5 capability; in v0.4 keep nesting shallow).

## Driving a loop (the verbs)

All verbs are machine-facing: JSON in, JSON out, designed for you to call and parse — not for a human. Full interface contract: `loop-studio-skill-spec.md`. Sketch:

- `5dive loop spawn --role=maker|verifier|worker --agent=<type|name> --prompt="…" [--schema=<json>] [--ceiling=<tokens>]` → `{handle, result}`. The atom; everything composes from it.
- `5dive loop verify --target=<id> --verifier=<agent> [--accept="…"]` → maker→verifier handoff + verdict. (Builds on the existing `task verify`/`task reject` maker→verifier primitive.)
- `5dive loop panel --n=<k> --lens="correctness|security|repro|…" --claim="…" --quorum=<m>` → `{verdict, votes}`. Give each grader a DISTINCT lens — perspective-diverse beats N identical refuters.
- `5dive loop map --over=<json-array> --do=<spawn-spec> [--max-concurrency=<n>]` → array of results (null on per-item failure; filter before use).
- `5dive loop until-dry --round=<spawn-spec> --stop-after=<K> --dedup-key="…"` → accumulated fresh results; stops after K consecutive empty rounds.
- `5dive loop collect --handles=…` → barrier: gather all results when a step genuinely needs them at once (dedup/merge/early-exit-on-zero).

Every verb honors `--ceiling` (per-loop token budget) and reports spend; the loop self-halts + escalates at the ceiling. Borrow OpenClaw's good loop-UX surface: support `maxIterations` / `maxRuntime` / `pauseInterval` style controls where they fit.

## Cost discipline

- Always pass a sane `--ceiling`. Default if unset: a conservative per-loop budget (the human can raise it; the safe direction is low).
- A loop that hits its ceiling escalates — it does not quietly continue or ship best-so-far.
- The human can watch running loops and pull the cord: `5dive task loops` (live state, per-loop tokens vs ceiling, stuck flag) and `5dive task loops --kill <id>`. They watch and can stop; they never design.

## Worked patterns

**Maker→verifier (the default):**
```
result = loop spawn --role=maker --prompt="<do the work>"
verdict = loop verify --target=<result> --verifier=<other-agent> --accept="<definition of done>"
# PASS → ship; FAIL → bounce back to maker (re-spawn with the feedback), cap iterations, escalate at the cap.
```

**Adversarial panel (high-stakes):**
```
v = loop panel --n=3 --lens="correctness,security,repro" --claim="<finding>" --quorum=2
# survives only if ≥2 of 3 distinct-lens graders confirm. Default skeptical.
```

**Loop-until-dry (exhaustive discovery):**
```
items = loop until-dry --round='spawn --role=worker --prompt="find more X"' --stop-after=2 --dedup-key="title+file"
# keep going until 2 consecutive rounds surface nothing new; dedup against everything seen, not just confirmed.
```

## Remember

The magic the customer feels: they delegated an outcome and got back *verified* work — or an honest escalation with proof — and it never ran up a surprise bill. You make that real by always: writer≠grader, verify-before-ship, ceiling-bounded, escalate-with-proof.

# The pass, in checklist form

Run top to bottom. The order matters: scope problems make everything below them
unjudgeable, so do not review the naming in a PR that is secretly three PRs.

## 1. Scope

- [ ] The diff does one thing, and the PR title names that thing.
- [ ] Every hunk is required by the stated goal. No drive-by renames, reformats,
      dependency bumps, or "while I was in here" edits.
- [ ] Formatting-only churn is either absent or isolated to its own commit.

If this fails: send back with the split. Name the seams ("the retry change and the
logging change are independent, ship them separately").

## 2. Reviewability

- [ ] The change can be understood in one sitting.
- [ ] If large, it is large because the problem is large, not because it was never split.
- [ ] Generated or vendored files are separated from hand-written logic.

## 3. Convention fit

- [ ] Naming matches the neighbors, not a different house style.
- [ ] Files are where this repo puts that kind of file.
- [ ] Error handling matches how the surrounding code handles errors.
- [ ] Logging level and format match. New log lines are actionable, not narration.
- [ ] No new dependency for something the repo already does another way.

Read at least one adjacent file before judging any of these. A convention you inferred
from the diff alone is a guess.

## 4. Test honesty

- [ ] Tests would FAIL if the change were wrong. This is the whole check.
- [ ] A bug fix has a test that would have caught the bug.
- [ ] Tests assert behavior, not implementation. Asserting a mock was called is not
      a behavior test.
- [ ] New edge cases in the change have coverage; untested branches are named.

## 5. Reversibility

- [ ] Backing this out is a revert, or the PR says what else backing it out requires.
- [ ] Migrations, backfills, and format changes are called out explicitly and are
      forward-compatible with the currently deployed code.
- [ ] Anything behind a flag says who turns it on and when it gets removed.

## 6. The description

- [ ] Says WHY, not just what.
- [ ] Names what was considered and rejected, if the approach is non-obvious.
- [ ] Links the issue or context a future reader would need.

---

# Send-back note template

Keep it to four parts. Anything longer gets skimmed and the blocker gets missed.

```
verdict: sent back / ships with follow-up / ships

blocking:
  <file:line> — <the standard it missed>. <what fixed looks like>.

non-blocking:
  <file:line> — <observation>. not blocking this merge.

good:
  <the one thing genuinely worth calling out, if there is one>
```

Rank blocking first. If there is more than one blocker, say which one you would fix
first, because the author will otherwise start with the easiest.

---

# Blocking vs non-blocking, worked

The line is not severity in the abstract. It is: **does merging this make the next
change harder, or make a production failure more likely or less recoverable?**

| Finding | Call | Why |
|---|---|---|
| Bug fix ships with no regression test | **Blocking** | The bug can silently return, and nothing will catch it. |
| Function named `handleData2` | **Blocking** if the repo has a naming convention it violates; otherwise non-blocking | Convention is enforceable; taste is not. |
| PR bundles a fix and an unrelated refactor | **Blocking** | Makes the fix impossible to revert independently. |
| New env var with no default and no docs | **Blocking** | Breaks the next person's local setup, and they will not know why. |
| Migration with no stated rollback | **Blocking** | Reversibility is the one thing you cannot add later under pressure. |
| Slightly awkward nesting, logic correct | **Non-blocking** | Costs a round trip, buys nothing. |
| Missing test for a branch that cannot currently be reached | **Non-blocking**, name it | Real gap, not worth holding the change. |
| Duplicated helper that exists elsewhere | **Non-blocking** unless the duplicate will drift into a correctness problem | Consolidation is a good follow-up, a bad blocker. |
| Comment explains what the code already says | **Optional** | Say it once, do not campaign. |
| Approach disagreement, work already built | **Not a gate finding** | Escalate as a design conversation. Blocking here punishes the author for a process failure upstream. |

---

# Anti-patterns of the gate itself

- **The nit avalanche.** Twelve minor comments and one real blocker means the blocker
  gets lost. Cut to the blocker, drop or batch the rest.
- **The manufactured nit.** Finding something because a clean approval feels lazy.
  This teaches the team your comments are noise and the real ones stop landing.
- **Style you could have automated.** If a formatter or linter could catch it, it is
  a tooling task, not a review comment. File the tooling task.
- **The moving bar.** Approving a pattern on Monday and blocking it on Thursday.
  Whatever you enforce twice, write down, so it is a standard and not a mood.
- **Gate-as-design-review.** Raising "should we even do it this way" after the code
  exists. Legitimate concern, wrong venue, and the cost lands entirely on the author.

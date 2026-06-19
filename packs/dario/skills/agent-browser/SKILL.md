---
name: agent-browser
description: Drive a real Chrome browser for end-to-end UI testing and verification via the `agent-browser` CLI (vercel-labs). Use when asked to test a web flow end-to-end, verify a deployed page/feature in a real browser, click through a signup/checkout/referral flow, fill forms, take screenshots of a live site, or reproduce a UI bug. Keywords: browser test, e2e, end-to-end, verify the flow, click through, screenshot the page, check on 5dive.com, Stripe checkout, signup flow. On these 5dive VMs Chrome's user-namespace sandbox is blocked by AppArmor, so ALWAYS launch with `--args "--no-sandbox"`.
---

# agent-browser

Fast browser-automation CLI for AI agents. Drives a real Chrome session that
persists across commands (open once, then click/type/screenshot against the
live page). Installed globally (`/usr/bin/agent-browser`, v0.27.0); Chrome is
installed per-user under `~/.agent-browser/`.

## Critical: launch flag on these VMs

These VMs block Chrome's user-namespace sandbox via AppArmor. **Always pass
`--args "--no-sandbox"` on the launching command** (the first `open`), e.g.:

```bash
agent-browser open https://5dive.com --args "--no-sandbox"
```

If you hit "shared library" errors on launch, install OS deps once:

```bash
agent-browser install --with-deps   # may need sudo for apt packages
```

## Authoritative command reference

The CLI ships version-matched skills — **load these instead of guessing flags**:

```bash
agent-browser skills get core --full   # overview + full command ref + templates
agent-browser skills list              # specialized skills (exploratory testing, etc.)
```

## Common loop

```bash
agent-browser open <url> --args "--no-sandbox"   # launch + navigate
agent-browser snapshot                            # accessibility tree + @refs to target
agent-browser click <sel|@ref>
agent-browser type <sel> "<text>"
agent-browser fill <sel> "<text>"
agent-browser press Enter
agent-browser wait <sel|ms>
agent-browser screenshot /tmp/shot.png            # capture for the user / evidence
agent-browser close                               # end the session
```

Prefer `snapshot` + `@ref` targeting over brittle CSS selectors. Take a
`screenshot` at each meaningful step so findings are verifiable, and `close`
when done so a stale session doesn't leak into the next test.

## Notes

- Session is shared across invocations until `close`; the launch `--args` apply
  to that whole session, so set `--no-sandbox` on the first `open`.
- **React onClick flakiness:** `agent-browser click <@ref>` (ref-clicks like
  `click e47`) don't always fire React `onClick` handlers — observed on the
  5dive pricing/"Get started" buttons. If a ref-click appears to do nothing,
  fall back to a real DOM click via eval:
  ```bash
  agent-browser eval "document.querySelector('SEL').click()"
  ```
  This reliably dispatches the synthetic event React expects.
- **Auth walls can't be automated:** Clerk's Cloudflare Turnstile ("verify you
  are human") + email OTP block automation by design. A flow that hits sign-up
  can only be driven up to that wall unless you have an existing test login or
  OTP access.
- For sensitive flows (signup, Stripe checkout): use disposable/test data only,
  never real cards or real customer credentials.

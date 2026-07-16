---
name: security-review
description: Audit a code change for security vulnerabilities — injection, broken auth/authz, secrets exposure, SSRF, XSS, insecure deserialization, path traversal, unsafe defaults, and supply-chain risk. Use when security-reviewing a diff or PR, threat-modeling a change, or checking whether new code introduces an exploitable weakness. Keywords security review, vulnerability, vuln, threat model, injection, SSRF, XSS, IDOR, authz, secrets, CVE.
version: 1.0.0
license: MIT
---

# Security Review

Audit a change for ways an attacker can abuse it. Default to **skeptical**: a finding only counts if
you can describe who the attacker is, what they control, and how the input reaches the dangerous sink.
Speculation without a reachable path is noise — and noise gets real findings ignored.

## Threat-model the diff

Before scanning for bug classes, model the change:

1. **Identify the trust boundaries the diff crosses.** Where does attacker-controlled data enter?
   (HTTP params, headers, cookies, request body, file uploads, webhook payloads, queue messages,
   DB rows written by another tenant, env from a less-trusted process.)
2. **Trace each tainted input to its sink.** A sink is anything dangerous: a SQL query, a shell
   command, a file path, an HTTP request to a URL, an HTML render, a deserializer, an `eval`. The
   vulnerability is *taint reaching a sink without sanitization in between*.
3. **Check reachability before flagging.** Is the dangerous path actually callable by an attacker?
   Is the input actually untrusted, or is it an internal constant? A "SQL injection" on a string
   that's hardcoded one line up is not a finding.
4. **Ask what the attacker gains.** Read another user's data? Run code? Pivot to internal services?
   Exhaust resources? No impact → no finding.

## Vulnerability classes — spot and fix

| Class | How to spot it | How to fix it |
| --- | --- | --- |
| **SQL injection** | String-concatenated / interpolated queries with tainted input. | Parameterized queries / prepared statements. Never build SQL with string formatting. |
| **Command injection** | `exec`/`system`/`spawn` with a shell and interpolated input; shell metachars (`;` `\|` `` ` `` `$()`) unescaped. | Pass argv as an array (no shell); allowlist the executable; never interpolate into a shell string. |
| **Template / expression injection** | User input rendered as a template or passed to an expression evaluator. | Treat input as data, not template; use auto-escaping; disable code-eval in the template engine. |
| **Authentication gaps** | Endpoint with no auth check; token verified for signature but not expiry/audience; password compared with `==`. | Enforce auth at every entry point; verify exp/aud/iss; constant-time compare. |
| **Authorization gaps (IDOR)** | Object fetched by an ID from the request with no ownership check (`GET /orders/{id}` returns any order). | Scope every query to the authenticated principal; check ownership/role *server-side* on every access. |
| **Secrets in code/logs** | Hardcoded keys/tokens/passwords; secrets logged, put in error messages, or echoed in responses. | Load from a secrets manager/env; scrub secrets from logs and errors; rotate anything committed. |
| **SSRF** | Server fetches a URL built from user input (webhooks, "import from URL," image proxies). | Allowlist hosts/schemes; block private/link-local/metadata IPs (169.254.169.254, 10/8, 127/8); resolve-then-validate to defeat DNS rebinding. |
| **XSS** | User input reflected into HTML without escaping; `innerHTML`/`dangerouslySetInnerHTML`/`v-html`; `Markup`/`\|safe`. | Context-aware output encoding; prefer text APIs (`textContent`); sanitize HTML with a vetted library; CSP as defense-in-depth. |
| **Insecure deserialization** | `pickle`/`yaml.load`/Java native deser / `Marshal.load` on untrusted bytes. | Use a data-only format (JSON); `yaml.safe_load`; never deserialize untrusted objects into live classes. |
| **Path traversal** | File path built from user input; `../` or absolute paths not rejected; archive extraction (zip-slip). | Canonicalize then assert the result stays under the intended root; reject `..`, absolute, and symlinked paths. |
| **Unsafe defaults** | Debug mode on; permissive CORS (`*` with credentials); `verify=False` on TLS; auth disabled "for dev"; world-readable perms. | Secure-by-default; require explicit opt-in for anything loosened; never ship a dev bypass. |
| **Sensitive-data exposure** | PII/credentials in logs, error pages, API responses, or analytics; missing encryption at rest/in transit. | Minimize what's collected/returned; redact in logs; encrypt sensitive fields; scope API responses to need. |
| **Dependency / supply chain** | New dependency from an unvetted source; pinned to a tag not a hash; postinstall scripts; typosquat-looking name. | Vet the package and its maintainer; pin + lockfile + integrity hash; review transitive additions; prefer well-maintained deps. |

## Severity (CVSS-style intuition)

Rate by **impact × reachability**, not by how scary the class sounds.

| Severity | Shape |
| --- | --- |
| **High** | Unauthenticated or low-privilege attacker → RCE, auth bypass, mass data exposure, or cross-tenant access. Reachable in production. |
| **Medium** | Requires some privilege or a precondition; exposure limited to one user's data; or a strong defense-in-depth gap. |
| **Low** | Hard-to-reach, low-impact, or already mitigated by another control — worth noting, not worth blocking on. |

State the assumed attacker and the precondition in the finding so the rating is auditable. If
reachability is uncertain, say so and rate conservatively rather than crying High.

## Writing the finding

> **High — IDOR at `api/invoices.py:88`.** `get_invoice(id)` looks up the invoice by the
> path `id` with no check that it belongs to `request.user`. Any authenticated user can read any
> invoice by incrementing the ID. **Fix:** scope the query — `Invoice.objects.get(id=id,
> org=request.user.org)` — and return 404 (not 403) on mismatch to avoid confirming existence.

Point at `file:line`, name the attacker and the path, state the impact, give the fix. Don't dump a
generic OWASP paragraph — tie it to *this* code.

## Checklist

- [ ] I identified every trust boundary the diff crosses and where tainted input enters
- [ ] For each finding I traced input → sink and confirmed the path is reachable by an attacker
- [ ] Queries are parameterized; no string-built SQL
- [ ] Shell calls pass argv arrays; no input interpolated into a shell string
- [ ] Every object access is authorization-checked against the authenticated principal (no IDOR)
- [ ] Auth tokens verified for signature **and** expiry/audience; secrets compared constant-time
- [ ] No secrets in code, logs, errors, or responses
- [ ] User-controlled URLs are host-allowlisted and block private/metadata IP ranges (SSRF)
- [ ] User input reaching HTML is context-encoded; no raw `innerHTML`-equivalents
- [ ] No untrusted input deserialized into live objects; file paths canonicalized under a root
- [ ] No loosened defaults (CORS `*`+creds, TLS verify off, debug on, dev auth bypass)
- [ ] New dependencies vetted, pinned with integrity hashes; transitive additions reviewed
- [ ] Every finding has an assumed attacker, a reachability statement, and a severity

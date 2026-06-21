---
name: claude-api
description: Build applications on the Anthropic Claude API — the Messages API, model selection, streaming, tool use / function calling, structured output, prompt caching, and token counting. Use when integrating Claude into an app, choosing a model, calling the API from curl or an SDK, building an agent loop, or debugging tool calls and streaming. Keywords Claude API, Anthropic API, Messages API, anthropic SDK, tool use, function calling, prompt caching, streaming, claude-opus, claude-sonnet.
version: 1.0.0
license: MIT
---

# Building on the Claude API

Everything goes through one endpoint: `POST /v1/messages`. Tools, streaming, and structured output
are all features of that single request — not separate APIs. This skill covers the shapes you need
to ship.

> Model IDs and feature availability change. The IDs below are current as of this writing; for the
> latest, check the docs (`https://docs.claude.com`) or `GET /v1/models`.

## Choosing a model

| Tier | Model ID | Use when |
| --- | --- | --- |
| **Most capable** | `claude-opus-4-8` | Agents, hard reasoning, long-horizon coding, anything correctness-sensitive. |
| **Balanced** | `claude-sonnet-4-6` | High-volume production work, good speed/quality tradeoff. |
| **Fast / cheap** | `claude-haiku-4-5` | Classification, simple extraction, latency-critical or high-throughput tasks. |

**Default to the latest most capable model (`claude-opus-4-8`) for agents and anything non-trivial.**
Drop to Sonnet for volume and Haiku for simple/fast — but downgrading for cost is the caller's call,
not a silent default. Use the exact ID string as-is; don't append date suffixes.

## The Messages API

Three things make a request: `model`, `max_tokens`, and `messages`. `system` is a top-level field,
not a message. The API is **stateless** — resend the full conversation each turn.

### Minimal curl

```bash
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-opus-4-8",
    "max_tokens": 1024,
    "system": "You are a concise assistant.",
    "messages": [{"role": "user", "content": "What is the capital of France?"}]
  }'
```

### Minimal SDK

```python
# pip install anthropic
import anthropic
client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY from env

msg = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    system="You are a concise assistant.",
    messages=[{"role": "user", "content": "What is the capital of France?"}],
)
# content is a list of blocks — check .type before reading .text
print(next(b.text for b in msg.content if b.type == "text"))
```

```javascript
// npm install @anthropic-ai/sdk
import Anthropic from "@anthropic-ai/sdk";
const client = new Anthropic(); // reads ANTHROPIC_API_KEY

const msg = await client.messages.create({
  model: "claude-opus-4-8",
  max_tokens: 1024,
  system: "You are a concise assistant.",
  messages: [{ role: "user", content: "What is the capital of France?" }],
});
console.log(msg.content.find((b) => b.type === "text").text);
```

**Rules:** first message must be `user`; `content` is a string or a list of typed blocks;
`stop_reason` tells you why it ended (`end_turn`, `max_tokens`, `tool_use`, `refusal`). Pick
`max_tokens` generously — hitting the cap truncates mid-output. ~1024 for short replies, higher for
long generations (stream those — see below).

## Streaming

Stream anything with long input/output or high `max_tokens` — it avoids HTTP timeouts and lets you
render tokens live. Use the SDK helper and `get_final_message()` if you don't need per-token events.

```python
with client.messages.stream(
    model="claude-opus-4-8",
    max_tokens=4096,
    messages=[{"role": "user", "content": "Write a short story."}],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
    final = stream.get_final_message()  # full Message after streaming
```

```javascript
const stream = client.messages.stream({
  model: "claude-opus-4-8",
  max_tokens: 4096,
  messages: [{ role: "user", content: "Write a short story." }],
});
stream.on("text", (t) => process.stdout.write(t));
const final = await stream.finalMessage();
```

## Tool use (function calling)

You define tools with a JSON Schema; Claude decides when to call them; **your code executes them**
and feeds results back. The loop: send tools → Claude returns a `tool_use` block → you run it →
send a `tool_result` → repeat until `stop_reason` is `end_turn`.

```python
tools = [{
    "name": "get_weather",
    "description": "Get current weather for a city. Call when the user asks about weather.",
    "input_schema": {
        "type": "object",
        "properties": {"city": {"type": "string", "description": "City name"}},
        "required": ["city"],
    },
}]

messages = [{"role": "user", "content": "What's the weather in Paris?"}]
while True:
    resp = client.messages.create(
        model="claude-opus-4-8", max_tokens=1024, tools=tools, messages=messages
    )
    if resp.stop_reason != "tool_use":
        break
    messages.append({"role": "assistant", "content": resp.content})
    results = []
    for block in resp.content:
        if block.type == "tool_use":
            output = run_tool(block.name, block.input)   # your implementation
            results.append({
                "type": "tool_result",
                "tool_use_id": block.id,        # must match the tool_use id
                "content": str(output),
            })
    messages.append({"role": "user", "content": results})  # ALL results in one user message
```

Key points:
- Write **prescriptive descriptions** — say *when* to call the tool, not just what it does.
- Multiple `tool_use` blocks can come back at once; return **all** `tool_result`s in a **single**
  user message (splitting them trains Claude to stop calling in parallel).
- On a failed tool, return the `tool_result` with `"is_error": true` — don't drop it.
- `tool_choice`: `{"type": "auto"}` (default), `{"type": "any"}` (must use one),
  `{"type": "tool", "name": "..."}` (force one), `{"type": "none"}`.
- Most SDKs ship a **tool runner** helper that drives this loop for you when you don't need
  per-step control.

## Structured output

To get schema-valid JSON back, define a tool whose `input_schema` is your target shape and force it
with `tool_choice` — the `tool_use.input` is your structured object:

```python
resp = client.messages.create(
    model="claude-opus-4-8", max_tokens=1024,
    tools=[{
        "name": "extract_contact",
        "description": "Extract contact info from the text.",
        "input_schema": {
            "type": "object",
            "properties": {
                "name": {"type": "string"},
                "email": {"type": "string"},
                "wants_demo": {"type": "boolean"},
            },
            "required": ["name", "email", "wants_demo"],
        },
    }],
    tool_choice={"type": "tool", "name": "extract_contact"},
    messages=[{"role": "user", "content": "Jane Doe (jane@co.com) asked for a demo."}],
)
data = next(b.input for b in resp.content if b.type == "tool_use")
# {"name": "Jane Doe", "email": "jane@co.com", "wants_demo": True}
```

Always parse tool inputs as JSON objects (the SDK already gives you `block.input` parsed) — never
raw-string-match the serialized input.

## Prompt caching

Cache a large, stable prefix (system prompt, big context, tool definitions) so repeated requests pay
~10% of the input cost for the cached part. Put `cache_control` on the **last stable block**; caching
is a **prefix match**, so any byte change before the breakpoint invalidates everything after it.

```python
resp = client.messages.create(
    model="claude-opus-4-8", max_tokens=1024,
    system=[{
        "type": "text",
        "text": LARGE_STABLE_CONTEXT,            # e.g. a long document or instruction set
        "cache_control": {"type": "ephemeral"},  # default TTL ~5 min
    }],
    messages=[{"role": "user", "content": "Summarize the key points."}],
)
print(resp.usage.cache_read_input_tokens)  # >0 means a cache hit
```

Rules of thumb: keep stable content first, volatile content (timestamps, per-request IDs, the
varying question) *after* the breakpoint. Don't interpolate `datetime.now()` or a UUID into the
system prompt — it busts the cache every request. Verify with `usage.cache_read_input_tokens`; if
it's stubbornly zero across identical-prefix requests, something upstream is changing the bytes.

## Token counting

Don't estimate with `tiktoken` (it's OpenAI's tokenizer and undercounts Claude). Count against the
model you'll actually use:

```python
n = client.messages.count_tokens(
    model="claude-opus-4-8",
    messages=[{"role": "user", "content": open("doc.md").read()}],
).input_tokens
```

## Errors worth handling

Catch typed exceptions, most-specific first — don't string-match messages.

| Status | Meaning | Retry? |
| --- | --- | --- |
| 400 | Bad request (malformed, bad params) | No |
| 401 / 403 | Bad/insufficient key | No |
| 404 | Unknown model or endpoint | No |
| 429 | Rate limited — honor `retry-after` | Yes (backoff) |
| 5xx / 529 | Server error / overloaded | Yes (backoff) |

The SDKs auto-retry 429/5xx with exponential backoff (default 2 retries) — only hand-roll retries
for behavior beyond that.

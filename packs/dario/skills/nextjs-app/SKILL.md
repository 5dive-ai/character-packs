---
name: nextjs-app
description: Building web apps with Next.js (App Router) — routing, Server Components, server actions, data fetching, and deploying to Vercel. Use when creating or extending a Next.js web app, adding routes/pages/layouts, fetching data, mutating with server actions, or shipping to production. Keywords Next.js, App Router, React Server Components, RSC, server actions, Vercel.
version: 1.0.0
license: MIT
---

# Next.js Web App Development Guide

Build production web apps with **Next.js (App Router)** — the React framework for full-stack
apps. Pairs with the `heroui-react` skill for UI and `playwright-e2e` for verification.

> App Router only. Ignore Pages Router (`pages/`) patterns — `getServerSideProps`,
> `getStaticProps`, `_app.tsx`, and `next/router` are legacy. Use `app/`, Server Components,
> and `next/navigation`.

## Create a new app

```bash
npx create-next-app@latest my-app --ts --app --tailwind --eslint
cd my-app
npm run dev   # http://localhost:3000
```

## Routing — the `app/` directory

Routes are folders; the file inside defines what renders.

| File              | Role                                                        |
| ----------------- | ----------------------------------------------------------- |
| `page.tsx`        | The route's UI (publicly addressable)                       |
| `layout.tsx`      | Shared shell wrapping children; persists across navigation  |
| `loading.tsx`     | Instant loading UI (Suspense boundary)                      |
| `error.tsx`       | Error boundary (must be a Client Component)                 |
| `not-found.tsx`   | 404 UI                                                      |
| `route.ts`        | API endpoint (GET/POST/… handlers) — no `page.tsx` alongside |

```
app/
  layout.tsx            # root layout (<html><body>)
  page.tsx              # /
  dashboard/
    layout.tsx          # /dashboard shell
    page.tsx            # /dashboard
    [id]/page.tsx       # /dashboard/:id   (dynamic segment)
  api/
    health/route.ts     # GET /api/health
```

Dynamic params arrive as props (async in current Next.js):

```tsx
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <h1>Item {id}</h1>
}
```

## Server vs Client Components

Components are **Server Components by default** — they run on the server, can be `async`, and
ship zero JS. Add `'use client'` at the top of a file only when you need interactivity
(`useState`, `useEffect`, event handlers, browser APIs).

```tsx
// Server Component (default): fetch directly, no useEffect, no loading spinner plumbing
export default async function Page() {
  const res = await fetch('https://api.example.com/items', { cache: 'no-store' })
  const items = await res.json()
  return <ItemList items={items} />
}
```

```tsx
'use client'
import { useState } from 'react'
export function Counter() {
  const [n, setN] = useState(0)
  return <button onClick={() => setN(n + 1)}>{n}</button>
}
```

Rules of thumb:
- Keep `'use client'` at the **leaves**. A server page can render client components, but a
  client component can't render a server component (pass it as `children`/props instead).
- Never put secrets, DB calls, or large deps in a client component — they ship to the browser.
- `fetch` is extended: `{ cache: 'force-cache' }` (default, static), `{ cache: 'no-store' }`
  (dynamic), or `{ next: { revalidate: 60 } }` (ISR, re-fetch every 60s).

## Data mutations — Server Actions

Mutations run on the server via `'use server'` functions called directly from forms/handlers —
no API route boilerplate.

```tsx
// app/actions.ts
'use server'
import { revalidatePath } from 'next/cache'

export async function createPost(formData: FormData) {
  const title = String(formData.get('title'))
  await db.post.create({ data: { title } })   // your DB call
  revalidatePath('/posts')                     // refresh the cached list
}
```

```tsx
import { createPost } from './actions'
export default function NewPost() {
  return (
    <form action={createPost}>
      <input name="title" />
      <button type="submit">Create</button>
    </form>
  )
}
```

- `revalidatePath('/x')` / `revalidateTag('x')` bust the cache after a write.
- `redirect('/x')` (from `next/navigation`) after a successful mutation.
- Validate input server-side (e.g. with `zod`) — actions are public endpoints.

## API routes (when you need a real endpoint)

```ts
// app/api/items/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ items: [] })
}
export async function POST(req: Request) {
  const body = await req.json()
  return NextResponse.json({ ok: true, body }, { status: 201 })
}
```

Use route handlers for webhooks, third-party callbacks, and non-React consumers. For
in-app mutations prefer server actions.

## Navigation

```tsx
import Link from 'next/link'          // declarative; prefetches in viewport
<Link href="/dashboard">Go</Link>

'use client'
import { useRouter } from 'next/navigation'   // imperative (NOT next/router)
const router = useRouter(); router.push('/dashboard')
```

## Metadata & SEO

```tsx
// Static
export const metadata = { title: 'Dashboard', description: '…' }
// Dynamic
export async function generateMetadata({ params }) {
  const { id } = await params
  return { title: `Item ${id}` }
}
```

## Environment variables

- Server-only: `process.env.MY_SECRET` (never exposed to the browser).
- Public (inlined at build): must be prefixed `NEXT_PUBLIC_`.
- Local: `.env.local` (gitignored). Production: set in the host (Vercel project settings).

## Common gotchas

- "useState is not a function" / hook errors → missing `'use client'`.
- A client-published key (e.g. an auth publishable key) **inlines at build time**, not at
  `next start` — rebuild after changing `NEXT_PUBLIC_*`, or the old value sticks.
- `fetch` defaults to caching; pass `no-store`/`revalidate` for fresh data.
- Don't import server-only modules (DB clients, `fs`) into client components.

## Build & ship

```bash
npm run build && npm run start      # production build + serve locally
npx vercel                          # preview deploy
npx vercel --prod                   # production deploy
```

Vercel auto-detects Next.js; set env vars in the project dashboard. For other hosts, run
`next build` and serve with `next start` behind a Node process (or use `output: 'standalone'`).

## Verify it works

Don't call a change done on a green build alone — drive the real page. Use the
`playwright-e2e` skill to click through the actual flow (especially authed routes) before
shipping.

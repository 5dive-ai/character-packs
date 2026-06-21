---
name: seo
description: Improving organic search rankings through technical and content SEO — keyword/intent research, on-page optimization, crawlability, structured data, Core Web Vitals, topic clusters, and measuring results in Search Console. Use when the user wants to rank a page, fix a technical SEO issue, plan content for search, audit a site, recover lost traffic, or asks "why isn't this ranking." Keywords SEO, search engine optimization, keywords, SERP, ranking, meta tags, schema, structured data, Core Web Vitals, Search Console, backlinks, canonical, sitemap.
version: 1.0.0
license: MIT
---

# SEO

Rankings follow relevance and authority. Most "SEO advice" is busywork that moves neither.
Spend your time on the three things that actually move rankings: matching search intent,
being technically crawlable, and earning links/citations. Everything else is hygiene.

## What moves the needle vs cargo cult

| Actually moves rankings              | Cargo cult (skip or stop)                          |
| ------------------------------------ | -------------------------------------------------- |
| Matching the intent behind the query | Keyword density / "use the keyword 7 times"        |
| Genuinely useful, current content    | Spinning thin pages for every keyword variant      |
| Internal links from relevant pages   | Meta keywords tag (dead since ~2009)               |
| Editorial backlinks from real sites  | Buying links, PBNs, comment-spam                   |
| Fast, crawlable, indexable pages     | Exact-match domains, hidden text, "LSI keywords"   |
| Topical depth (cluster of pages)     | Submitting your URL to 500 search engines          |

If a tactic doesn't make the page more useful, faster, or more linkable, it's probably a waste.

## 1. Keyword & intent research

Volume is a vanity number. **Intent** is the unit of work. Every query maps to one of four:

| Intent        | Query shape                  | What ranks                        | Your move                |
| ------------- | ---------------------------- | --------------------------------- | ------------------------ |
| Informational | "how to", "what is", "best"  | Guides, tutorials, listicles      | Educational content      |
| Commercial    | "X vs Y", "best X for Z"     | Comparisons, reviews, roundups    | Comparison/eval content  |
| Transactional | "buy", "pricing", "X tool"   | Product/pricing/category pages    | Money pages              |
| Navigational  | a brand or product name      | The official site                 | Own your brand SERP      |

**Process:**
1. Pull seed terms (the words customers actually use — mine support tickets, reviews, sales calls, not your internal jargon).
2. Expand with a keyword tool, "People Also Ask," and autocomplete.
3. **Open the SERP for the target query.** Whatever Google currently ranks IS the intent. If page 1 is all listicles and you wrote a product page, you'll lose — change the format, not the keyword.
4. Score each keyword: `priority = relevance × (achievable difficulty) × business value`. Chase winnable terms, not the biggest volume.
5. Target long-tail (3+ words) early — lower competition, higher intent, faster wins. Earn authority, then climb to head terms.

## 2. On-page optimization

| Element        | Rule                                                                          |
| -------------- | ----------------------------------------------------------------------------- |
| Title tag      | ~50–60 chars, primary keyword near the front, written for the click not the bot |
| Meta description | ~150–160 chars; doesn't affect rank but drives CTR — write it like ad copy   |
| H1             | One per page, states the topic, close to the title                            |
| H2/H3          | Structure for scanning; mirror the questions in "People Also Ask"             |
| URL slug       | Short, lowercase, hyphenated, keyword-bearing — `/blue-widgets` not `/p?id=8347` |
| First 100 words| State what the page is and answer the query early — don't bury the lede       |
| Internal links | Link to/from related pages with descriptive anchor text (not "click here")    |
| Images         | Descriptive `alt` text; compressed; lazy-load below the fold                  |

Internal linking is the most underused on-page lever: it passes authority to money pages and tells crawlers your site structure. Link new posts from existing high-authority pages.

## 3. Technical SEO

If Google can't crawl, render, and index it, nothing else matters.

- **Crawlability:** logical site structure, every important page reachable within ~3 clicks of the homepage. Check Search Console → Pages for "Crawled, not indexed" / "Discovered, not indexed."
- **robots.txt:** block crawlers only from genuinely useless paths (cart, internal search, faceted dupes). Never accidentally `Disallow: /`.
- **XML sitemap:** list canonical, indexable URLs only; submit in Search Console; keep it auto-generated and fresh.
- **Canonicals:** `<link rel="canonical">` on every page to its preferred URL. Pick one host (www vs non-www, http vs https) and 301 the rest. Kills duplicate-content dilution.
- **Status codes:** 301 (not 302) for permanent moves; fix 404s on linked pages; avoid redirect chains.
- **Indexability:** watch for stray `noindex` tags and `Disallow` rules shipped by accident — the classic way to nuke traffic in a deploy.
- **Mobile:** Google indexes the mobile version. If it's broken on mobile, it's broken.
- **JS rendering:** client-only content may not get indexed reliably. Server-render or pre-render anything that must rank.

### Structured data (schema.org)

JSON-LD in the `<head>`. Doesn't directly boost rank but earns **rich results** (stars, FAQ, prices) that lift CTR. Match type to content: `Article`, `Product` + `Offer`, `FAQPage`, `HowTo`, `BreadcrumbList`, `Organization`, `LocalBusiness`. Validate with Google's Rich Results Test. Only mark up content actually visible on the page — fake markup gets manual penalties.

### Core Web Vitals (target the "good" threshold)

| Metric | Measures              | Good      | Common fix                                      |
| ------ | --------------------- | --------- | ----------------------------------------------- |
| LCP    | Largest paint         | ≤ 2.5 s   | Optimize hero image, preload, faster server/CDN |
| INP    | Interaction latency   | ≤ 200 ms  | Break up long JS tasks, defer non-critical JS   |
| CLS    | Visual stability      | ≤ 0.1     | Set width/height on images, reserve ad/space    |

CWV is a tiebreaker, not a magic ranking lever — fix it because it helps conversions and because it's a ranking signal at the margin, not because it'll vault you from #20 to #1.

## 4. Content & E-E-A-T

- **Topic clusters:** one pillar page (broad term) linked to many cluster pages (specific subtopics), all interlinked. Beats scattered one-off posts — builds topical authority and a clean internal-link graph.
- **Match the format the SERP rewards.** If page 1 is step-by-step guides, ship a better step-by-step guide.
- **E-E-A-T** (Experience, Expertise, Authoritativeness, Trust): show real authorship, cite sources, keep content current (refresh dates + actual updates), and earn mentions. Matters most for YMYL topics (health, finance, legal).
- **Refresh beats republish:** updating a decaying post that already ranks is usually higher-ROI than writing a new one.

## 5. Off-page / links

Backlinks remain a top-tier ranking factor. Quality over quantity — one editorial link from a relevant authoritative site beats 100 directory links.

- Earn them: genuinely linkable assets (original data, tools, definitive guides), digital PR, guest posts on relevant sites, getting cited as a source.
- Avoid: paid links, link exchanges at scale, PBNs — these risk manual penalties.
- Track referring domains, not raw link count.

## Audit checklist

```
Indexing
[ ] Site indexed? (site:domain.com in Google; Search Console coverage)
[ ] No accidental noindex / robots Disallow on important pages
[ ] One canonical host; http→https and non-www→www (or vice versa) 301'd
[ ] XML sitemap submitted, lists only canonical indexable URLs
On-page
[ ] Unique title + meta description per page, correct length
[ ] One H1; logical heading hierarchy
[ ] Internal links to/from money pages with descriptive anchors
[ ] Image alt text + compression
Technical
[ ] Core Web Vitals in "good" on mobile (Search Console / PageSpeed)
[ ] No broken internal links / redirect chains
[ ] Valid structured data for page type (Rich Results Test)
[ ] Mobile rendering correct; key content server-rendered
Content
[ ] Format matches current SERP intent
[ ] Clear authorship, sources, recency for YMYL
[ ] Pillar + cluster structure for priority topics
Off-page
[ ] Referring-domain trend flat or growing
[ ] No spammy/toxic link spikes
```

## Measuring (Search Console first)

Search Console is ground truth for organic — analytics tools estimate, Google reports.

- **Impressions:** how often you appeared. Rising = you're ranking for more/bigger queries.
- **Clicks:** actual visits. Clicks ÷ impressions = **CTR**.
- **Average position:** where you rank. Watch per-query, not site-wide (the average hides everything).
- **Diagnose with the Queries + Pages tabs:** high impressions + low CTR → fix title/meta or you're ranking too low for the query. High position + low clicks → SERP feature is eating the click (answer box, ads).
- Give changes **4–8 weeks** before judging. SEO is slow; don't A/B-panic over a 2-day dip.

Vanity to ignore: "keyword rankings" dashboards detached from clicks/conversions, Domain Authority as a goal (it's a third-party estimate, not a Google metric).

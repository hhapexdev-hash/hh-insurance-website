# hhinsgroup.com — Redesign Teardown & Proposal (2026-06-10)

**Deliverables:** this strategy doc + a complete working prototype site at
`docs/website-redesign/` — open `index.html` in any browser; every page is
cross-linked (shared `style.css` + `script.js`, no build step):

| File | Page |
|---|---|
| `index.html` | **The site = the Concierge** (v7): a full-screen chat front door. Coverage, the story, reviews, business/COI, careers, and contact all live as chat journeys — no separate pages |
| `quote.html` | The transaction surface: simulated 3-step instant-quote flow (chat and the header CTA feed it; deterministic sample pricing) |
| `storm-center.html` | The one content page kept: printable 2026 prep checklist, first-48-hours claims steps, flood-zone lookup — things you bookmark, print, and share mid-storm |
| `styleguide.html` | Internal design-system handoff (not in public nav) |

> **v7 — the chat-maximalist cut (HH's call):** 13 public pages → **3**.
> `insurance`, `flood`, `about`, `reviews`, `business`, `learn`, `careers`,
> `contact`, and the standalone `concierge` page were removed; everything
> they did now happens inside the conversation (richer journeys: COI →
> csr@ handoff, reviews and careers as chat answers with real outbound
> links, contact folded into the human handoff, learn links target HH's
> live published guides). Pages survive only where a page beats a chat:
> the **quote flow** (forms transact) and the **Storm Center** (print,
> bookmark, share during a storm). *Known trade-off:* fewer indexable
> pages narrows the SEO/AEO surface — mitigation is that HH's existing
> WordPress guide library stays live at hhinsgroup.com (the KB cites it),
> and production can re-add thin content/landing pages purely as search
> surfaces later without touching the chat-first navigation.

> **v4 — Storm Mode (operational design):** a site-wide demo state, toggled
> from the prototype banner on any page (persists via localStorage). When ON:
> an advisory bar appears under every header, the homepage swaps its seasonal
> pill for an honest binding-pause notice, the Storm Center status flips to
> an active advisory, and the quote flow explains that carriers pause *new*
> binding while a storm is in the box (quotes still run; binding resumes in
> request order). In production this state would key off the NHC feed — the
> point is that the website has a plan for the week that matters most.
> Also in v4: sample address autocomplete in the quote flow, results that
> react to the roof answer (wind-mitigation credits applied, or the $150
> inspection tip), and premiums that count up when revealed.

> **v3 (same day — "make it better" round three):** the promise became a
> demo. `quote.html` simulates the address → details → side-by-side options
> flow end-to-end (clearly flagged sample pricing; production swaps step 3
> for the live rater). Plus: automatic dark mode (token-driven,
> `prefers-color-scheme`), a quiet carrier marquee in the hero (Safeco,
> Travelers, Nationwide, The Hartford, Foremost, Main Street America,
> National General, Hagerty), word-by-word hero headline reveal, and
> cross-document view transitions where supported.

> **v2 (same day, per feedback — "more modern, less busy"):** the prototype
> was rebuilt around a calmer, editorial direction. Eight blocks instead of
> fourteen; centered hero with a single address field; coverage tabs replaced
> by three plain link columns; cards/shadows/tints replaced by hairlines and
> whitespace; one accent color used only where we want a click. §6–§7
> describe this system; the full page set above is built in it.

---

## 0. How this audit was done (and one finding it produced immediately)

The site's WAF/bot-protection returns **HTTP 403 to every non-browser fetcher**
we tried (standard fetchers, reader proxies; archive.org was unreachable from
this environment). The audit below is therefore reconstructed from the search
index (every indexed page title, snippet, and URL), third-party profiles (BBB,
Yelp, Glassdoor, Safeco/Travelers agent locators, Business Observer,
riskeducation.org), and the affiliate site mminsures.com.

That blocking is itself **finding #1**: in 2026 a meaningful share of insurance
shoppers start in AI assistants (ChatGPT, Perplexity, Claude, Google AI
Overviews). If those crawlers and agents get 403s, HH is invisible exactly
where high-intent "who's the best flood agency in St. Pete" questions are now
being answered. Allowlist the major AI/answer-engine crawlers (GPTBot,
ClaudeBot, PerplexityBot, Google-Extended at minimum) in the WAF and verify
with each vendor's published IP ranges. This is a config change, not a
redesign, and it may be the highest-ROI item in this whole document.

---

## 1. The site today (reconstructed map)

```
/                                   "Florida Insurance Experts: Instant Quotes"
                                    Address-entry instant home quote on the homepage
/insurance/                         Products hub — "An Exceptional SW Florida Insurance Agency"
/insurance/florida-homeowners-insurance/        (+ city children, e.g. .../florida-homeowners-insurance-sanibel/)
/insurance-homeowners-insurance-tampa/          ← Tampa page is a FLAT root URL (inconsistent)
/flood-insurance-in-florida/                    ← flood product page also FLAT, not under /insurance/
/insurance/auto/                    "Best Auto Insurance Specialists in SW Florida"
/insurance/business-auto/           "Florida's Cheapest Commercial Auto Insurance"
/insurance/boat-marine/             (+ /ft-myers/ child)
/insurance/boat-builders-insurance/
/insurance/professional-liability-insurance-quote/
/insurance/personal-umbrella-insurance/
/insurance/commercial-umbrella-insurance/
/about/  /about/letters-to-customers/  /testimonials/  /contact-us/
/blog/                              "No-Nonsense Florida Insurance Blog | HHI Insurance"
/<post-slug>/                       ALL blog posts live at root (flood, umbrella, market explainers)
/tag/...                            tag archives are indexed
/coffeewithhh1/                     video recap page on a one-off slug
/recruitment/                       SERP title literally reads "Recruitment Landing Page"
/author/admin/                      Jake's author page is "admin"
```

Platform: WordPress. Quote engine: an online rater (shared with affiliate MM
Insurance) fronted by an address-entry field on the homepage.

**Contact/NAP:** 9887 4th St N, Ste 200, St. Petersburg FL 33702 ·
(727) 498-5551 · sales@/csr@hhinsgroup.com · Mon–Fri 7:00am–5:30pm.

---

## 2. What's genuinely working (keep and amplify)

1. **Address-first instant quoting on the homepage.** Most independent-agency
   sites bury "get a quote" behind a long form or a callback. This is HH's
   structural differentiator — the redesign should make it *the* hero, not
   one element among many.
2. **A real expertise moat in flood + hurricane.** A dozen-plus indexed
   explainers (Risk Rating 2.0, NFIP limits, excess flood, flood-zone maps,
   Helene/Milton retrospectives, 2025 market outlooks). This is exactly the
   content Floridians — and answer engines — search for.
3. **A founder who is a media asset.** Jake Holehouse: CPCU (top ~0.5% of the
   industry), M.S. in Risk Management (FSU), Business Observer 40-under-40,
   and a recurring on-air explainer for Tampa Bay news segments on rates,
   Citizens, and storm coverage. Almost none of this is surfaced on the site.
4. **A great origin story.** Family insurance roots since **1979**
   (Holehouse Insurance → sold to Regions), restarted from **zero in June
   2018** by Jake and his father Ron, grown to a **45+ person team** with
   service awards. "We started at zero" is a better brand line than any
   superlative on the site today.
5. **Named-human service reviews.** Public reviews repeatedly praise specific
   agents (Landon, Julie Lowe, Christian, Joe) — after-hours answers, a
   $1,500 renewal save. That's the proof the "personal touch" claim needs.
6. **Rare specialties.** Marine including *boat builders'* coverage (hull,
   MOLL, marine liability, product liability) and collector auto (Hagerty
   partner). Few Florida agencies can say this.
7. **Early hours.** Phones open at 7:00am — an easy trust signal nobody
   merchandises.

---

## 3. What's holding it back

1. **Identity diffusion.** The site calls the firm "HH Insurance,"
   "Holehouse Insurance," and "HHI Insurance" across SERP titles, and waffles
   between "SW Florida," "Tampa Bay," and "Florida." HQ is St. Petersburg
   (Tampa Bay) with reach across the state — but page titles say "SW
   Florida" on the testimonial, contact, and hub pages. Pick one architecture:
   **HH Insurance — St. Petersburg-born, serving all of Florida** — and apply
   it everywhere (site, GBP, Yelp — which currently categorizes the firm
   under *Auto Insurance*, and one aggregator lists it under *Legal
   Services*).
2. **Superlative-stuffed SEO titles that undercut credibility.**
   "Florida's *Cheapest* Commercial Auto," "*Best* Auto Insurance
   Specialists," "*Top* Commercial Umbrella," "SW Florida's *Best* Umbrella
   Provider." A CPCU-led agency quoting 40+ carriers shouldn't sound like a
   coupon site; modern E-E-A-T also discounts unverifiable superlatives.
   Rewrite around specificity: "Commercial auto from 14 carriers, quoted in
   one call."
3. **Incoherent information architecture.** Product pages split between
   `/insurance/...` and flat root URLs; blog posts all at root; tag archives
   indexed; keyword-stuffed child slugs
   (`/florida-homeowners-insurance-sanibel/`); video series on `/coffeewithhh1/`.
   This dilutes topical authority precisely where HH is strongest (flood).
4. **The expertise is invisible at the brand level.** The flood library, the
   TV segments, the CPCU, the 1979’2018→45-person story — none of it is part
   of the homepage narrative (the homepage sells "instant quotes" generically).
5. **Sloppy artifacts in the index.** "Recruitment Landing Page" as a live
   title; `/author/admin/` for the founder; "HHI Insurance" typo'd brand in
   the blog title tag. Small, but they read as neglect to both users and
   ranking systems.
6. **No commercial-client service story.** HH built an AI-powered portal
   (this repo) that can turn certificates around in minutes — while one public
   complaint says growth led to missed deadlines. The website neither sets
   service expectations nor showcases the tech that fixes them. That's the
   gap between a complaint and a differentiator.
7. **Trust math is scattered.** Reviews live on Yelp/BBB/Google/Clearsurance
   and a `/testimonials/` page, with no aggregate (count + rating + recency)
   anywhere prominent.

---

## 4. The redesign concept

**Brand idea: "Storm-tested. Family-built. Faster than the weather."**

Positioning statement to anchor every page:

> HH Insurance is the independent, family-built agency Tampa Bay news calls
> when Florida insurance gets confusing. We quote 40+ carriers in minutes,
> answer the phone at 7am, and we've been navigating this market since 1979.

Three message pillars (they already exist in HH's own words — "service,
knowledge, markets" — we're just making them concrete):

| Pillar | Today's claim | Redesigned proof |
|---|---|---|
| Markets | "exceptional agency" | "40+ carriers, one quote — see your options side-by-side in ~3 minutes" |
| Knowledge | "Florida insurance experts" | CPCU badge, FSU M.S., flood library, TV segment reel, Coffee with HH |
| Service | "personal touch" | Named agents on every page, 7am phones, review wall with counts, COI-in-minutes portal |

---

## 5. New information architecture

```
/                       Home (quote-first, storm-aware)
/insurance/             Hub: Personal · Marine · Business (tabbed)
/insurance/home/            + /flood/, /auto/, /umbrella/, /condo/, /renters/,
/insurance/flood/             /collector-car/, /golf-cart/, /motorcycle/ ...
/insurance/boat/            + /yacht/, /boat-builders/, /marinas/
/insurance/business/        + /bop/, /commercial-auto/, /workers-comp/,
                              /professional-liability/, /cyber/, /commercial-umbrella/ ...
/locations/st-petersburg/   City pages: ONE pattern, human slugs
/locations/tampa/  /locations/fort-myers/  /locations/sanibel/ ...
/storm-center/          ★ NEW — flood-zone lookup, hurricane prep, claims
                          hotline, market briefings (Coffee with HH lives here)
/learn/                 The blog, renamed and restructured into guides:
/learn/flood/               topic hubs that aggregate today's root-level posts
/learn/florida-market/      (301 every old slug to its new home)
/about/                 Story (1979→today), team grid with real bios,
                          /about/letters/, /about/press/  ← Jake's media reel
/reviews/               Aggregated proof (Google/Yelp/BBB counts + stream)
/business-portal/       ★ NEW — the Co-Pilot client portal story: COIs in
                          minutes, policy questions answered 24/7
/careers/               Rebuilt recruitment page (45-person growth story)
/contact/  /quote/      Quote funnel with product chooser
```

Migration notes: 301 map for every existing URL (especially the flat blog
posts and `/insurance-homeowners-insurance-tampa/`), de-index tag archives,
fix `/author/admin/` → `/about/jake-holehouse/`.

---

## 6. Page-by-page specs (what the prototype demonstrates for Home)

### Home (built in the prototype, v2)
Eight blocks, generous whitespace, one accent color:
1. **Header** — wordmark, four links (Insurance · Storm Center · About ·
   For business), phone, one CTA. Hairline appears on scroll.
2. **Hero (centered)** — small seasonal pill ("Hurricane season is here ·
   2026 prep checklist"), oversized headline, one-line lede, a single
   address field + button, quiet quick-links (Home · Flood · Auto · Boat ·
   Business), and one muted trust line (rating, team size, 1979 roots,
   TV-news credibility). "No spam calls, ever" microcopy kills the #1 fear.
3. **Coverage** — three plain link columns (Personal / Marine / Business)
   with hairline rows. No tabs, no cards — everything scannable at once.
4. **Why HH** — Markets / Knowledge / Service as three numbered text
   columns with concrete proof, no chrome.
5. **Storm Center band** — the single dark, signature moment: one
   paragraph, one stat (20–25% of flood claims from outside high-risk
   zones), four hairline link rows (flood-zone check, prep checklist,
   first-48-hours claims, Coffee with HH).
6. **Proof** — one large rotating review quote (named agents), aggregate
   line above, three dots. Then a quiet two-column story block
   ("We started at zero." → 1979 roots, 2018 restart, 45+ today) and a
   single-row business-portal strip ("COIs in minutes").
7. **Final CTA** — dark band, centered: address field + button, "or talk
   to a human: (727) 498-5551 · Mon–Fri 7:00am–5:30pm ET."
8. **Footer** — single row of links + legal line. Mobile keeps a slim
   sticky Call/Quote bar (storm-time traffic is phone-heavy).

### Product page template (built — `flood.html`)
Hero with line-specific quote CTA → stat row → "covered / not covered"
compare columns → Florida-specific gotchas → named specialist block → FAQ
(ship with schema.org FAQPage) → related guides from the library. Kill the
superlative titles; title pattern:
`Florida {Line} Insurance — 40+ Carriers, One Quote | HH Insurance`.

### Storm Center (built — `storm-center.html`)
Live-ish utility: NHC outlook status (sample), flood-zone lookup, the
printable prep checklist (interactive in the prototype), "first 48 hours"
claims steps incl. the AOB warning, Coffee with HH. Update cadence matters
more than polish; this page earns links and AI-answer citations year-round.

### About/Press (built — `about.html`)
The 1979’2018→today timeline, three house rules, the team grid (the
review-named agents first; sample roster flagged), press rows.
`/author/admin/` content moves here with proper Person schema.

### Also built
`reviews.html` (wall + platform links; 3 real public excerpts + 3 flagged
placeholder slots), `business.html` (portal story: request → AI drafts,
agent approves → delivered in minutes), `learn.html` (library hub whose
links point at HH's real published slugs, ready for the 301 map),
`careers.html` (growth story + sample roles), `contact.html` (quote bars
site-wide hand the address to this page's rater handoff).

---

## 7. Design system (as implemented in the prototype)

- **Palette (v2 — deliberately small):** Warm off-white `#FAF9F5` as the
  single page background (no alternating tints), Ink `#101C26`, Muted
  `#69727C`, Hairline `#E8E4DB`, Gulf Navy `#0B1F30` for the two dark bands
  (Storm Center, final CTA), and **one accent** — Hurricane Coral `#E2502F`
  — reserved for primary buttons, the rating stars, and hover states, so
  color always means "act."
- **Type:** Fraunces (display serif — warm, established, "family firm since
  1979") + Inter (UI/body). Oversized headlines (up to ~76px), tracked-out
  uppercase eyebrows. System fallbacks; `font-display: swap`.
- **Surfaces:** no card chrome — hairline rules and whitespace do the
  separating. Shadows only under the quote bar. No stock-photo handshake
  imagery anywhere; no decorative texture.
- **Motion:** one pattern only — a soft fade-up on scroll
  (IntersectionObserver), disabled under `prefers-reduced-motion`.
- **Components:** pill, quote bar, link column, numbered "why" column,
  hairline link row (Storm Center), rotating quote, portal strip, sticky
  mobile action bar.
- **Accessibility:** AA contrast throughout, skip link, focus-visible rings,
  reduced-motion support, semantic landmarks. Insurance buyers skew older —
  base font 17px, generous tap targets.

---

## 8. SEO / answer-engine plan

1. **Unblock the bots** (see §0) — then verify in GSC + vendor dashboards.
2. **Consolidate topical authority:** flood content under `/learn/flood/`
   with a pillar guide; 301 the ~dozen root-level flood posts into the hub.
3. **Schema:** `InsuranceAgency` (NAP, hours, `areaServed`), `Person` (Jake,
   CPCU credential), `FAQPage` on product pages, `Review`/`AggregateRating`
   where compliant.
4. **Local:** one NAP everywhere; fix Yelp category (currently Auto
   Insurance) and the aggregator listing; city pages under `/locations/`
   with real local content (storm history, flood-zone notes per city) — not
   doorway pages.
5. **Title rewrite pass:** strip superlatives, lead with specifics. Fix
   "HHI Insurance" and "Recruitment Landing Page."
6. **E-E-A-T:** byline every guide to a named licensed agent with credentials;
   press page; cite primary sources (FEMA, OIR) in guides.

---

## 9. Tech recommendation

Keep WordPress as the editing surface only if the team depends on it;
otherwise the natural move — given HH already runs a Next.js 14 platform (this
repo) — is a **Next.js marketing site** (App Router, static + ISR) with
content in MDX or a headless CMS (Sanity/Payload). Either way:

- Core Web Vitals budget: LCP < 2.0s on 4G, CLS < 0.05, INP < 200ms.
- The quote rater stays third-party but gets a first-party wrapper page
  (`/quote/`) so the funnel is measurable and brandable.
- Edge-cache everything except the rater; images via AVIF/WebP.
- One shared design-token file so the marketing site and the client portal
  (Co-Pilot) read as one brand.

---

## 10. Measurement

- **Primary:** quote starts (address submitted), quote completions, calls
  (tracked number, 7am–9am segment), portal sign-ins from `/business-portal/`.
- **Secondary:** flood-guide entrances → quote starts; Storm Center
  engagement during named storms; review-page → quote assist rate.
- Baseline current funnel for 30 days before launch; A/B the hero quote bar
  vs. current homepage if traffic allows.

---

## 11. Roadmap

**Phase 0 — this week, no redesign needed**
- WAF allowlist for AI/search crawlers; fix Yelp/aggregator categories;
  retitle "Recruitment Landing Page," "HHI Insurance," and the superlative
  pages; redirect `/author/admin/`.

**Phase 1 — weeks 1–4: conversion core**
- New homepage (prototype direction), `/quote/` wrapper, sticky mobile bar,
  review aggregation, analytics baseline.

**Phase 2 — weeks 4–8: authority**
- Storm Center, `/learn/` restructure + 301 map, product-page template
  rollout (flood + home + boat first), About/Press rebuild.

**Phase 3 — weeks 8–12: expansion**
- `/locations/` pattern, `/business-portal/` story page wired to Co-Pilot
  onboarding, careers rebuild on the growth story, seasonal ribbon automation
  (NHC feed), schema rollout site-wide.

---

## 12. Ask HH + what "best in the world" means, measurably

> **v5 — Ask HH (instant answers):** a command-palette answer engine on every
> page — press **⌘K** (or `/`, or "Ask a question" in the nav) and ask in
> plain English. The prototype ships a curated knowledge base of 13 real
> Florida questions (hurricane deductibles, AOBs, Citizens takeouts, wind-mit
> credits, binding pauses, screened enclosures…), each answered in 2–4
> sentences, each **citing HH's actual published guide**, each ending at a
> human. Unmatched questions route to the phone, never to a guess. In
> production this is RAG over the full HH library via the Co-Pilot engine —
> the same moat, pointed outward.

"Best insurance agency website in the world" is a claim you operationalize,
not declare. The bar, measured:

| Dimension | The bar | How this build gets there |
|---|---|---|
| **Answers** | A visitor's insurance question answered in <10s, cited, with a human one tap away | Ask HH (curated now, RAG in production); containment + escalation rates tracked |
| **Conversion** | Address → side-by-side options in <3 min, zero PII dead-ends | The quote flow: no SSN/phone required, reactive wind-mit credits, "bind with a human" everywhere |
| **The worst week** | Site changes posture within 15 min of an NHC advisory | Storm Mode keyed to the NHC feed: advisory bar, binding-pause honesty, claims-first IA |
| **Utility** | People bookmark the site who aren't clients yet | Storm Center: zone lookup, printable checklist, first-48-hours guide |
| **Speed** | LCP < 1.5s p75 mobile, CLS < 0.05, INP < 200ms | No images, two fonts, one CSS file, zero dependencies |
| **Access** | WCAG 2.2 AA; older buyers are the median user | 17px base, AA contrast both modes, reduced-motion collapses every pattern, focus-trapped dialogs |
| **Trust** | Every number on the site is verifiable | Sample figures flagged in-page; launch checklist requires sourcing each claim |
| **Reach** | Visible where decisions happen in 2026: AI assistants | WAF allowlist (§0) + schema + citable plain-English guides |

Roadmap beyond this prototype: Spanish-language core pages (Tampa Bay's
second language deserves more than Google Translate), live NHC + FEMA data
feeds, and Ask HH analytics (every unanswered question is next month's
guide topic).

---

## 13. The conversational front door — HH Concierge (v6)

The request: *a ChatGPT-style website — the visitor is asked "new customer,
existing customer, or general information?" and a Claude-connected chat,
loaded with our data, guides the journey.* Built at `concierge.html`; this
section is the concept, the rules, and the production wiring.

### How it behaves (prototype, working today)

1. **Triage first, typing optional.** The Concierge opens with exactly that
   question, as tappable chips. Most visitors never need the keyboard — every
   journey is guided. Free text works at any moment.
2. **Three journeys:**
   - **New** → line of business → instant-quote handoff (address carries into
     `quote.html`), "questions first" (KB answers), or a human.
   - **Existing** → COI (→ portal), policy question (KB; *"I can't read your
     policy in chat — by design"*), change (→ csr@), claim (→ first-48-hours),
     billing.
   - **Researching** → flood / market / prep / who-is-HH, all cited to real
     guides.
3. **One brain.** The Concierge and Ask HH share the same knowledge base
   (`window.HHKB`) — curate once, answer everywhere.
4. **Detects intent.** Type an address into the chat and it offers to quote
   it. Ask something it can't answer and it *names that* and hands you the
   phone — it never guesses.
5. **Storm-aware.** With Storm Mode on, the greeting leads with the advisory
   and the binding-pause honesty.

### The rules that keep it from becoming a chatbot people hate

- **Chat routes; forms transact.** The Concierge never collects PII or binds
  anything — it lands you in the rater, the portal, or a human's queue. (This
  also keeps the public site consistent with the Co-Pilot platform's
  *form-first* product invariant: chat is the router on the marketing
  surface; worksheets/raters remain the transaction surface everywhere.)
- **Escalation is a feature.** "That one deserves a human" is a designed
  terminal state, not a failure state. Target: every conversation ends in an
  action (quote started, page opened, call placed) — measure it.
- **Educational, not advice; the policy controls.** Stated in the chat
  footer, enforced in the system prompt.

### Where it lives — decided (v6.1): the Concierge leads the homepage

Per HH's call: anyone arriving to *look for information* should land in a
conversation, because an information-seeker in a guided chat converts at a
rate a static page can't match. So:

- **The homepage hero is the chat panel** (embedded, fixed-height, internal
  scroll). Headline + one-line lede above it; trust line + carrier marquee
  below; the full classic sections (coverage, why, Storm Center, proof,
  story, portal, final quote CTA) remain underneath as the "basic other
  info" layer and the SEO/AEO surface.
- **Escape hatches stay one tap away** for visitors who hate chat: the
  header's "Get a quote" button, a "Prefer forms? Instant quote →" line under
  the panel, Ask HH (⌘K) for one-shot questions, and the full classic page
  below the fold.
- **`concierge.html` remains the full-screen version** (deep links, mobile
  entry, paid landings); both surfaces run the same shared engine in
  `script.js`, so journeys and the KB are maintained once.
- **Measure the trade:** chat engagement → quote-start rate vs. the removed
  hero quote bar's direct rate; the final-CTA quote bar and header button
  keep the form path measurable side-by-side.

### Production wiring (Claude API)

A thin Next.js route handler (this stack already exists in the repo) that
streams Claude over Server-Sent Events to the same chat UI:

- **Model — HH's call:** `claude-sonnet-4-6` ($3/$15 per MTok, 1M context,
  64K max output) — the right tier for a customer-facing site chat: fastest
  good answers (chat UX lives and dies on latency), cheap enough to leave on
  for every visitor, and with journeys scripted + answers grounded in
  retrieved guides, the top tiers' extra reasoning isn't where this surface
  earns. Pin via env like the portal does (`AI_MODEL`) — never hardcode.
  Upgrade path if transcript evals ever show free-text quality gaps:
  `claude-opus-4-8` ($5/$25) or `claude-fable-5` ($10/$50) behind free-text
  only, Sonnet keeping the scripted journeys. Don't split tiers until the
  data asks for it.
- **Latency tuning (Sonnet 4.6 specifics):** set
  `output_config: {effort: "low"}` explicitly — 4.6 defaults to `high`,
  which costs latency a chat doesn't need — and `thinking: {type:
  "disabled"}` for snappy turns (allowed on Sonnet, unlike Fable 5). A/B
  `thinking: {type: "adaptive"}` + `effort: "medium"` on the free-text path
  if complex flood/Citizens questions need deeper answers. Keep responses
  chat-short via the system prompt, `max_tokens` ~4K, streaming on.
- **RAG with citations:** retrieve the top guide chunks per question and pass
  them as `document` content blocks with `citations: {enabled: true}` so
  answers cite the exact guide — the prototype's "Source:" line, but
  enforced by the API.
- **Tools, not prose, for actions** (tool runner + Zod schemas):
  `start_quote(address?, line?)` → returns the rater URL the UI opens;
  `open_page(path)` → deep-link into storm-center/business/about;
  `handoff_human(reason, transcript_summary)` → creates the callback ticket.
  Tool descriptions must say *when* to call them ("Call `handoff_human`
  whenever the user asks about their own policy, a claim in progress, or
  anything requiring licensed advice") — current Claude models reach for
  tools conservatively unless descriptions are prescriptive about *when*
  to call them.
- **Prompt caching:** the system prompt (brand voice, rules, storm state
  comes *last*) and the static KB preamble sit before a `cache_control`
  breakpoint — repeat turns then read at ~0.1× input price. Sonnet 4.6's
  minimum cacheable prefix is 2,048 tokens; the system + KB preamble clears
  that easily. Keep timestamps and per-session IDs out of the cached prefix.
- **Cost envelope (Sonnet 4.6):** a typical 8-turn conversation ≈ 25–30K
  input tokens (mostly cached at ~$0.30/MTok read) + ~2K output at $15/MTok
  ≈ **$0.03–0.07 with caching** — cheap enough to never throttle the chat.
  (Same conversation: ≈ $0.06–0.12 on Opus 4.8, ≈ $0.12–0.22 on Fable 5.)
  Batch nightly evals of transcripts (Batches API is 50% off) to grade
  containment and accuracy.
- **Guardrails:** PII minimization until the rater handoff (no SSN/DOB in
  chat, ever); "educational, not advice" + no binding in chat enforced in
  the system prompt; refusal/`stop_reason` handling surfaces a human handoff
  instead of an error; transcripts logged with the same audit posture as the
  portal's Runs.
- **The flywheel:** every unanswered Concierge question is logged →
  becomes next month's guide → re-embedded into RAG → answered next time.
  Same loop the Co-Pilot learning pipeline already implements internally.

Sketch of the route handler (TypeScript, `@anthropic-ai/sdk`):

```ts
const stream = client.beta.messages.toolRunner({
  model: process.env.AI_MODEL!, // claude-sonnet-4-6
  max_tokens: 4096,
  thinking: { type: "disabled" },            // snappy chat; A/B adaptive on free-text
  output_config: { effort: "low" },          // 4.6 defaults to high — set explicitly
  system: [{ type: "text", text: CONCIERGE_SYSTEM, cache_control: { type: "ephemeral" } }],
  tools: [startQuote, openPage, handoffHuman], // betaZodTool definitions
  messages: [...history, { role: "user", content: ragBlocks(userMsg) }],
  stream: true,
});
```

---

## Sources consulted

- [hhinsgroup.com homepage (SERP title/snippets)](https://www.hhinsgroup.com/) and indexed pages:
  [/insurance/](https://www.hhinsgroup.com/insurance/),
  [/insurance/florida-homeowners-insurance/](https://www.hhinsgroup.com/insurance/florida-homeowners-insurance/),
  [/insurance/auto/](https://www.hhinsgroup.com/insurance/auto/),
  [/insurance/business-auto/](https://www.hhinsgroup.com/insurance/business-auto/),
  [/insurance/boat-marine/](https://www.hhinsgroup.com/insurance/boat-marine/),
  [/insurance/boat-builders-insurance/](https://www.hhinsgroup.com/insurance/boat-builders-insurance/),
  [/flood-insurance-in-florida/](https://www.hhinsgroup.com/flood-insurance-in-florida/),
  [/insurance/personal-umbrella-insurance/](https://www.hhinsgroup.com/insurance/personal-umbrella-insurance/),
  [/insurance/commercial-umbrella-insurance/](https://www.hhinsgroup.com/insurance/commercial-umbrella-insurance/),
  [/testimonials/](https://www.hhinsgroup.com/testimonials/),
  [/about/](https://www.hhinsgroup.com/about/),
  [/contact-us/](https://www.hhinsgroup.com/contact-us/),
  [/blog/](https://www.hhinsgroup.com/blog/),
  [/recruitment/](https://www.hhinsgroup.com/recruitment/),
  [/coffeewithhh1/](https://www.hhinsgroup.com/coffeewithhh1/),
  [/author/admin/](https://www.hhinsgroup.com/author/admin/),
  [Florida's 2025 Insurance Market](https://www.hhinsgroup.com/floridas-2025-insurance-market/),
  [flood-zone guide](https://www.hhinsgroup.com/understanding-different-flood-zones/),
  [40-under-40 post](https://www.hhinsgroup.com/tampa-homeowners-insurance-entrepreneur-awarded-40-under-40/)
- [Business Observer — Jake Holehouse, 31](https://www.businessobserverfl.com/news/2022/oct/14/jake-holehouse-31/)
- [riskeducation.org — Young Agent Builds on the Family Business](https://www.riskeducation.org/young-agent-builds-on-the-family-business/)
- [BBB profile](https://www.bbb.org/us/fl/saint-petersburg/profile/insurance-agency/hh-insurance-group-llc-0653-90344305)
- [Yelp listing](https://www.yelp.com/biz/h-h-insurance-saint-petersburg)
- [Glassdoor](https://www.glassdoor.com/Overview/Working-at-HH-Insurance-EI_IE2533515.11,23.htm)
- [Safeco agent locator](https://insurance-agent.safeco.com/find-an-insurance-agency/agency/0352520003525200)
- [Travelers agent locator](https://agent.travelers.com/fl/st-petersburg/3443-1st-ave-n-47646-1)
- [Florida Independent Agents profile](https://www.flindependentagents.com/agency-profile/1289492/hh-insurance-group-llc/)
- [Hagerty agent locator](https://www.hagerty.com/Apps/Resources/AgentLocator/Agency/658206/HH_Insurance_Group_LLC)
- [MM Insurance (affiliate)](https://www.mminsures.com/)
- [LinkedIn](https://www.linkedin.com/company/hhinsgroup) · [Facebook](https://www.facebook.com/HHinsgroup/)

**Verify before launch** (marked in prototype as sample content): exact Google
review count/rating, carrier count ("40+"), team size ("45+"), and that quoted
review excerpts are approved for marketing use.
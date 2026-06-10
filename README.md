# HH Insurance — Website Redesign Prototype

Conversation-first redesign of [hhinsgroup.com](https://www.hhinsgroup.com/).
No build step, no dependencies — static HTML/CSS/JS.

## View it

- Open `index.html` in any browser, **or**
- Enable GitHub Pages (Settings → Pages → Deploy from branch → `main`, root)
  and the site goes live at `https://hhapexdev-hash.github.io/hh-insurance-website/`.

## What's here

| File | Page |
|---|---|
| `index.html` | Home — the **HH Concierge** chat leads; classic sections below |
| `concierge.html` | Full-screen Concierge (same engine as the homepage panel) |
| `quote.html` | Simulated 3-step instant-quote flow (every quote bar feeds it) |
| `insurance.html` | Coverage hub — Personal · Marine · Business |
| `flood.html` | Product-page template (flood is the flagship) |
| `storm-center.html` | Flood-zone lookup, printable 2026 prep checklist, first-48-hours claims |
| `about.html` / `reviews.html` / `business.html` / `learn.html` / `careers.html` / `contact.html` | Supporting pages |
| `styleguide.html` | Internal design-system reference |
| `style.css` / `script.js` | Shared design system + behavior (Concierge engine, Ask HH, Storm Mode) |
| `REDESIGN-STRATEGY.md` | Full strategy: audit, IA, SEO plan, measurement, production wiring |

## Try the demos

- **Concierge** — answer the opening question on the homepage; type an address mid-chat
- **Ask HH** — press `⌘K` (or `/`) on any page
- **Storm Mode** — toggle in the top banner; the whole site changes posture
- **Quote flow** — same address always returns the same sample pricing
- **Dark mode** — follows your OS automatically

## Status

Design prototype: all figures, reviews, rosters, and pricing are **sample data**
flagged in-page — verify before production. The Concierge runs scripted journeys
+ a curated knowledge base in this prototype; production wires free-text to
**Claude (`claude-sonnet-4-6`)** with RAG over HH's published guides — see
`REDESIGN-STRATEGY.md` §13.

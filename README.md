# HH Insurance — Chat-First Website (v7)

The site **is** the conversation: a full-screen Concierge front door for
[hhinsgroup.com](https://www.hhinsgroup.com/), backed by 45+ licensed humans.
Static HTML/CSS/JS — no build step.

## Pages (3 public + 1 internal)

| File | Purpose |
|---|---|
| `index.html` | The Concierge — coverage, story, reviews, COIs, careers, contact all live as chat journeys |
| `quote.html` | Simulated 3-step instant quote (the transaction surface chat routes into) |
| `storm-center.html` | Printable prep checklist, first-48-hours claims, zone lookup |
| `styleguide.html` | Internal design-system reference |

## Try it

- Answer the opening question; type an address mid-chat; ask "what's an AOB?" or "are you hiring?"
- **Storm Mode** — toggle in the top banner
- **Dark mode** — follows your OS

## Status

Prototype: figures, reviews, and pricing are **sample data** flagged in-page.
Chat runs scripted journeys + a curated KB; production wires free-text to
**Claude (`claude-sonnet-4-6`)** with RAG over HH's guides — `REDESIGN-STRATEGY.md` §13.
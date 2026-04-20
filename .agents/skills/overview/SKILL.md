# watchr — repo fingerprint & guardrails

**Trigger:** When working in the `watchr` repo.

## Purpose of app
Watchr is a shared, two-user streaming recommendation app (siblings / partners / close friends). Core loop: Drop a Rec → track watch status → when marked `Done`, rate on a 1–5 taco scale + optional "more like this?" + optional 2-sentence hot take (typed or voice) → the other user gets a playful animated reveal. Mobile-first SPA, Add-to-Home-Screen friendly. PRD §1–§4 in `misc-docs/prd.md`.

## Stack fingerprint
- Node `>=22.12.0` (`engines.node` pinned in `package.json`)
- Astro `^6.1.7` in **SSR mode** (`output: 'server'`) with `@astrojs/vercel` adapter
- React `^19.2.5` via `@astrojs/react` (`.jsx` client components, `client:load` hydration)
- Tailwind CSS `^4.2.2` via `@tailwindcss/vite` (no `tailwind.config.js`; v4 `@theme` block in `src/styles/globals.css`)
- Framer Motion `^12.38.0`
- Icons: `lucide-react ^1.8.0` (outline only)
- Data layer: `@neondatabase/serverless ^1.1.0` (Neon Postgres)
- Email: Loops transactional API via raw `fetch` (no SDK)
- Deploy target: Vercel (SSR adapter configured)
- Build verification: `@astrojs/check` + `typescript` (dev)
- Test runner: none (MVP)

## Observed design system (strict — follow, don't silently "fix")
- **Base:** `#050505` bg, `#F3F4F6` text, `#5B6B7F` muted — matches Agent Army system.
- **Brights in use (locked 4 from approved 6):** `#2de2e6` Totes Turquoise (primary), `#9b5cff` Electric Purple (secondary), `#ffe44d` Highlighter Yellow (accent 1), `#3cff9e` Screamer Green (accent 2). `#ff2f92` Punk Rock Pink appears on `no_thanks` status + "NAW, I'M GOOD" thumbs-down — inside approved 6, outside locked 4, treated as acceptable status-color variety.
- **Font pair (approved pair #8 from `vibe-coder-prep-rules.md` §4.2):** **Urbanist** (headings / UI) + **Kumbh Sans** (supporting / body). Loaded from Google Fonts in `src/styles/globals.css`.
- **Tertiary emphasis rule:** primary text color at `opacity-70` for micro-labels / metadata. Not a new gray.
- **Icons:** Lucide outline, hairline stroke. **Special emoji exception for reveal + rating cards only** — taco emojis for rating reveal, gift-box `🎁` for "open reveal" CTA inside the RevealFlow card, rating-scale Apple emojis in `TACO_RATING_SCALE` labels. Rule is Lucide-only for chrome / nav / status chips / prompts.
- **Pill CTA (`.btn-pill`):** pseudo-gradient border (Totes Turquoise → Electric Purple), hover swaps to solid Totes Turquoise fill + glow. Component defined in `globals.css` @layer components.
- **Sticky header:** `src/components/Header.astro` — watchr uses a floating rounded-2xl glass card pattern inside `max-w-md` (NOT the canonical flush-to-edge pattern from `gig-spottr-header-spec.md`). Flagged by session `a04631490a...`; keep as watchr-specific variant unless explicitly asked to standardize.
- **Build mode:** Standard SPA (not slide-deck). `slide-deck-rules.md` does not apply here.

## Run locally
```bash
npm install
npm run db:setup   # idempotent: creates recommendations / reactions / notifications tables
npm run dev        # astro dev @ http://localhost:4321
npm run check      # astro check (TS + .astro type check)
npm run build      # production build
```

Required env vars (not in repo — source from Devin secrets or local `.env`):
- `DATABASE_URL` — Neon Postgres connection string (required; `db:setup` and all `/api/*` routes fail-closed without it)
- `LOOPS_API_KEY` — Loops transactional API key (optional; email notifications no-op without it)
- `LOOPS_NEW_REC_TEMPLATE_ID` — Loops template for "new rec dropped" email
- `LOOPS_REVEAL_READY_TEMPLATE_ID` — Loops template for "reveal ready" email
- `USER_A_EMAIL`, `USER_B_EMAIL` — two-user prototype routing
- `PUBLIC_APP_URL` — absolute URL used inside email bodies (default `http://localhost:4321`)

See `.env.example` for the full list with comments.

## Testing tips
- **Two-user prototype toggle:** `BaseLayout.astro` renders a bottom-right "Switch" pill that flips `localStorage.watchr_user` between `A` and `B` and reloads. Use it to simulate the other user's reveal flow.
- **Local DB:** Neon serves HTTPS-only — no local Postgres. Use a Neon free tier branch for dev; rerun `npm run db:setup` after a schema change.
- **Fonts loading:** verify Urbanist renders in Chrome DevTools → Network → filter "fonts". If body renders in system-default sans, `@import url(...)` is probably in the wrong CSS layer (Tailwind v4 silently drops it). Fix pattern: reference `gig-spottr-bot` PR #8 and watchr PR for "font loading — move out of @layer base".

## Integration rules (defensive writes)
- **Schema-drift retry on Neon writes** (to be added in PR 6): catch `column does not exist` / `unknown column` errors, log drift warning, retry with the offending field omitted. Never fail the whole write on a single drifted field. Reference: `gig-spottr-bot` PR #4 Notion pattern, adapted for Neon.
- **Hot-take lock after reveal viewed** (to be added in PR 6): once `reveal_viewed_by_other_user = TRUE` on a reaction row, further edits to `hot_take_raw` / `hot_take_clean` must be rejected at the API layer.
- **Fail-closed on reveal viewer filter** (to be added in PR 6): `reveal.astro` must filter `r.user_id !== viewer_user_id` before `.find(r => r.reveal_ready)` so a viewer never sees their own reveal framed as the "friend's" reveal.

## V2 / V3 backlog (do not auto-implement — ask first)
- **V2 UX:** recommender edit/delete UI (lib functions exist, no UI), unread-count badge on `NotificationIndicator` (hardcoded `count={1}` was dropped in PR 2), `second_reveal_ready` notification wiring, richer empty states.
- **V2 data:** voice capture + AI-clean hot-take pipeline (MVP §9 — optional), external metadata enrichment (poster/runtime lookup).
- **V3 infra:** PWA icons (`icon-192.png` / `icon-512.png`) + `manifest.webmanifest` rename per `misc-docs/file-tree.txt`, GitHub Actions CI.
- **V3 scope:** expand beyond two-user + additional content categories (books / music / live events) per `misc-docs/future-spec.md` §4.

## Known issues (track, don't treat as rules)
- None currently open — all known issues at session start (Apr 2026) were rolled into PRs 1–5. When a new known issue is filed, promote it here with severity + target PR.

## Agent Army alignment
This repo follows Patty's Agent Army design system (see user Knowledge note v2.3+). Defaults: dark mode, approved-6-brights palette with locked 4, approved-9-font-pairs list (#8 selected here), approved taco/reveal emoji exception. Commit `/misc-docs/` by default. PR-first workflow. No direct commits to main. CI green + Devin Review clean before declaring done.

---
**Last updated:** 2026-04-20 by session `a04631490a564489aeb5b80833c34c28`

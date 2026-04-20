# Watchr

Shared streaming-recommendation ritual for two. Drop a rec, track watch status, rate on the Buddy's 1–5 taco scale, optionally leave a 2-sentence hot take, and trigger a playful reveal for the other person.

Mobile-first SPA. Add-to-Home-Screen friendly. Built for siblings, partners, and close friends who want a low-friction shared watch list without spreadsheets or group chats.

## Stack
- Astro 6 (SSR) + React 19 + Tailwind CSS 4
- Framer Motion + Lucide (outline icons)
- Neon Postgres (HTTPS serverless driver)
- Loops (transactional email)
- Vercel (deploy target)

## Prerequisites
- Node `>=22.12.0`
- A Neon Postgres database (free tier is fine for the two-user prototype)
- *(Optional)* Loops account + two transactional templates if you want email notifications

## Setup
```bash
npm install
cp .env.example .env      # then fill in DATABASE_URL + optional Loops vars
npm run db:setup          # idempotent: creates recommendations / reactions / notifications tables
npm run dev               # astro dev @ http://localhost:4321
```

## Scripts
| Script | Action |
| :--- | :--- |
| `npm run dev` | Local dev server at `localhost:4321` |
| `npm run build` | Production build via Vercel SSR adapter (`./dist/`) |
| `npm run preview` | Preview the production build locally |
| `npm run check` | `astro check` — TypeScript + `.astro` type check |
| `npm run db:setup` | Run idempotent Neon schema migration |

## Environment variables
See [`.env.example`](./.env.example) for the full list with comments. At minimum you need `DATABASE_URL`. Everything else is optional and gracefully no-ops when absent.

## App structure
```
src/
├── components/   # React (.jsx) interactive UI + Header.astro
├── layouts/      # BaseLayout.astro (shell, ambient glow, identity toggle)
├── lib/          # neon.js, loops.js, recommendations.js, reactions.js, notifications.js, setup-db.js, constants.js
├── pages/        # index, drop-a-rec, guide, reveal (+ api/*)
└── styles/       # globals.css (Tailwind v4 @theme + base layer)
```

Approved specs live in [`misc-docs/`](./misc-docs/): `prd.md`, `mvp-spec.md`, `future-spec.md`, `tech-spec.md`, `vibe-coder-prep.md`, `build-instructions.md`, `file-tree.txt`.

## Two-user prototype mode
`BaseLayout.astro` renders a bottom-right "Switch" pill that flips `localStorage.watchr_user` between `A` and `B` and reloads. Use it to simulate the other user's reveal flow during local testing. Replace with real auth before a public launch.

## Conventions
- Commit `/misc-docs/` (overrides any legacy `.gitignore` rule).
- Never commit `.env` / `.env.local` / `.env.production`.
- No direct commits to `main`. PR-first workflow. CI green + review clean before merge.

## Agent context
Repo-level Devin guidance lives in [`.agents/skills/overview/SKILL.md`](./.agents/skills/overview/SKILL.md). User-level Agent Army system rules auto-load from the Devin Knowledge store.

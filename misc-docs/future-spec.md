# Future Specification (Phase 2+)

## 1. Project Title
**Watchr**

## 2. Purpose of Future Phase
This document captures enhancements that are intentionally **not included in MVP** but may be added later once the core two-user recommendation and reveal flow is stable, enjoyable, and worth expanding.

## 3. Default Stack Expansion Assumptions
The MVP default stack is:
- Astro (SSR mode)
- React (.jsx)
- Tailwind CSS
- Framer Motion
- Vite
- Neon Postgres
- GitHub
- Vercel
- Loops (email notifications)

Possible future migrations or upgrades may include:
- Cloudflare Workers
- Cloudflare KV
- Durable Objects
- more advanced orchestration
- alternative storage or vector layers if required

These future upgrades should only be recommended when the MVP proves a real need.

## 4. Future Features
Potential next-phase additions:
- smarter **“More like this”** recommendation logic based on prior ratings and content types
- external metadata enrichment for title lookup, artwork, runtime, synopsis, and streaming platform details
- more content types beyond show / limited series / movie / documentary
- private notes or spoiler-safe expanded review mode
- richer notification controls and notification preferences
- rec sorting, filtering, and custom views
- rec archive / favorites / rewatch queue
- side-by-side dual-user rating comparison view
- recommendation streaks, history, and light gamification stats
- shared “what to watch tonight” picker mode
- support for broader recommendation categories such as:
  - books
  - new music
  - albums
  - playlists
  - concerts
  - live music
  - plays / theater
  - sports games
  - other live events
- beta support for mixed media / live event recommendation cards

## 5. UX Enhancements
Potential interface and experience improvements:
- richer reveal animations based on rating score
- alternate fail-style animation for low ratings
- expanded dashboard cards with cover art and richer browsing states
- guided empty states and onboarding hints
- quicker add flow with title search/autofill
- one-tap rewatch / save for later behavior
- optional spoiler toggle for hot takes
- better end-of-flow recap screens after both users complete their reveals
- category-aware card layouts for media vs live events
- flexible entry forms that adapt based on recommendation type

## 6. UI Governance (Future Features)
All future UI and UX enhancements must follow:
`/misc-docs/vibe-coder-prep.md`

Do NOT:
- introduce new design systems
- override existing UI rules
- apply different styling logic to future features

All future features must remain visually and behaviorally consistent with the MVP system.

## 7. Backend / Infra Enhancements
Potential future additions:
- auth
- user accounts
- persistent memory
- richer analytics
- automation workflows
- API orchestration upgrades
- rec ownership and permission logic for more than two users
- queued jobs for AI cleanup, metadata pulls, and notification fan-out
- server-side event tracking for rating completion and reveal opens
- category-specific metadata handling for books, music, and live events

## 8. Integrations
Potential future integrations:
- streaming metadata APIs for content enrichment
- book, music, and event metadata providers
- richer Loops automation or transactional templates
- optional SMS or push notification provider
- poster/artwork or trailer source integrations
- recommendation export to Notion or Google Docs
- AI summarization or categorization services for longer voice notes

## 9. Scale Considerations
If the app grows, future planning may need to address:
- performance
- concurrency
- persistent state
- user data storage
- access control
- billing or subscriptions

Additional scale concerns for this app:
- handling more than two users per shared rec space
- role and permission complexity
- notification fatigue and preference management
- AI cleanup cost control
- richer data indexing for filtering, matching, and recommendations
- supporting multiple recommendation categories without making the UX messy as hell

## 10. Future Approval Gate
These features are placeholders only. Do not build them unless the user explicitly approves moving beyond MVP.
# Build Instructions

## 1. Project Title
**Watchr**

## 2. Purpose
These instructions define the build sequence for the MVP of Watchr so the coding agent can move cleanly from setup to local validation without skipping approval gates or bloating scope.

## 3. Confirmed Build Context
- App type: SPA
- Purpose: Personal-use recommendation app for two users
- Syntax: React `.jsx`
- Preferred coding environment: Antigravity (Gemini 3.1 Pro High)
- Fallback coding environment: Codex 5.3 or 5.4
- Working app folder: `/Volumes/Sandbox/agents/watchr`
- Reference resources folder: `/Volumes/Sandbox/agents/resources`

## 4. Confirmed Stack
Use this stack for the current build:
- Astro (SSR mode)
- React (.jsx)
- Tailwind CSS
- Framer Motion
- Vite
- Neon Postgres (initial, local testing)
- Loops for email notifications
- GitHub
- Vercel

## 5. Required Build Order
Follow this order exactly:

1. Review approved docs in `/misc-docs/`
2. Confirm `.gitignore` exists and excludes:
   - `/misc-docs/`
   - `/resources/`
   - `.env`
   - `.env.local`
   - `node_modules/`
3. Create approved app file structure
4. Initialize Astro SSR project with React and Tailwind
5. Add Framer Motion and Lucide
6. Set up Neon connection utilities
7. Set up Loops email helper/config scaffolding
8. Build core data models and persistence logic
9. Build UI module by module
10. Validate local flow after each major module
11. Connect guide, rating flow, reveal flow, and notification state
12. Test local browser flow
13. Prepare GitHub repo from app folder
14. Deploy to Vercel only after local build is stable

## 6. MVP Build Sequence
### Phase A — Setup
- Initialize Astro SSR project
- Add React integration
- Add Tailwind CSS
- Add Framer Motion
- Add Lucide icons
- Verify project runs locally

### Phase B — Core structure
- Create layouts
- Create routes/views
- Create shared UI component folders
- Create `lib` utilities for Neon and Loops
- Create app constants for statuses, content types, and rating scale

### Phase C — Data + logic
- Define recommendation data model
- Define user reaction model
- Define notification model
- Implement create/save/update logic
- Implement reveal lock logic
- Implement optional email notification trigger logic

### Phase D — UI modules
Build and validate in this order:
1. Home actions
2. Add Rec form
3. Shared guide/dashboard
4. Status selector
5. Taco rating flow
6. Hot take prompt + input
7. Reveal animation flow
8. Notification indicator
9. Return-to-home CTA state

### Phase E — Validation
Validate these flows:
- Add recommendation
- Save to watch list
- Update status
- Trigger rating on `Done`
- Save `More like this`
- Submit or skip hot take
- Trigger reveal for other user
- Lock hot take after reveal is viewed
- Complete second-user rating flow
- Return cleanly to Home

## 7. UX Guardrails During Build
- Do not rename locked labels without approval
- Do not add extra flows or screens
- Do not turn optional fields into required ones
- Do not collapse the two-user reveal logic into a single shared review
- Keep interactions short, clear, and low-friction
- Preserve the approved CTA/button copy

## 8. Notification Instructions
For MVP:
- Use in-app notification state as the primary signal
- Use Loops as the optional outbound email layer
- Do not assume native push notifications
- Keep notification logic simple and event-based:
  - reveal ready
  - second reveal ready

## 9. Voice / Hot Take Instructions
- Support typed hot takes
- Support optional voice capture if browser support is available
- Clean raw ramble into 1–2 spoiler-light sentences
- Preserve original raw input only if useful for debugging or future editing
- Do not make voice capture required

## 10. UI Build Discipline
All styling and layout decisions must defer to `/misc-docs/vibe-coder-prep.md`

Do NOT:
- improvise a new color system
- improvise a new font pairing
- use non-Lucide icons
- use generic Tailwind defaults
- skip the pill CTA styling rules

## 11. Local Test Checklist
Before GitHub or deploy, verify:
- app runs locally without critical errors
- guide view loads
- rec save works
- status update works
- rating flow triggers correctly
- reveal flow plays correctly
- hot take lock logic works
- notification state updates correctly
- UI follows approved palette and font pairing
- Home Screen web app behavior is acceptable on iPhone browser

## 12. Approval Gate
Do not move into expanded build work, architecture changes, or future features until the user reviews and approves this build plan.

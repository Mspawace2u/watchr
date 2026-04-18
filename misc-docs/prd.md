# Product Requirements Document (PRD)

## 1. Project Title
**Watchr**  
(working title; internal codename until final name is locked)

## 2. Problem Statement
This product solves: the need for a simple, low-friction way for two people to share streaming recommendations, track what they want to watch, react after watching, and enjoy a more playful reveal experience than a boring list or spreadsheet.

It is designed to reduce clutter, decision fatigue, and app friction while creating a fun shared ritual around recommending and rating shows, movies, limited series, and documentaries.

## 3. Target User
**Primary user:**  
Two closely connected users, such as siblings, partners, or friends, who want to share and track streaming recommendations in a simple, personal, easy-to-navigate app.

**Secondary user (if any):**  
A recommendation recipient who wants to browse, watch, rate, and react to recommendations without needing to type a lot or manage a complicated interface.

## 4. Core Use Case
The main thing this app must help the user do is:  
**share a streaming recommendation, track its watch status, and exchange a playful spoiler-light reaction after viewing.**

## 5. Default Build Context
Unless otherwise specified, this project should assume the following default dev stack and workflow:

- Build and test locally in the user's MacOS LDE on an external hard drive
- Coding environment: Antigravity with Gemini 3.1 Pro High preferred unless user selects Codex 5.3 or 5.4
- App type: Serverless full-stack app
- Framework: Astro (SSR mode)
- Frontend: React (.jsx)
- Styling: Tailwind CSS
- Motion layer: Framer Motion
- Build tool: Vite
- Initial data layer: Neon Postgres, set up manually for testing before deploy
- Deployment path: local testing → GitHub repo → Vercel deployment
- Future migration path may include Cloudflare Workers, KV, and Durable Objects
- Agent must present this default stack and confirm: **"Default stack detected. Proceed with this stack? (Yes / Modify)"**

## 6. Success Criteria
This project is successful when:

- Two users can create, save, and browse shared recommendations without confusion
- A user can mark a rec as watched, submit a taco rating, optionally leave a 2-sentence hot take, and trigger the reveal flow
- The app feels playful, clear, and uncluttered enough that users actually want to keep using it during downtime or treatment days

## 7. Key Features
- Shared recommendation cards for streaming content
- Watch status tracking per user
- Post-watch taco rating reveal flow with playful animation
- Optional 2-sentence hot take via text or voice input
- Notification flow using in-app state and optional Loops email notifications
- Recommender ownership of rec editing and deletion
- Dual-user reaction layers on a shared rec card
- Add to Home Screen support and app-like iOS browser behavior

## 8. Out of Scope
This project does NOT include in the current phase:

- Pulling streaming metadata automatically from external APIs
- Smart recommendation engine for “more like this”
- Multi-user expansion beyond the two-user shared experience
- Advanced spoiler controls
- Social sharing outside the app
- Subscription billing or monetization features
- Native iOS or Android push notification infrastructure

## 9. Constraints
- Must avoid unnecessary tool sprawl
- Must prioritize low-cost, reliable tooling
- Must translate dev logic into plain English for the HITL
- Must avoid assumptions and confirm defaults before proceeding
- Must keep build scope aligned to MVP first
- Must preserve a clean, cinematic, low-clutter user experience
- Must support optional short voice input that can be AI-cleaned into a succinct hot take
- Must not turn the recommendation process into a high-effort review workflow
- Must use Lucide-style hairline outline icons only for the hot take prompt sequence
- Must preserve Apple-style emoji presentation for the taco rating scale and rating reveal sequence

## 10. Approval Gate
Do not proceed into architecture, file tree, or code generation until the user approves this PRD.
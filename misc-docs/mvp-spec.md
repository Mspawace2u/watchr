# MVP Spec (Phase 1)

## 1. MVP Goal
The minimum viable version of this app must:  
allow two users to share streaming recommendations, track watch status, rate watched content using a custom 1–5 taco system, optionally leave a short hot take, and view each other’s reveal flow in a playful dashboard experience.

## 2. Default Build Stack
Unless the user overrides it, use this default stack:

- Astro (SSR mode)
- React (.jsx)
- Tailwind CSS
- Framer Motion
- Vite
- Neon Postgres for initial test data and logic
- GitHub for version control
- Vercel for deployment

The coding agent must explicitly confirm: **"Default stack detected:**

- Astro (SSR mode)
- React (.jsx)
- Tailwind CSS
- Framer Motion
- Vite
- Neon Postgres (initial, local testing)
- Vercel deployment (after GitHub)

**Proceed with this stack? (Yes / Modify)"**

## 3. MVP Core Features
Only include the minimum features required for the app to function:

- Create and save a recommendation card
- View saved recommendations in a shared guide/dashboard
- Store recommendation fields:
  - title
  - streamer / where to watch
  - type (show, limited series, movie, documentary)
  - genre / topic
  - short blurb
- Track user-specific status:
  - In my queue
  - Watching
  - Done
  - No thanks
- Trigger post-watch rating flow when status becomes **Done**
- Support 1–5 taco rating system with user-facing scale:
  - 1 — seriously, nope 👎
  - 2 — meh, not my fave 🫤
  - 3 — not a total waste 🤔
  - 4 — my kind of spice 🌶️
  - 5 — lined-up at Buddy’s in January good 🔥
- Ask **More like this** as a separate boolean action/button
- Ask **“Drop your 2-sentence hot take?”** with Lucide-style hairline mic icon
- Show hot take choice buttons using Lucide-style hairline outline icons only:
  - **YEP** with thumbs-up outline icon
  - **NAW, I’M GOOD** with thumbs-down outline icon
- Support optional typed or recorded hot take
- AI-clean voice or text ramble into 1–2 succinct spoiler-light sentences
- Notify the other user when a reveal is ready using:
  - in-app notification state
  - optional Loops email notification for MVP
- Let the recommender edit or delete their own recommendation cards
- Let each user add their own rating and optional hot take on the same shared rec card
- Support Add to Home Screen behavior and app-like iOS browser handling

## 4. MVP User Flow
1. User lands on: **Home**
2. User does: **DROP A REC** or **VIEW GUIDE**
3. System responds by:
   - opening the add-rec form, or
   - opening the shared guide/dashboard
4. User completes:
   - creates a rec and saves it to the shared watch list, or
   - updates status on an existing rec
5. If user marks a rec as **Done**:
   - system reveals taco scale
   - user submits 1–5 taco rating
   - system asks **More like this?**
   - system asks **Drop your 2-sentence hot take?** with Lucide-style hairline mic icon
6. If user chooses to leave a hot take:
   - system presents:
     - **YEP** with Lucide-style thumbs-up outline icon
     - **NAW, I’M GOOD** with Lucide-style thumbs-down outline icon
7. If user submits rating and optional hot take:
   - system saves reveal state
   - other user is notified
8. Other user opens the app:
   - views animated reveal
   - sees taco rating and hot take beneath it
9. After viewing:
   - if other user has not yet rated, button says **COOL, ADD MY RATING**
   - after they complete their own rating flow, the first user is notified
10. Final reveal viewed:
   - return path goes to Home with:
     - **DROP A REC**
     - **VIEW GUIDE**

## 5. UI Governance (MVP)
All UI and UX implementation must strictly follow: `/misc-docs/vibe-coder-prep.md`

This includes:
- color selection protocol
- font pairing selection
- layout rules
- interaction rules
- icon system (Lucide)
- deck-on-scroll behavior (if applicable)

Do NOT:
- redefine UI rules in this document
- apply generic styling defaults
- skip the UI selection protocol

UI decisions are not made in this document. They are enforced by the `vibe-coder-prep.md` system.

## 6. MVP UI Structure
Pages / views required:
- **Home**
- **Drop a Rec**
- **View Guide**
- **Rating Reveal / Review Flow**

Core components required:
- Recommendation card
- Add Rec form
- Shared guide/dashboard grid or list
- Status selector
- Taco rating modal or screen
- Reveal animation component
- Hot take input component
- Notification / pending reveal indicator
- Return-to-home action buttons

## 7. MVP Logic Rules
- Only the original recommender can edit or delete the base recommendation card
- Each recommendation card is shared, but each user has their own status, taco rating, and optional hot take
- **More like this** is a separate boolean action, not a status
- Hot take prompt label must be:
  - **Drop your 2-sentence hot take?** with Lucide-style hairline mic icon
- Hot take choice buttons must use Lucide-style hairline outline icons only:
  - **YEP** with thumbs-up outline icon
  - **NAW, I’M GOOD** with thumbs-down outline icon
- Taco rating is only prompted after a rec is marked **Done**
- The hot take remains optional
- The watcher can update their hot take only until the recommender has viewed that reveal
- Once a reveal has been viewed by the other user, the displayed hot take for that reveal becomes locked
- After viewing the watcher’s reveal, the recommender sees:
  - **COOL, ADD MY RATING**
- After the recommender completes their own reveal and the watcher has viewed it, the watcher sees:
  - **SWEET, ALL DONE HERE**
- After completion of the reveal cycle, users return to:
  - **DROP A REC**
  - **VIEW GUIDE**
- For the hot take prompt sequence only, use Lucide-style hairline outline icons
- For the taco rating scale and reveal sequence, preserve Apple-style emoji presentation
- Notification delivery for MVP must use:
  - in-app notification state
  - optional Loops email notification
- Do not assume native mobile push notifications for v1

## 8. Acceptance Criteria
MVP is considered complete when:

- A user can add a rec and save it to the shared watch list
- Both users can view the shared guide and update their own watch progress
- Marking a rec as **Done** triggers the taco rating flow
- The taco scale appears before voting and stores the selected rating
- Users can optionally submit a 2-sentence hot take by text or voice
- Voice or messy text can be condensed into a short spoiler-light summary
- The other user receives a notification that a reveal is ready
- The reveal screen displays the taco rating and hot take with animation
- The recommender can edit or delete only the recs they created
- Reveal-lock behavior works as intended after the other user views it
- Hot take prompt sequence uses Lucide-style hairline outline icons only
- Taco rating sequence preserves Apple-style emoji
- Loops email notification can be wired as an optional outbound notification layer in MVP

## 9. Known MVP Limitations
This version may intentionally exclude:
- auth
- advanced integrations
- complex backend orchestration
- scalability enhancements reserved for future phase
- external streaming service APIs
- automatic content enrichment
- recommendation matching based on taco patterns
- push notification infrastructure beyond simple in-app notification state plus optional email notification

Unless otherwise specified by the user.
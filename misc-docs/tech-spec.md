# Technical Specification

## 1. Project Title
**Watchr**

## 2. Default Technical Stack
Use this stack by default unless user modifies it:
- Runtime / app framework: Astro (SSR mode)
- Frontend UI layer: React (.jsx)
- Styling system: Tailwind CSS
- Motion / micro-interactions: Framer Motion
- Build tool: Vite
- Initial backend / data layer: Neon Postgres
- Notification layer: Loops email notifications + in-app notification state
- Local dev environment: MacOS LDE on external hard drive
- Preferred coding environment: Antigravity with Gemini 3.1 Pro High
- Alternative coding environment: Codex 5.3 or 5.4
- Version control: GitHub
- Deployment target: Vercel
- Possible future migration path: Cloudflare Workers + KV + Durable Objects

## 3. Confirmation Rule
Before architecture or code generation begins, the agent must confirm:

"Default stack detected:
- Astro (SSR mode)
- React (.jsx)
- Tailwind CSS
- Framer Motion
- Vite
- Neon Postgres (initial, local testing)
- Loops for email notifications
- Vercel deployment (after GitHub)
Proceed with this stack? (Yes / Modify)"

## 4. Architecture Overview
Describe the app’s high-level structure:

### Frontend rendering approach
- Astro SSR application using React components for interactive UI sections
- Mobile-first SPA experience
- Framer Motion used for reveal animations, transitions, and micro-feedback moments
- Tight route/view structure with minimal navigation overhead

### Route / page logic
Minimum intended views:
- Home
- Drop a Rec
- View Guide
- Rating Reveal / Review Flow

These may be implemented as route-based pages or tightly managed SPA states, but the UX must preserve the approved flow and labels.

### Data flow
- User creates a recommendation card
- Recommendation data is written to Neon
- Shared guide reads recommendation cards and user-specific reaction state
- When a status becomes `Done`, rating flow starts
- Rating, optional `More like this`, and optional hot take are saved
- Reveal state updates and in-app notification state is set for the other user
- Optional Loops email notification is triggered for the other user
- Second user views reveal, then optionally adds their own rating and hot take
- Both reveal states remain associated with the same shared rec card

### State flow
- Local component state for active forms, modal/reveal steps, and transitions
- Server-backed persistence for recommendations, statuses, ratings, hot takes, and reveal states
- Lightweight shared state across views for notification badges, guide refresh, and active user progress
- Temporary session state may be used for in-progress add flows or reveal steps that do not yet need persistence

### Backend responsibilities
- Persist shared recommendation card data
- Persist user-specific status and reaction data
- Lock hot take editing after reveal is viewed by the other user
- Manage reveal state transitions
- Manage notification state flags
- Optionally send Loops email notifications

### Deployment path
- Local testing in LDE
- GitHub repo creation from app folder
- Deploy to Vercel
- Wire Neon environment variables
- Wire Loops environment variables and template/config values as needed

## 5. UI Governance Rule
All UI and design decisions are governed exclusively by: `/misc-docs/vibe-coder-prep.md`

Do NOT:
- redefine UI rules in this document
- override design system constraints
- introduce new styling logic outside the vibe doc

This document controls structure and logic only.

## 6. File Structure
Document the intended file tree, including:
- `/src`
- `/components`
- `/lib`
- `/styles`
- `/public`
- `/misc-docs`

Expected structure includes React component files for:
- recommendation cards
- status controls
- rating flow
- reveal flow
- hot take input
- notification indicators
- CTA/action buttons

## 7. Data Structure
Document key data models, JSON structures, and local or remote storage assumptions.

### Core model: recommendation
Suggested fields:
- `id`
- `created_by_user_id`
- `title`
- `streamer`
- `content_type`
- `genre_or_topic`
- `short_blurb`
- `created_at`
- `updated_at`

### User reaction model
Suggested fields:
- `id`
- `recommendation_id`
- `user_id`
- `status`
- `taco_rating`
- `more_like_this`
- `hot_take_raw`
- `hot_take_clean`
- `hot_take_source_type` (`text` or `voice`)
- `reveal_ready`
- `reveal_viewed_by_other_user`
- `created_at`
- `updated_at`

### Notification model
Suggested fields:
- `id`
- `recommendation_id`
- `target_user_id`
- `notification_type`
- `is_read`
- `email_sent`
- `created_at`

### Enum / controlled values
`content_type`
- `show`
- `limited_series`
- `movie`
- `documentary`

`status`
- `in_my_queue`
- `watching`
- `done`
- `no_thanks`

`notification_type`
- `reveal_ready`
- `second_reveal_ready`

## 8. State Management
Document:
- local component state
- shared state
- persistence logic
- any progression or session storage rules

### Local component state
Use local state for:
- form inputs
- rating selection
- hot take prompt choice
- reveal step progression
- animation visibility
- optimistic UI feedback

### Shared state
Use shared state only where needed for:
- current user context
- guide refresh
- unread notification badges
- active rec detail view

### Persistence logic
Persist to Neon:
- recommendation cards
- per-user statuses
- ratings
- `more_like_this` boolean
- hot takes
- reveal lock state
- notification state

### Progression / session rules
- Rating flow only appears when status becomes `Done`
- `More like this` is a separate boolean action, not a status
- Hot take remains optional
- Watcher can update their hot take only until the recommender has viewed the reveal
- Once viewed by the other user, the displayed hot take for that reveal becomes locked

## 9. Logic Flows
Document the major system flows:
- user entry
- user action
- response generation
- data save/update
- completion logic

### Flow A — Add recommendation
- User enters Home
- User taps `DROP A REC`
- User fills out recommendation fields
- User taps `SAVE TO WATCH LIST`
- System creates shared rec card
- User returns to guide or home

### Flow B — Watcher completes rec
- User opens guide
- User updates own status to `Done`
- System opens taco rating flow
- User selects taco rating
- System asks `More like this`
- System asks `Drop your 2-sentence hot take?` with Lucide mic icon
- User submits or skips hot take
- System stores reaction, sets reveal ready, and creates notification for other user

### Flow C — Recommender views watcher reveal
- Recommender opens app
- In-app notification and optional email indicate reveal is ready
- Recommender opens reveal
- System plays rating + hot take reveal
- After viewing, recommender sees `COOL, ADD MY RATING`

### Flow D — Recommender completes response
- Recommender selects own taco rating
- Recommender optionally adds own hot take
- System saves second reveal
- Other user is notified
- Other user views recommender reveal
- CTA becomes `SWEET, ALL DONE HERE`
- User returns to Home and can choose `DROP A REC` or `VIEW GUIDE`

## 10. Integrations
Document any required integrations for MVP and any deferred integrations for later phases.

### MVP integrations
- Neon Postgres
- Loops email notifications
- Optional voice input capture / browser media input support

### Deferred integrations
- streaming metadata APIs
- recommendation enrichment APIs
- richer push/SMS notification providers
- external content lookup services

## 11. Risks / Edge Cases
Document likely failure points, weird cases, and assumptions that need validation.

- Same user accidentally tries to rate twice before proper reveal lock handling
- Both users change status nearly simultaneously
- Hot take edit arrives after reveal was already viewed
- Loops email fails while in-app notification succeeds
- Voice capture is denied, unavailable, or unsupported
- User leaves rating flow midway and resumes later
- Recommendation is deleted after one user already interacted with it
- Missing streamer or genre values must not block save if those fields are intended to be optional
- App must remain usable as a Home Screen web app on iPhone without pretending to be native

## 12. Approval Gate
Do not generate code until this technical spec is reviewed and approved by the user.
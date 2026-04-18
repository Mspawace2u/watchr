# Vibe Coder Prep for Watchr

## 1. Purpose
This document is the active project-specific UI source of truth for the current Watchr build.

It defines:
- approved colors
- approved typography
- icon rules
- interaction rules
- CTA behavior
- layout discipline
- deck-on-scroll usage rules
- frontend guardrails for MVP implementation

## 2. Confirmed Stack Context
Use this stack unless the user explicitly changes it:
- Astro (SSR mode)
- React (.jsx)
- Tailwind CSS
- Framer Motion
- Vite
- Neon Postgres
- GitHub
- Vercel
- Loops for email notifications

Preferred coding environment:
- Antigravity (Gemini 3.1 Pro High)

Alternative:
- Codex 5.3 or 5.4 if needed

## 3. Confirmed UI Selections

### 3.1 Core Color Palette (Strict Adherence)
- **Main Background:** `#050505` (Deep, almost-pitch black)
- **Primary Text:** `#F3F4F6` (Off-white for readability)
- **Secondary Text / Subtitles:** `#5B6B7F` (Muted steel blue-gray)
- **Brand Gradients (The "Vibe" Glow):**
  - Linear and/or radial combinations with subtle diffusion glow
  - Use only the **2–4 colors chosen by the user** from the approved brights palette
  - Do not introduce unapproved glow colors

### 3.2 Approved Brights Palette
Use ONLY these approved bright colors:
- **Electric Purple** `#9b5cff`
- **Totes Turquoise** `#2de2e6`
- **Punk Rock Pink** `#ff2f92`
- **Screamer Green** `#3cff9e`
- **Highlighter Yellow** `#ffe44d`
- **Orange U Bright** `#f97316`

### 3.3 Locked Project Colors
- **Primary:** Totes Turquoise `#2de2e6`
- **Secondary:** Electric Purple `#9b5cff`
- **Accent 1:** Highlighter Yellow `#ffe44d`
- **Accent 2:** Screamer Green `#3cff9e`

### 3.4 Confirmed Font Pairing
- **Heading / UI font:** Urbanist
- **Supporting / body font:** Kumbh Sans

Do not re-ask for colors or fonts unless the user explicitly resets or overrides them.

## 4. Typography Rules
- Headings use **Urbanist**
- Body copy uses **Kumbh Sans**
- No italics unless explicitly requested
- Labels and buttons should use uppercase with clean tracking where appropriate
- Keep typography crisp, readable, and premium without crowding the screen

## 5. Icon Rules
- Use **Lucide only**
- Outline style only
- Hairline stroke
- Consistent sizing across components
- No mixed icon libraries

### Special exception
For the **taco rating scale and rating reveal only**, preserve the approved Apple-style emoji presentation for the rating language.

### Hot take prompt sequence
For this sequence only, use Lucide-style hairline outline icons:
- Mic icon next to: `Drop your 2-sentence hot take?`
- Thumbs-up outline icon for: `YEP`
- Thumbs-down outline icon for: `NAW, I’M GOOD`

## 6. Design System Rules

### 6.1 Color system
- Base UI must anchor on `#050505`, `#F3F4F6`, and `#5B6B7F`
- Use ONLY the approved palette
- No generic Tailwind defaults like `blue-500`, `gray-100`, etc.
- Maintain consistent accent usage
- Brights are for emphasis, glow, borders, and interactive moments — not for replacing the core readability palette
- Dark backgrounds should support glow, contrast, and readability
- Totes Turquoise should do most of the heavy lifting as the primary action color
- Electric Purple should support secondary emphasis, framing, and glow accents
- Highlighter Yellow and Screamer Green should be used sparingly for highlights, confirmation moments, and reward states

### 6.2 Buttons
Critical rules:
- Pill shape ONLY
- Transparent fill in resting state
- Gradient hairline border
- Hover state:
  - solid fill using approved accent logic
  - dark text for contrast
  - glow effect
- Keep labels short and bold

### 6.3 Cards and containers
- Dark backgrounds
- Subtle borders
- Rounded corners
- Glassmorphism for overlays, headers, or layered interface moments where it enhances clarity
- Avoid heavy chrome or visual clutter

## 7. Motion and Interaction Rules
- All interactive elements use:
  - `transition-all`
  - `duration-300`
  - hover elevation where appropriate
- Use subtle glow backgrounds
- Use gradient text sparingly
- Use micro-interactions for feedback
- Avoid static-feeling UI
- Avoid excessive animation
- Keep reveal moments playful but controlled

### Reveal behavior
- Taco rating reveal should feel rewarding
- Strong ratings should support confetti or celebratory motion
- Low ratings may use an alternate funny fail-style animation later if approved
- Motion should support clarity, not chaos

## 8. Layout Rules
- Mobile-first design
- Left alignment preferred
- Maintain symmetry across sections
- High negative space
- Clear section separation
- Avoid cramped dashboards or overstuffed cards

## 9. Deck-on-Scroll Rules
Use deck-on-scroll only if a page is behaving like a landing-page or slide-deck experience.

For Watchr:
- It may be appropriate for adding a rec, reading a reveal, or adding 2-sentence review moments
- See card carousel section on this app for shuffler motion as one potential way to move through steps for adding a rec or a review
  - `https://www.mcpvibe.codes/revops`
- Reference progress log page in this app for a card-style dashboard design to model
  - `https://gig-spottr-bot.vercel.app/`
- Open the FIT card toggle, then open the nested card toggle to see one method of handling details without clutter
- Reference home page in this app for a card design to model for viewing a new rec or a review reveal
  - `https://cu-bettr.vercel.app/`
- Do not force scroll snap on content-heavy screens

If used:
- one core idea per screen
- vertically centered content
- symmetrical top and bottom spacing
- avoid overloading each screen

Do NOT:
- overload sections with multiple ideas
- break vertical centering or left alignment in containers
- force scroll snap on long/dense content

### 9.1 Implementation
Main container:
- vertical scroll snapping enabled

Sections:
- snap-aligned
- structured for clarity, not density

Suggested implementation language:
- `scroll-snap-type: y mandatory`
- `scroll-snap-align: start OR center (based on content height)`
- `min-height: 100svh`

### 9.2 Motion Behavior
Reference special time-delayed motion effects asked for by user on live websites or via access to deployed app repos for clarification when needed.

Otherwise:
- Use subtle entrance animations per section
- Use timed motion ONLY when it enhances clarity
- Avoid over-animation

## 10. App-Specific UX Notes
- This app should feel cinematic, playful, clean, and easy to navigate
- It must not feel like homework, a spreadsheet, or a review site
- It is a shared rec and reveal experience for two users, not a public feed
- Keep friction low
- Preserve the emotional payoff of the reveal flow

## 11. Locked Copy / Interaction Labels
Use these exact labels unless the user approves changes:

### Home actions
- `DROP A REC`
- `VIEW GUIDE`

### Add flow
- `ADD A REC`
- `SAVE TO WATCH LIST`

### Status values
- `In my queue`
- `Watching`
- `Done`
- `No thanks`

### Post-watch flow
- `More like this`
- `Drop your 2-sentence hot take?`
- `YEP`
- `NAW, I’M GOOD`
- `COOL, ADD MY RATING`
- `SWEET, ALL DONE HERE`

## 12. Build Discipline
- Build module by module
- Validate before expanding
- Keep components modular
- Avoid unnecessary dependencies
- Do not override confirmed UI choices mid-build
- Do not add unapproved features
- Ask minimum necessary questions only

## 13. Do Not Do List
- Don’t freestyle the stack
- Don’t skip confirmation gates
- Don’t use generic UI defaults
- Don’t mix design systems
- Don’t collapse MVP and future scope
- Don’t re-ask for already approved colors or fonts
- Don’t replace approved Apple-style rating emoji in the taco rating flow
# Synapse — Web-Based Aptitude Game Platform

## 1. Project Overview

**Project Name:** Synapse
**Type:** Web-based aptitude training platform
**Tagline:** *Spark Your Thinking.*

Synapse is a browser-based platform that helps users sharpen their cognitive and aptitude skills through 11 fun, bite-sized mini-games. Each game targets a specific mental skill — logic, memory, numerical ability, spatial reasoning, verbal skills, attention, and pattern recognition — making it useful for students preparing for aptitude tests, professionals doing brain training, or casual users who enjoy puzzles.

The platform runs entirely in the browser (no installation needed) and is designed to be lightweight, responsive, and accessible on both desktop and mobile devices.

---

## 2. Goals & Objectives

- Provide an engaging, gamified way to practice aptitude-style skills.
- Offer a unified hub where users can pick from 11 different mini-games.
- Track user progress, scores, and improvement over time.
- Support gradual content rollout — some games launch first while others are flagged "Coming Soon".
- Build a foundation that can scale to add more games, leaderboards, and challenges in the future.

---

## 3. Target Users

- **Students** preparing for aptitude tests (GAT, SAT, GRE, civil service, job entrance exams).
- **Job seekers** practicing for company aptitude assessments.
- **Casual learners** who enjoy brain teasers and puzzle games.
- **Educators / parents** looking for safe, educational web games for learners.

---

## 4. Core Features

### 4.1 Main Hub Page
- Clean, modern landing page with platform branding.
- Hero section with tagline and quick stats (number of games, skill areas, levels).
- Game grid showing all 11 mini-games at a glance.
- Each game card displays its icon, name, short description, and status (Play Now / Coming Soon).
- Navigation bar with **Games**, **High Scores**, and **Settings** anchors.

### 4.2 Game Status Indicator
- **Ready games**: colorful gradient icon, hover animation, clickable link to play.
- **Non-ready games**: grayscale icon with a lock badge and "Coming Soon" label. Clicking shows a friendly alert.

### 4.3 High Scores Panel (implemented)
- Per-game cards showing **top 3 final scores** for each ready game (read directly from each game's `localStorage` session log).
- A scrollable **Recent Plays** card listing the latest 100 sessions across all games with relative timestamps and per-row score; sticky header, hidden until any session exists.
- Auto-refreshes on `visibilitychange` so returning from a game tab updates the panel.

### 4.4 Settings Panel (implemented)
- A single **Reset Now** button that clears every ready game's `*.sessions` key from `localStorage`, wiping high scores and recent plays.
- Confirmation prompt before destructive action.

### 4.5 Scoring & Progression (planned)
- Score, accuracy, and time tracked per session.
- XP points and player level.
- Daily streaks and achievement badges.

### 4.6 Leaderboard (planned)
- Global and friends-only rankings per game.
- Weekly / all-time filters.

### 4.7 User System (planned)
- Sign up / Sign in with email or Google.
- Personal profile with avatar, level, and cross-device history.
- Per-game best scores and improvement charts.

---

## 5. Mini-Game List

| # | Game Name | Skill Area | Status |
|---|-----------|------------|--------|
| 1 | Numeric Cascade | Visual scanning / focus / working memory | **Ready** |
| 2 | Number Ninja | Numerical / mental math | Coming Soon |
| 3 | Word Wizard | Verbal reasoning | Coming Soon |
| 4 | Memory Matrix | Visual memory | Coming Soon |
| 5 | Bargain Blitz | Mental math / percentage estimation | **Ready** |
| 6 | Pattern Pulse | Pattern recognition | Coming Soon |
| 7 | Quick Click | Reaction / focus | Coming Soon |
| 8 | Flow Forge | Spatial reasoning / pathfinding | **Ready** |
| 9 | Visual Voyage | Visual perception | Coming Soon |
| 10 | Puzzle Quest | Multi-step problem solving | Coming Soon |
| 11 | Phantom Path | Pattern recognition / forecasting | **Ready** |

### Brief Game Concepts

**Numeric Cascade** — Schulte-style 5×5 grid; tap numbers in order against a 5-minute clock. Each correct tap fades out and a new number cascades in from a sliding pool. Skipping ahead wipes the numbers between, costing the streak.

**Number Ninja** — Solve quick arithmetic problems against the clock. Combo bonuses for streaks of correct answers.

**Word Wizard** — Anagrams, synonyms, antonyms, and analogies under a timer. Difficulty scales with player level.

**Memory Matrix** — A grid of tiles flashes a pattern; the player must reproduce it. The grid grows each level.

**Bargain Blitz** — A 4×5 shelf of marked-down items with a per-round discount threshold. Click only the items whose reduced price beats the threshold to fill your Cart. Five rounds, five-minute clock; an optional hint pill shows the breakeven full price for each item.

**Pattern Pulse** — Pick the next item in a sequence (numerical, visual, or symbolic).

**Quick Click** — Tap targets as they appear; ignore distractors. Tests reaction time and selective attention.

**Flow Forge** — Rotate pipe segments on a grid to route water from a source to one or more valid outlets while avoiding sealed valves. Click LAUNCH when ready; round difficulty ramps from 4×4 / one outlet to 5×5 / two outlets across three rounds.

**Visual Voyage** — Spot the difference, find the odd-one-out, or locate a hidden object in a busy scene.

**Puzzle Quest** — Story-based puzzles requiring chained reasoning steps.

**Phantom Path** — A phantom drifts down a 10×10 grid one row per second, weaving through a hidden anchor + deviation pattern. After it exits, predict its column on the unseen row 11. Hint mode reveals the recurring deviation as dashed lines once the relevant trace appears.

---

## 6. System Architecture (High Level)

### 6.1 Frontend
- **HTML5 + CSS3 + JavaScript (vanilla)** for the main hub and games.
- Responsive layout using CSS grid and flexbox.
- Game logic runs client-side; no plugins required.
- Optional upgrade path: migrate to **React** or **Vue** for state management once user accounts are added.

### 6.2 Backend (planned)
- **Node.js + Express** (or Python + FastAPI) REST API.
- Endpoints for authentication, score submission, leaderboards, and user profile.
- **Database**: PostgreSQL or MongoDB for user data and scores.

### 6.3 Hosting
- Static frontend on Netlify, Vercel, or GitHub Pages.
- Backend on Render, Railway, or a small VPS.

---

## 7. Folder Structure

```
Aptitude Game/
├── index.html                       # Main hub (games grid, High Scores, Settings)
├── PROJECT_DETAIL.md                # This document
├── CLAUDE.md                        # Guidance for Claude Code agents
├── NAMING_PROPOSAL.md               # Historical brand-naming proposal
├── dev.bat / dev.sh                 # Local dev runner (vercel dev :3000)
├── games/
│   ├── numeric-cascade.html         # Game #1 — Ready
│   ├── numeric-cascade.md
│   ├── bargain-blitz.html           # Game #5 — Ready
│   ├── bargain-blitz.md
│   ├── flow-forge.html              # Game #8 — Ready
│   ├── flow-forge.md
│   ├── phantom-path.html            # Game #11 — Ready
│   ├── phantom-path.md
│   ├── number-ninja.html            # Stub — locked on the hub
│   ├── word-wizard.html             # Stub — locked
│   ├── memory-matrix.html           # Stub — locked
│   ├── pattern-pulse.html           # Stub — locked
│   ├── quick-click.html             # Stub — locked
│   └── shape-shifter.html           # Legacy stub (no longer linked from hub)
└── assets/
    ├── css/
    │   └── theme.css                # Shared tokens + page chrome for game pages
    └── js/
        └── supabase-client.js       # Initializes window.brainArenaSupabase
```

---

## 8. UI / Design System

- **Theme:** Dark mode with vibrant gradient accents.
- **Primary palette:**
  - Background: `#0f172a` → `#1e293b` (gradient)
  - Accent: `#6366f1` (indigo) and `#8b5cf6` (violet)
  - Text: `#f1f5f9`
  - Muted: `#94a3b8`
  - Locked / disabled: `#475569` grayscale
- **Typography:** Segoe UI / system sans-serif stack.
- **Style:** Glassmorphic cards, soft shadows, smooth hover lift animations.
- **Iconography:** Emoji icons for prototype; can be swapped to custom SVG icons in production.

---

## 9. User Flow

1. User lands on main hub → sees 11 game cards.
2. User clicks a **ready** game → opens that game's page.
3. User clicks a **locked** game → sees "Coming Soon" message.
4. After a game, user sees their score and can replay or return to hub.
5. (Future) Score submitted to server; updates leaderboard and player stats.

---

## 10. Development Phases

### Phase 1 — MVP (current)
- Hub page with games grid, High Scores panel (top-3 per game + last 100 plays), and Settings panel (reset).
- 4 fully implemented games: **Numeric Cascade** (#1), **Bargain Blitz** (#5), **Flow Forge** (#8), **Phantom Path** (#11).
- Remaining 7 slots locked on the hub with "Coming Soon" indicators.
- Local-only score tracking via `localStorage` (one `*.sessions` array per game, capped at 20 most-recent entries each).

### Phase 2 — User Accounts
- Add sign-up / sign-in with email and OAuth.
- Backend API and database.
- Cloud-saved progress and stats.

### Phase 3 — Social & Competitive
- Global and friends leaderboards.
- Achievements, badges, and daily challenges.
- Release the remaining 4 games.

### Phase 4 — Polish & Scale
- Custom icon set and animations.
- Mobile-first PWA support.
- Multi-language support (Thai, English).
- Optional ads-free premium tier.

---

## 11. Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, JavaScript (vanilla → React later) |
| Styling | Custom CSS (dark theme, glassmorphic) |
| Backend | Node.js + Express *(planned)* |
| Database | PostgreSQL or MongoDB *(planned)* |
| Auth | JWT + OAuth (Google) *(planned)* |
| Hosting | Vercel / Netlify (frontend), Render (backend) |
| Version Control | Git + GitHub |

---

## 12. Success Metrics

- **Engagement:** Average session length and games played per visit.
- **Retention:** Daily and weekly active users.
- **Skill improvement:** Average score growth per user over time.
- **Reach:** Total registered users and games launched.

---

## 13. Risks & Considerations

- **Scope creep** — keep MVP focused; only release polished games.
- **Performance** — keep games lightweight to load fast on low-end devices.
- **Cheating / score manipulation** — validate scores server-side once leaderboard goes live.
- **Accessibility** — ensure colorblind-friendly palettes and keyboard support.

---

## 14. Roadmap Snapshot

- **Q2 2026:** Launch MVP with 7 ready mini-games.
- **Q3 2026:** Add user accounts, profile, and basic stats.
- **Q4 2026:** Release the remaining 4 games + global leaderboard.
- **2027:** Mobile PWA, multi-language, premium tier.

---

*Document version: 1.0 — Last updated: May 2026*

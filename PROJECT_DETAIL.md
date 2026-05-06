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
- Navigation bar with Games, Leaderboard, Profile, and Sign In.

### 4.2 Game Status Indicator
- **Ready games**: colorful gradient icon, hover animation, clickable link to play.
- **Non-ready games**: grayscale icon with a lock badge and "Coming Soon" label. Clicking shows a friendly alert.

### 4.3 User System (planned)
- Sign up / Sign in with email or Google.
- Personal profile with avatar, level, and stats.
- Per-game best scores and improvement charts.

### 4.4 Scoring & Progression (planned)
- Score, accuracy, and time tracked per session.
- XP points and player level.
- Daily streaks and achievement badges.

### 4.5 Leaderboard (planned)
- Global and friends-only rankings per game.
- Weekly / all-time filters.

---

## 5. Mini-Game List

| # | Game Name | Skill Area | Status |
|---|-----------|------------|--------|
| 1 | Logic Labyrinth | Logical reasoning | Ready |
| 2 | Number Ninja | Numerical / mental math | Ready |
| 3 | Word Wizard | Verbal reasoning | Ready |
| 4 | Memory Matrix | Visual memory | Ready |
| 5 | Shape Shifter | Spatial reasoning | Ready |
| 6 | Pattern Pulse | Pattern recognition | Ready |
| 7 | Quick Click | Reaction / focus | Ready |
| 8 | Math Mania | Advanced arithmetic | Coming Soon |
| 9 | Visual Voyage | Visual perception | Coming Soon |
| 10 | Puzzle Quest | Multi-step problem solving | Coming Soon |
| 11 | Focus Flash | Attention / concentration | Coming Soon |

### Brief Game Concepts

**Logic Labyrinth** — Navigate a maze where each path is gated by a true/false logic statement. Pick the right path to reach the exit.

**Number Ninja** — Solve quick arithmetic problems against the clock. Combo bonuses for streaks of correct answers.

**Word Wizard** — Anagrams, synonyms, antonyms, and analogies under a timer. Difficulty scales with player level.

**Memory Matrix** — A grid of tiles flashes a pattern; the player must reproduce it. The grid grows each level.

**Shape Shifter** — Identify which 3D shape matches a 2D net, or rotate a shape to match a target.

**Pattern Pulse** — Pick the next item in a sequence (numerical, visual, or symbolic).

**Quick Click** — Tap targets as they appear; ignore distractors. Tests reaction time and selective attention.

**Math Mania** — Mixed equation solving with variables, fractions, and order of operations.

**Visual Voyage** — Spot the difference, find the odd-one-out, or locate a hidden object in a busy scene.

**Puzzle Quest** — Story-based puzzles requiring chained reasoning steps.

**Focus Flash** — Brief images flash with details to memorize, followed by trivia about what was shown.

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
├── index.html              # Main hub page
├── PROJECT_DETAIL.md       # This document
├── games/
│   ├── logic-labyrinth.html
│   ├── number-ninja.html
│   ├── word-wizard.html
│   ├── memory-matrix.html
│   ├── shape-shifter.html
│   ├── pattern-pulse.html
│   └── quick-click.html
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
└── README.md
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
- Build main hub page.
- Implement first batch of 7 ready games.
- Lock the remaining 4 games with "Coming Soon" indicators.
- Local-only score tracking via `localStorage`.

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

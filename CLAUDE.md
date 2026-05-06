# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Synapse** — a browser-based aptitude training hub with 11 mini-game slots. Currently in MVP/Phase 1: hub (`index.html`) plus pages under `games/` for the "ready" titles. The hub has three sections: a games grid, a **High Scores** panel (top-3 per game + the latest 100 plays across all games, scrollable card with sticky header), and a **Settings** panel with a single button that wipes every game's `*.sessions` key from `localStorage`.

**Four games are fully implemented**:

| Slot | Slug | Spec | localStorage key |
|------|------|------|------------------|
| 1 | `numeric-cascade.html` | `games/numeric-cascade.md` | `numericCascade.sessions` |
| 5 | `bargain-blitz.html`   | `games/bargain-blitz.md`   | `bargainBlitz.sessions` |
| 8 | `flow-forge.html`      | `games/flow-forge.md`      | `flowForge.sessions` |
| 11 | `phantom-path.html`   | `games/phantom-path.md`    | `phantomPath.sessions` |

Each game persists session JSON under its own key, capped at 20 most-recent entries. The hub reads all four arrays for the High Scores panel.

The other 7 slots (Number Ninja, Word Wizard, Memory Matrix, Shape Shifter, Pattern Pulse, Quick Click, Visual Voyage, Puzzle Quest — though the visible roster shifts as new games are added) are locked on the hub. See "Game card states" below for the promote-to-ready procedure.

**Cross-game UI conventions** (worth keeping consistent when implementing new games):

- **No Pause / Reset buttons.** The HUD has a single **End at this point** button. Clicking it opens a modal — *"End the run? Your current score will be saved."* — with **End Run** (danger) + **Cancel** (secondary). Confirm → the in-flight round is finalized, the session is persisted with `ended_reason: "quit"`, and the End screen appears.
- **Play Again** on the End screen returns to the intro for a fresh run; that replaces the old "Reset" path.
- Most games offer an optional **Hint: On / Off** button (gold-styled when active) and persist the preference in their own `localStorage` key (e.g. `phantomPath.hintMode`, `bargainBlitz.hintMode`).
- Keyboard shortcuts are mostly removed except in Numeric Cascade, which still has `P` (pause) and `H` (toggle hint).

See `PROJECT_DETAIL.md` for the full game roster, roadmap, and planned backend (none of which is implemented yet).

## Stack & Tooling

Pure static **HTML5 + CSS3 + vanilla JavaScript**. No build system, no package manager, no tests, no lint config. The path contains a space (`Aptitude Game/`) — quote it in shell commands.

A future migration to React/Vue and a Node/Express backend is mentioned in `PROJECT_DETAIL.md`, but nothing in the repo today depends on those — don't introduce framework code or a build step unless explicitly asked.

## Local development

`./dev.sh` (Mac/Linux) or `dev.bat` (Windows) starts `vercel dev --listen 3000`, which mirrors the production runtime. The Vercel project is already linked (`.vercel/` is gitignored), so no setup is needed beyond being logged in to the Vercel CLI. Open http://localhost:3000.

Fallback if `vercel dev` is unavailable: `python -m http.server 3000` from the project root works fine for the static pages — but it won't pick up `vercel.json` rewrites or env vars, so prefer `vercel dev` once any of those exist.

`.env.local` (gitignored) is read by `vercel dev` and is where future server-side secrets (e.g. `SUPABASE_SERVICE_ROLE_KEY`) belong. `.env.local.example` documents the shape; the static frontend itself needs no env vars today.

## Backend

Supabase is wired up but unused — the client is initialized in `assets/js/supabase-client.js` and exposed as `window.brainArenaSupabase` for game code to call when needed. The `SUPABASE_PUBLISHABLE_KEY` in that file is **safe to commit and ship to the browser** — Supabase's anon/publishable keys are designed for client use, with Row Level Security in the dashboard being what actually gates data. **Never put `service_role` or `sb_secret_*` keys anywhere in this repo or in client code.** Project ref: `uxgszfjjrutpfwdlahbc` (region: Northeast Asia / Tokyo).

## Architecture conventions

The hub (`index.html`) keeps its CSS and JS inline — leave it that way unless the user asks for an extraction. Game pages under `games/` follow a different pattern: they share `assets/css/theme.css` (tokens + page chrome) and load it with `<link rel="stylesheet" href="../assets/css/theme.css">`. Game-specific styles, when added, can go inline in a `<style>` block on each game page so individual games can diverge without affecting the others.

**Design tokens** are CSS custom properties on `:root` in `theme.css` (`--bg-1`, `--bg-2`, `--accent` `#6366f1`, `--accent-2` `#8b5cf6`, `--text`, `--muted`, `--card`, `--card-border`). The hub also defines `--gray` / `--gray-light` for its locked-card grayscale. Reuse these rather than hardcoding hex values so the dark/glassmorphic theme stays consistent.

**Game stub anatomy** (`games/<slug>.html`): `<body data-color="...">` picks the icon gradient (one of `purple|blue|pink|green|orange|cyan|red`, matching the hub card). The body contains two `.bg-decoration` blobs, a `.page-header` with logo + back-to-hub link, a `.game-stage` wrapping a `.game-card-stub` (icon + name + skill tag + description + dev badge), then the supabase-js CDN script and `../assets/js/supabase-client.js`. When you start implementing a real game, replace the `.game-card-stub` body — keep the data-color, header, and Supabase scripts.

**Game card states** are driven by class + data attribute:
- `.game-card.ready[data-color="purple|blue|pink|green|orange|cyan|red"]` — gradient icon, hover lift, link navigates.
- `.game-card.locked` — grayscale icon, lock badge, `cursor: not-allowed`. A script at the bottom of `index.html` intercepts clicks on `.locked` cards and shows a "Coming Soon" alert; do not give locked cards a real `href` to a game page that doesn't exist.

To promote a game from "Coming Soon" to "Ready": change the `<div class="game-card locked">` to `<a href="games/<slug>.html" class="game-card ready" data-color="<color>">`, remove the `.lock-badge`, and swap `.status-soon` for `.status-play`. The locked-click handler will then skip it automatically.

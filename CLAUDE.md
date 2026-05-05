# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**BrainArena** — a browser-based aptitude training hub with 11 mini-games. Currently in MVP/Phase 1: only the main hub (`index.html`) exists. The 7 "ready" games it links to (`games/*.html`) and the planned `assets/` folder have not been created yet — when adding a game, you are creating the file the hub already points at, not wiring up new links.

See `PROJECT_DETAIL.md` for the full game list, roadmap, and planned backend (none of which is implemented yet).

## Stack & Tooling

Pure static **HTML5 + CSS3 + vanilla JavaScript**. No build system, no package manager, no tests, no lint config. To run, open `index.html` in a browser, or serve the folder with any static server (e.g. `python -m http.server`). The path contains a space (`Aptitude Game/`) — quote it in shell commands.

A future migration to React/Vue and a Node/Express backend is mentioned in `PROJECT_DETAIL.md`, but nothing in the repo today depends on those — don't introduce framework code or a build step unless explicitly asked.

## Backend

Supabase is wired up but unused — the client is initialized in `assets/js/supabase-client.js` and exposed as `window.brainArenaSupabase` for game code to call when needed. The `SUPABASE_PUBLISHABLE_KEY` in that file is **safe to commit and ship to the browser** — Supabase's anon/publishable keys are designed for client use, with Row Level Security in the dashboard being what actually gates data. **Never put `service_role` or `sb_secret_*` keys anywhere in this repo or in client code.** Project ref: `uxgszfjjrutpfwdlahbc` (region: Northeast Asia / Tokyo).

## Architecture conventions established by `index.html`

The hub is a single self-contained file: all CSS lives in a `<style>` block, all JS in a `<script>` block at the bottom. When adding game pages, follow the same self-contained pattern unless the user asks to extract shared assets into `assets/css/` and `assets/js/`.

**Design tokens** are CSS custom properties on `:root` (`--bg-1`, `--bg-2`, `--accent` `#6366f1`, `--accent-2` `#8b5cf6`, `--text`, `--muted`, `--card`, `--card-border`, `--gray`, `--gray-light`). Reuse these rather than hardcoding hex values so the dark/glassmorphic theme stays consistent across pages.

**Game card states** are driven by class + data attribute:
- `.game-card.ready[data-color="purple|blue|pink|green|orange|cyan|red"]` — gradient icon, hover lift, link navigates.
- `.game-card.locked` — grayscale icon, lock badge, `cursor: not-allowed`. A script at the bottom of `index.html` intercepts clicks on `.locked` cards and shows a "Coming Soon" alert; do not give locked cards a real `href` to a game page that doesn't exist.

To promote a game from "Coming Soon" to "Ready": change the `<div class="game-card locked">` to `<a href="games/<slug>.html" class="game-card ready" data-color="<color>">`, remove the `.lock-badge`, and swap `.status-soon` for `.status-play`. The locked-click handler will then skip it automatically.

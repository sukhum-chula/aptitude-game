@echo off
REM Local dev server for BrainArena. Mirrors the Vercel production runtime.
REM Press Ctrl+C to stop.
echo Starting BrainArena dev server...
echo Open http://localhost:3000 in your browser.
echo.
vercel dev --listen 3000

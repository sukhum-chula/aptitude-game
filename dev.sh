#!/usr/bin/env sh
# Local dev server for BrainArena. Mirrors the Vercel production runtime.
# Press Ctrl+C to stop.
echo "Starting BrainArena dev server..."
echo "Open http://localhost:3000 in your browser."
echo
exec vercel dev --listen 3000

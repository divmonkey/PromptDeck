# Project Context

## Application
**PromptDeck** — A prompt management dashboard built with SvelteKit + Vite + Tailwind CSS v4 + SQLite.

## Stack
- **Frontend:** SvelteKit, Tailwind CSS v4, Google Fonts (Inter + Oswald)
- **Backend:** SvelteKit API routes, `better-sqlite3` (WAL mode)
- **Build:** Vite, `@sveltejs/adapter-auto`

## Key Directories
- `src/routes/` — SvelteKit pages (+page.svelte) and API routes (`api/`)
- `src/lib/components/` — Reusable Svelte components (PromptCard, PromptGrid, Toast, PromptModal)
- `src/lib/db.ts` — SQLite database setup
- `static/uploads/` — User-uploaded images (served at `/uploads/`)
- `static/images/` — Static assets (hero backgrounds)
- `skill/ui-ux-pro-max-skill/` — UI/UX skill module

## Database
SQLite `promptvault.db` with tables:
- `prompts` — id, type, imageUrl, title, description, prompt, content, tags(JSON), notes, likes, views
- `likes` — session-based daily like tracking

## Semantic CSS Design System
All visual styles live in named semantic classes inside `src/routes/layout.css`.
Tailwind is used only for layout utilities (flex, grid, gap, responsive prefixes).

Key semantic classes:
- `.page-dashboard`, `.hero-bg` — page & background
- `.site-header`, `.brand-logo`, `.brand-name` — navbar
- `.search-wrap`, `.search-input` — search
- `.login-btn`, `.login-btn--fancy` — login button
- `.glass-bar`, `.filter-pill`, `.filter-pill--active` — filters
- `.prompt-card`, `.prompt-box`, `.card-image-wrap`, `.card-footer` — cards
- `.copy-btn`, `.like-btn`, `.overlay-btn` — actions
- `.toast`, `.toast__box` — notifications
- `.spinner`, `.empty-state` — states
- `.admin-page`, `.admin-table`, `.admin-search` — admin
- `.modal-backdrop`, `.modal-panel` — modals
- `.form-input`, `.btn`, `.btn--primary`, `.btn--danger` — forms

## Git
Remote: `https://github.com/divmonkey/PromptDeck.git`
Branch: `main`

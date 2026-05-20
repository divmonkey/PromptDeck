# Project Status

This document tracks the current status and immediate next steps for the project.

## Working Checkpoint (2026-05-20)
**This is a known-good state. If builds break, revert to commit `618b140`.**

Last known good commit: `618b140 feat: drag-scroll filters, tags filtered by selected type`

### What's Working
- SvelteKit + Vite scaffold with Tailwind CSS v4
- SQLite backend (`better-sqlite3`) with `prompts` and `likes` tables
- Dashboard with search, drag-scroll type/tag filters (no scrollbar), dynamic tag filtering by selected type
- Admin panel (`/admin`) with full CRUD
- 6 demo prompt cards seeded
- Card gradient border hover animation (purple→blue→cyan)
- Clipboard copy icon in prompt box (hover-appearing)
- Like cooldown (24h), view increment, fullscreen image view
- Rebrand: PromptVault → PromptDeck (Oswald condensed font)
- Uploads served from `static/uploads/`

### Active Issues (Non-Blocking)
- Svelte accessibility warnings: `PromptModal.svelte` div with click handler
- `npm run build` warnings: `@import` rule ordering in CSS

## Completed Tasks
- Installed `npm` dependencies.
- Installed `Playwright`.
- Created `/skill/` directory.
- Cloned `ui-ux-pro-max-skill` into `/skill/ui-ux-pro-max-skill`.
- Created `WORKFLOW.MD`, `RULES.MD`, `CONTEXT.MD`.
- Restructured `public/` directory (created `images`, `css`, `js`, moved assets).
- Updated `public/index.html` asset paths.
- Initialized Git repository and performed first commit.
- **Scaffolded SvelteKit + Vite** (existing project already had this).
- **Integrated Tailwind CSS v4** with custom theme (background, surface, accent, condensed font).
- **Configured Oswald condensed font** via Google Fonts + CSS custom property.
- **Replaced MongoDB with SQLite** (`better-sqlite3`) — all CRUD, like, view, import APIs.
- **Built dashboard UI** — header, search, type/tag filters, responsive prompt grid, create modal.
- **All API routes working** — `/api/prompts`, `/api/tags`, `/api/prompts/[id]`, `/api/prompts/[id]/like`, `/api/prompts/[id]/view`, `/api/import`.
- **Rebrand PromptVault → PromptDeck** with bold condensed uppercase Oswald font.
- **Card gradient border hover animation** (purple→blue→cyan).
- **6 demo prompt cards** seeded in DB.
- **Clipboard copy icon** in prompt box (hover-appearing).
- **Fixed uploads path** (`public/` → `static/`).
- **Drag-scroll filters** (no scrollbar) with mouse + touch support.
- **Tags filtered by selected type** dynamically.

## Pending Tasks
- **Production Adapter:** Currently using `@sveltejs/adapter-auto`. For a Node.js server, consider switching to `@sveltejs/adapter-node` or keep `adapter-auto` if deploying to a supported platform.

## Next Immediate Steps
1. Add shockwave click animation to image overlay buttons (view full, copy).
2. Add toast notification on clipboard copy.

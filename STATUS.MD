# Project Status

## Working Checkpoint (2026-05-20)
**Revert to commit `c26b5fe` if builds break.**

Last known good commit: `c26b5fe docs: update CONTEXT, STATUS, RULES, WORKFLOW to reflect current state`

### What's Working
- SvelteKit + Vite scaffold with Tailwind CSS v4
- SQLite backend (`better-sqlite3`) with `prompts` and `likes` tables
- Dashboard with search, drag-scroll type/tag filters, dynamic tag filtering by selected type
- Admin panel (`/admin`) with full CRUD
- 6 demo prompt cards seeded
- Card gradient border hover animation (purple→blue→cyan)
- Clipboard copy icon in prompt box (hover-appearing)
- Like cooldown (24h), view increment, fullscreen image view
- Rebrand: PromptVault → PromptDeck (Oswald condensed font)
- Uploads served from `static/uploads/`
- **Semantic CSS design system** — all visual styles in named classes (AI-friendly)
- Toast notification on clipboard copy
- Shockwave ripple on button clicks
- Dashboard background image (`pd_hero_bg.jpg`)
- Glassmorphism cards + filter bar

### Active Issues (Non-Blocking)
- Svelte accessibility warnings: modal divs with click handlers
- `npm run build` warning: `@import` rule ordering in CSS
- Git push shows exit code 1 but actually succeeds (`main -> main` in stderr)

### Completed Tasks
- SvelteKit + Vite scaffold
- Tailwind CSS v4 with dark theme
- SQLite backend (replaced MongoDB)
- Dashboard with search, filters, prompt grid
- Admin panel with CRUD
- Login button in navbar → `/admin`
- Rebrand PromptVault → PromptDeck
- Card gradient border hover animation
- 6 demo prompt cards seeded
- Clipboard copy icon in prompt box
- Fix uploads path (`public/` → `static/`)
- Drag-scroll filters (no scrollbar)
- Tags filtered by selected type
- Shockwave ripple on button clicks
- Toast notification on copy
- Dashboard background image
- Glassmorphism cards + filter bar
- Login button #a300ff + gradient hover
- Wider borderless search with purple caret
- Prompt box bg #0a070e36
- New hero bg `pd_hero_bg.jpg`
- Prompt-box transparent border + margins, toast higher contrast
- **Semantic CSS design system** (AI-friendly class names)

### Pending Tasks
- Production adapter: currently `@sveltejs/adapter-auto`

### Next Immediate Steps
- User-requested features

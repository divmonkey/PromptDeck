# Project Status

This document tracks the current status and immediate next steps for the project.

## Current State
- **Core Dependencies Installed:** `npm` packages and `Playwright` are installed.
- **UI/UX Skill Integrated:** The `ui-ux-pro-max-skill` has been successfully cloned into the `skill/` directory.
- **Initial Documentation Created:** `WORKFLOW.MD`, `RULES.MD`, and `CONTEXT.MD` have been generated.

## Immediate Next Steps (PromptDeck Architecture)
1.  **Restructure `public/` Directory:**
    *   Create `/public/images/`, `/public/css/`, `/public/js/`.
    *   Move `public/style.css` to `/public/css/style.css`.
    *   Move `public/app.js` to `/public/js/app.js`.
    *   Update `public/index.html` to reflect new asset paths.
2.  **Initialize Git Repository:**
    *   Initialize a new Git repository.
    *   Set the remote to `https://github.com/divmonkey/PromptDeck`.
    *   Perform initial commit of existing files.
3.  **Scaffold Svelte Project with Vite:**
    *   Use `npx create-svelte@latest` to create a new Svelte project within the root directory.
    *   Configure Vite for the project.
4.  **Integrate Tailwind CSS:**
    *   Install Tailwind CSS and its dependencies.
    *   Configure `tailwind.config.js` and `postcss.config.js`.
    *   Include Tailwind directives in the main CSS.
5.  **Configure Condensed Font:**
    *   Research and apply a suitable condensed font for numbers/accents using Tailwind CSS configuration.
6.  **Clean URLs:**
    *   Configure SvelteKit routing (handled by `create-svelte`) to enable clean URLs (no `.html` extension).
7.  **Backend Setup (SQLite, Local File System):**
    *   Begin planning for SQLite and local file system integration, likely within `server.js` or a new backend service.
    *   Consider how the existing `server.js` interacts with the new Svelte frontend.
8.  **Asset Strategy:**
    *   For images, consider using Unsplash.
    *   For icons, use Heroicons or `https://www.svgrepo.com/svg/`.

## Open Questions / Pending Decisions
- How should the `uploads/` directory be handled within the new frontend/backend architecture? Should it be served directly or via a backend route?
- Specific data models or API endpoints required for the dashboard.
- Detailed design preferences for the "good looking dashboard."

## Completed Tasks
- Installed `npm` dependencies.
- Installed `Playwright`.
- Created `/skill/` directory.
- Cloned `ui-ux-pro-max-skill` into `/skill/ui-ux-pro-max-skill`.
- Created `WORKFLOW.MD`.
- Created `RULES.MD`.
- Created `CONTEXT.MD`.
# Project Context

This document provides a high-level overview of the project's structure and purpose.

## Application Type
This is a Node.js application, likely serving web content and potentially APIs.

## Key Directories

### `/` (Root Directory)
- Contains core project configuration files (e.g., `package.json`, `server.js`).

### `server.js`
- The main entry point for the Node.js server application. It handles routing, logic, and serving static files.

### `public/`
- Contains static assets served directly to the client-side web browser.
  - `public/index.html`: The main HTML file for the web application.
  - `public/app.js`: Client-side JavaScript logic.
  - `public/style.css`: Client-side styling.
  - `public/uploads/`: Directory for user-uploaded content (e.g., images).

### `node_modules/`
- Contains installed Node.js packages (dependencies).

### `skill/`
- A newly added directory intended to house specialized skills or modules for the agent, such as the `ui-ux-pro-max-skill`.

## Dependencies
- `package.json`: Lists all project dependencies.
- `package-lock.json`: Records the exact versions of dependencies used.

## Purpose (Inferred)
Based on the file structure (server.js, public/), this project appears to be a web application, possibly involving user uploads and dynamic content served by a Node.js backend. The integration of the `ui-ux-pro-max-skill` suggests an intent to enhance the user interface or experience, potentially for a dashboard or administrative panel.
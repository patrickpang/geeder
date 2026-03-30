# Agent Instructions for geeder-web

This project is a web application built using the [Fresh framework](https://fresh.deno.dev/) and [Deno](https://deno.land/).

## Tech Stack

- **Runtime**: Deno
- **Framework**: Fresh (v2)
- **UI Library**: Preact
- **Styling**: TailwindCSS (v4)
- **Build Tool**: Vite
- **Language**: TypeScript

## Project Structure

- `routes/`: Contains the application's routes. Fresh uses file-system based routing.
- `islands/`: Contains interactive client-side components.
- `components/`: Contains reusable stateless components.
- `static/`: Static assets like images and icons.
- `assets/`: Global styles and other assets processed by Vite.

## Development Workflow

- **Start Development Environment**: Run both `deno task dev` and `cloudflared tunnel --url http://localhost:5173` concurrently. This is the mandatory setup for development and previewing.
  - Show the tunnel URL (e.g., `https://...trycloudflare.com`) in the `cloudflared` output.
- **Build for Production**: `deno task build`
- **Run Checks (Lint, Format, Type Check)**: `deno task check`
- **Update Dependencies**: `deno task update`

## Coding Standards & Conventions

- **Formatting**: Use `deno fmt`. Do not use external formatters like Prettier.
- **Linting**: Use `deno lint`. Adhere to the rules defined in `deno.json`.
- **Typing**: Ensure all new code is fully typed. Use `deno check` to verify.
- **Islands**: Only use islands for components that require client-side interactivity (state, event listeners, browser APIs).
- **Styling**: Use TailwindCSS utility classes. Avoid writing custom CSS unless absolutely necessary.

## Instructions for AI Agents

1.  **Context**: Always read `deno.json` to understand the available tasks and imports.
2.  **Validation**: After making changes, run `deno task check` to ensure code quality and type safety.
3.  **Fresh Conventions**: Follow Fresh-specific patterns, especially for routing and islands.
4.  **Deno First**: Prefer Deno's built-in tools and standard library over external NPM packages when possible.
5.  **Tailwind v4**: Be aware that this project uses Tailwind CSS v4, which has some differences from previous versions (e.g., use of CSS-first configuration).

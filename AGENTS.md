# Repository Guidelines

## Package Manager Preference
- This project prefers `pnpm` for all dependency management and scripts.

## Project Structure & Module Organization
- `src/` contains the React app entry (`main.jsx`), top-level UI (`App.jsx`), and styles (`index.css`, `App.css`).
- `src/assets/` holds rendering-related modules (for example `medusae.jsx`) and static assets.
- `public/` hosts static files served as-is (for example `public/vite.svg`).
- Production builds output to `dist/` (ignored by ESLint and git).

## Build, Test, and Development Commands
Use PNPM for all commands:
- `pnpm install` — install dependencies.
- `pnpm dev` — run the Vite dev server with hot reload.
- `pnpm build` — build the production bundle into `dist/`.
- `pnpm preview` — serve the production build locally.
- `pnpm lint` — run ESLint on `**/*.{js,jsx}`.

## Coding Style & Naming Conventions
- JavaScript/JSX uses ES modules and semicolons.
- Indentation is 2 spaces (match `src/*.jsx`).
- Component names are `PascalCase`; helper modules can be `camelCase`.
- Keep JSX props quoted (for example `background="#ffffff"`).
- Lint rules are defined in `eslint.config.js` (React Hooks + React Refresh).

## Testing Guidelines
- No automated test framework is configured yet.
- If adding tests, prefer colocating with source files and name them `*.test.jsx` or `*.spec.jsx`.
- Document any new test commands in `package.json`.

## Commit & Pull Request Guidelines
- Commit messages are short, descriptive, and sentence-case (for example “Small improvement tweaks”).
- Keep commits focused; avoid mixing styling changes with behavioral changes.
- PRs should include a summary, the commands you ran (for example `pnpm lint`), and screenshots or short clips for visual changes.

## Configuration Tips
- Vite handles dev/build workflows.
- Rendering is driven by Three.js + React Three Fiber; keep shader/scene logic under `src/assets/`.

## Findings
- The active Medusae renderer used by the app lives in `packages/medusae/src/Medusae.jsx` (imported in `src/App.jsx`), not `src/assets/`.
- Scene controls and defaults live in `src/data/settingsConfig.js` and are surfaced in `src/components/SettingsMenu.jsx`.

## Simplification Notes
- Settings UI is schema-driven via `src/data/settingsConfig.js` (`settingsSchema`).
- Shared defaults live in `packages/medusae/src/defaults.js` and are consumed by both app and renderer.

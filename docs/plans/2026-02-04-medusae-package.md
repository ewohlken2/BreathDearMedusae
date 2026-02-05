# Medusae Package Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Extract the Medusae scene into a publishable React component package with importable CSS and a clean `<Medusae />` API.

**Architecture:** Create a `packages/medusae` library that exports a single component and a CSS file. Keep the existing app as a preview environment. The component accepts a `config` object (merged with defaults) and renders the scene. No settings UI inside the package.

**Tech Stack:** React 19, Vite (library mode), @react-three/fiber, three.js.

### Task 1: Scaffold the package structure

**Files:**
- Create: `packages/medusae/src/Medusae.jsx`
- Create: `packages/medusae/src/index.js`
- Create: `packages/medusae/src/medusae.css`
- Create: `packages/medusae/package.json`
- Create: `packages/medusae/vite.config.js`

**Step 1: Create the package folders**

```bash
mkdir -p packages/medusae/src
```

**Step 2: Add `package.json` for the package**

```json
{
  "name": "@your-scope/medusae",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "dist/index.cjs",
  "module": "dist/index.js",
  "style": "dist/style.css",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./style.css": "./dist/style.css"
  },
  "peerDependencies": {
    "react": "^18 || ^19",
    "react-dom": "^18 || ^19",
    "three": "^0.180.0",
    "@react-three/fiber": "^9"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^5.1.1",
    "vite": "^7.2.4"
  },
  "scripts": {
    "build": "vite build"
  }
}
```

**Step 3: Add package Vite config**

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: "src/index.js",
      name: "Medusae",
      fileName: "index",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["react", "react-dom", "three", "@react-three/fiber"],
    },
  },
});
```

**Step 4: Add `src/index.js`**

```js
export { default as Medusae } from "./Medusae";
```

**Step 5: Create placeholder `src/medusae.css`**

```css
.medusae-root {
  width: 100%;
  height: 100%;
  position: relative;
}
```

**Step 6: Create component shell**

```jsx
import "./medusae.css";

const Medusae = () => {
  return <div className="medusae-root" />;
};

export default Medusae;
```

### Task 2: Move shader/scene logic into `Medusae`

**Files:**
- Modify: `packages/medusae/src/Medusae.jsx`
- Reference: `src/assets/medusae.jsx`

**Step 1: Copy the Particles implementation into the package**

Move the shader-based `Particles` component and the `Canvas` usage into `Medusae.jsx`.

**Step 2: Replace props with a `config` object**

Implement:

```js
const DEFAULTS = { cursor: {...}, halo: {...}, particles: {...} };
const merged = {
  cursor: { ...DEFAULTS.cursor, ...config?.cursor },
  halo: { ...DEFAULTS.halo, ...config?.halo },
  particles: { ...DEFAULTS.particles, ...config?.particles },
};
```

Use `merged` values to set all uniforms and animation inputs.

**Step 3: Export the component**

Ensure `Medusae` is the only export.

### Task 3: Keep preview app using the package

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/App.css`

**Step 1: Replace local Particles usage with package import**

```jsx
import { Medusae } from "../packages/medusae/src";
```

Use the existing settings UI to build a `config` object passed into `<Medusae />`.

**Step 2: Keep CSS import**

```jsx
import "../packages/medusae/src/medusae.css";
```

### Task 4: Build and verify

**Files:**
- None

**Step 1: Build package**

Run:
```bash
pnpm --filter @your-scope/medusae build
```

Expected: build succeeds.

**Step 2: Run preview app**

Run:
```bash
pnpm dev
```

Expected: app renders with settings controlling the Medusae component.

### Task 5: Commit

**Step 1: Commit changes**

```bash
git add packages/medusae src/App.jsx src/App.css

git commit -m "feat: add medusae component package"
```

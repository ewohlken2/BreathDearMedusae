# Outer Oscillation Jitter Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add outer oscillation jitter controls (strength + speed) that create a breathing slow-fast-slow cadence and can be disabled with strength `0`.

**Architecture:** Add two new settings in config/state/UI, pass them into the shader as uniforms, and modulate outer oscillation frequency/amplitude by a shaped low-frequency “breath” + noise term. Use `mix(1.0, mod, strength)` to guarantee no-op behavior at `0`.

**Tech Stack:** React, React Three Fiber, Three.js ShaderMaterial, Vite.

### Task 1: Add Failing Test For New Defaults

**Files:**
- Modify: `package.json`
- Create: `src/data/settingsConfig.test.js`

**Step 1: Write the failing test**

```js
import test from "node:test";
import assert from "node:assert/strict";
import SETTINGS_CONFIG from "./settingsConfig";

test("halo defaults include outer oscillation jitter controls", () => {
  const halo = SETTINGS_CONFIG.defaults.halo;
  assert.equal(typeof halo.outerOscJitterStrength, "number");
  assert.equal(typeof halo.outerOscJitterSpeed, "number");
});
```

**Step 2: Add test command**

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint .",
  "preview": "vite preview",
  "test": "node --test"
}
```

**Step 3: Run test to verify it fails**

Run: `pnpm test`
Expected: FAIL with assertion error because `outerOscJitterStrength` / `outerOscJitterSpeed` are undefined.

**Step 4: Commit**

```bash
git add package.json src/data/settingsConfig.test.js
git commit -m "Add failing jitter defaults test"
```

### Task 2: Add Defaults And Persisted State

**Files:**
- Modify: `src/data/settingsConfig.js`
- Modify: `src/App.jsx`

**Step 1: Write minimal implementation**

Add to `SETTINGS_CONFIG.defaults.halo`:

```js
outerOscJitterStrength: 0.25,
outerOscJitterSpeed: 0.6,
```

In `src/App.jsx`, add state, load/save/reset/export, dirty check, and props for:

```js
const [outerOscJitterStrength, setOuterOscJitterStrength] = useState(
  savedSettings.halo.outerOscJitterStrength,
);
const [outerOscJitterSpeed, setOuterOscJitterSpeed] = useState(
  savedSettings.halo.outerOscJitterSpeed,
);
```

Include in persistence and export blocks:

```js
outerOscJitterStrength,
outerOscJitterSpeed,
```

**Step 2: Run test to verify it passes**

Run: `pnpm test`
Expected: PASS

**Step 3: Commit**

```bash
git add src/data/settingsConfig.js src/App.jsx
git commit -m "Add outer oscillation jitter defaults"
```

### Task 3: Add Settings UI Controls

**Files:**
- Modify: `src/components/SettingsMenu.jsx`
- Modify: `src/App.jsx`

**Step 1: Write minimal implementation**

Add props and handlers in `SettingsMenu`:

```jsx
outerOscJitterStrength,
outerOscJitterSpeed,
onOuterOscJitterStrengthChange,
onOuterOscJitterSpeedChange,
```

Add inputs under “Halo”:

```jsx
<label className="settings-row">
  <span>Outer Osc Jitter Strength</span>
  <input
    type="number"
    step="0.01"
    value={outerOscJitterStrength}
    onChange={(event) => onOuterOscJitterStrengthChange(Number(event.target.value))}
  />
</label>
<label className="settings-row">
  <span>Outer Osc Jitter Speed</span>
  <input
    type="number"
    step="0.01"
    value={outerOscJitterSpeed}
    onChange={(event) => onOuterOscJitterSpeedChange(Number(event.target.value))}
  />
</label>
```

Wire props in `App.jsx` when rendering `SettingsMenu`.

**Step 2: Run test to verify it passes**

Run: `pnpm test`
Expected: PASS

**Step 3: Commit**

```bash
git add src/components/SettingsMenu.jsx src/App.jsx
git commit -m "Expose outer osc jitter controls"
```

### Task 4: Add Shader Uniforms And Breathing Modulation

**Files:**
- Modify: `src/assets/medusae.jsx`
- Modify: `src/App.jsx`

**Step 1: Write minimal implementation**

Add new props to `Particles`:

```js
outerOscJitterStrength = 0.25,
outerOscJitterSpeed = 0.6,
```

Add new uniforms:

```glsl
uniform float uOuterOscJitterStrength;
uniform float uOuterOscJitterSpeed;
```

Add uniforms to JS:

```js
uOuterOscJitterStrength: { value: outerOscJitterStrength },
uOuterOscJitterSpeed: { value: outerOscJitterSpeed },
```

Update effect syncing uniforms:

```js
material.uniforms.uOuterOscJitterStrength.value = outerOscJitterStrength;
material.uniforms.uOuterOscJitterSpeed.value = outerOscJitterSpeed;
```

Modify outer oscillation block to apply breathing modulation:

```glsl
float outerInfluence = smoothstep(baseRadius + outerStartOffset, baseRadius + outerEndOffset, dist);
float breath = sin(uTime * uOuterOscJitterSpeed);
float breath01 = breath * 0.5 + 0.5;
float breathShaped = smoothstep(0.0, 1.0, breath01);
float noiseTerm = (noise(vec2(uTime * 0.12, pos.x * 0.07)) - 0.5) * 0.2;
float mod = mix(1.0, 0.6 + breathShaped * 0.8 + noiseTerm, uOuterOscJitterStrength);
float outerOsc = sin(uTime * uOuterOscFrequency * mod + pos.x * 0.6 + pos.y * 0.6);
pos.xy += normalize(relToMouse + vec2(0.0001, 0.0)) * outerOsc * (uOuterOscAmplitude * mod) * outerInfluence;
```

Pass new props from `App.jsx` to `Particles`.

**Step 2: Run test to verify it passes**

Run: `pnpm test`
Expected: PASS

**Step 3: Commit**

```bash
git add src/assets/medusae.jsx src/App.jsx
git commit -m "Add outer osc jitter modulation"
```

### Task 5: Visual Verification

**Files:**
- None

**Step 1: Run dev server**

Run: `pnpm dev`

**Step 2: Manual check**

- Set “Outer Osc Jitter Strength” to `0` → behavior matches old motion.
- Increase strength to `0.5` and speed to `0.6` → slow-fast-slow breathing observed.

**Step 3: Commit (if no code changes)**

No commit needed.

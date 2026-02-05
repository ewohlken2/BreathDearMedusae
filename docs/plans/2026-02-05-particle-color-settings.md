# Particle Color Settings Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add four configurable particle colors (base/blue/red/yellow) to the settings UI with popover color pickers and wire them into the Medusae shader.

**Architecture:** Store color defaults as hex strings in `packages/medusae/src/defaults.js`, merge them through settings, and convert to `THREE.Color` uniforms in `packages/medusae/src/Medusae.jsx`. Extend the schema to include `type: "color"` fields and render them in `SettingsMenu.jsx` with `react-popover` + `ChromePicker`.

**Tech Stack:** React, Vite, Three.js, React Three Fiber, `react-color`, `react-popover`, Node test runner.

### Task 1: Add particle color defaults

**Files:**
- Modify: `packages/medusae/src/defaults.test.js`
- Modify: `packages/medusae/src/defaults.js`

**Step 1: Write the failing test**

Update `packages/medusae/src/defaults.test.js` to assert color defaults exist and are strings:

```js
const particles = MEDUSAE_DEFAULTS.particles;
assert.equal(typeof particles.colorBase, "string");
assert.equal(typeof particles.colorBlue, "string");
assert.equal(typeof particles.colorRed, "string");
assert.equal(typeof particles.colorYellow, "string");
```

**Step 2: Run test to verify it fails**

Run: `pnpm test`
Expected: FAIL because color defaults are missing.

**Step 3: Write minimal implementation**

Add these defaults in `packages/medusae/src/defaults.js` under `particles` (hex approximations of the current shader colors):

```js
colorBase: "#141419",
colorBlue: "#4285f5",
colorRed: "#eb4236",
colorYellow: "#faba03",
```

**Step 4: Run test to verify it passes**

Run: `pnpm test`
Expected: PASS.

**Step 5: Commit**

```bash
git add packages/medusae/src/defaults.js packages/medusae/src/defaults.test.js
git commit -m "Add particle color defaults"
```

### Task 2: Add settings schema fields for colors

**Files:**
- Modify: `src/data/settingsConfig.test.js`
- Modify: `src/data/settingsConfig.js`

**Step 1: Write the failing test**

Add a test to `src/data/settingsConfig.test.js` that checks color defaults and schema fields:

```js
const particles = SETTINGS_CONFIG.defaults.particles;
assert.equal(typeof particles.colorBase, "string");
assert.equal(typeof particles.colorBlue, "string");
assert.equal(typeof particles.colorRed, "string");
assert.equal(typeof particles.colorYellow, "string");

const particlesSection = SETTINGS_CONFIG.settingsSchema.find((s) => s.id === "particles");
const colorFields = particlesSection.fields.filter((field) => field.type === "color");
assert.equal(colorFields.length, 4);
```

**Step 2: Run test to verify it fails**

Run: `pnpm test`
Expected: FAIL because schema doesn’t include color fields.

**Step 3: Write minimal implementation**

Update `src/data/settingsConfig.js` to add four `type: "color"` fields inside the `Particles` section:

```js
{ path: "particles.colorBase", label: "Base Color", type: "color" },
{ path: "particles.colorBlue", label: "Blue", type: "color" },
{ path: "particles.colorRed", label: "Red", type: "color" },
{ path: "particles.colorYellow", label: "Yellow", type: "color" },
```

**Step 4: Run test to verify it passes**

Run: `pnpm test`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/data/settingsConfig.js src/data/settingsConfig.test.js
git commit -m "Add particle color fields to settings schema"
```

### Task 3: Support color strings in settings model

**Files:**
- Modify: `src/data/settingsModel.test.js`
- Modify: `src/data/settingsModel.js`

**Step 1: Write the failing test**

Extend `src/data/settingsModel.test.js`:

```js
const merged = mergeSettingsWithDefaults({ particles: { colorBase: "#ffffff" } });
assert.equal(merged.particles.colorBase, "#ffffff");

const text = exportSettingsText({
  ...SETTINGS_CONFIG.defaults,
  particles: { ...SETTINGS_CONFIG.defaults.particles, colorBase: "#ffffff" },
});
assert.ok(text.includes('colorBase: "#ffffff"'));
```

**Step 2: Run test to verify it fails**

Run: `pnpm test`
Expected: FAIL because string overrides are ignored and export is unquoted.

**Step 3: Write minimal implementation**

Update `src/data/settingsModel.js`:
- In `deepMerge`, allow string overrides in addition to numbers.
- In `exportSettingsText`, wrap string values in quotes.

**Step 4: Run test to verify it passes**

Run: `pnpm test`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/data/settingsModel.js src/data/settingsModel.test.js
git commit -m "Support color strings in settings model"
```

### Task 4: Wire colors into Medusae shader and types

**Files:**
- Modify: `packages/medusae/src/Medusae.jsx`
- Modify: `packages/medusae/src/index.d.ts`

**Step 1: Update type definitions**

Add optional string fields to `MedusaeConfig.particles` in `packages/medusae/src/index.d.ts`:

```ts
colorBase?: string;
colorBlue?: string;
colorRed?: string;
colorYellow?: string;
```

**Step 2: Update uniforms and shader**

In `packages/medusae/src/Medusae.jsx`:
- Add uniforms with `new THREE.Color(MEDUSAE_DEFAULTS.particles.colorBase)` etc.
- Add `uniform vec3 uParticleColorBase`, `uParticleColorBlue`, `uParticleColorRed`, `uParticleColorYellow` to the fragment shader.
- Replace `black`, `cBlue`, `cRed`, `cYellow` with the uniforms.
- In the `useEffect`, call `material.uniforms.uParticleColorBase.value.set(merged.particles.colorBase)` and similarly for the others.

**Step 3: Manual smoke check**

Run: `pnpm dev` and verify the scene renders with the same colors as before.

**Step 4: Commit**

```bash
git add packages/medusae/src/Medusae.jsx packages/medusae/src/index.d.ts
git commit -m "Use configurable particle colors in shader"
```

### Task 5: Add color pickers in Settings UI

**Files:**
- Modify: `package.json`
- Modify: `src/components/SettingsMenu.jsx`
- Modify: `src/App.css`

**Step 1: Add dependencies**

Run: `pnpm add react-color react-popover`
Expected: `package.json` and lockfile updated.

**Step 2: Implement color field rendering**

Update `src/components/SettingsMenu.jsx`:
- Import `ChromePicker` from `react-color` and `Popover` from `react-popover`.
- For fields with `field.type === "color"`, render a row with a label and a swatch button.
- Wrap the swatch button in a `Popover` with `isOpen` state per field (e.g. store `openField` in state).
- Use `onOuterAction` to close the popover and pass a `body` containing `ChromePicker`.
- On picker change, call `onChange(field.path, color.hex)`.

**Step 3: Add styling**

Update `src/App.css` with styles for:
- `.settings-color-swatch` (size, border, cursor)
- `.settings-color-popover` (background, padding, shadow)
- Optional `.settings-color-row` tweaks (alignment)

**Step 4: Manual UI check**

Run: `pnpm dev`, open Settings → Particles, click each swatch and confirm the `ChromePicker` opens in a popover and updates colors in the scene.

**Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml src/components/SettingsMenu.jsx src/App.css
git commit -m "Add popover color pickers for particle colors"
```

### Task 6: Final verification

**Step 1: Run full test suite**

Run: `pnpm test`
Expected: PASS.

**Step 2: Run lint**

Run: `pnpm lint`
Expected: PASS.

**Step 3: Commit if needed**

If any fixes were required, commit them with a focused message.

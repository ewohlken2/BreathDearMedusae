# Outer Oscillation Jitter (Breathing Modulation) - Design

## Overview
Add two new halo settings that modulate the outer oscillation so it breathes slow-fast-slow in an organic way. The modulation must be fully disable-able: when `outerOscJitterStrength` is `0`, the behavior must match the current implementation (no modulation).

## User Goals
- Make outer oscillations feel more organic (less linear).
- Provide explicit controls for jitter strength and speed.
- Preserve exact legacy behavior when jitter strength is `0`.

## Proposed Behavior
- Compute a low-frequency breath LFO in the vertex shader.
- Map it to `[0..1]`, shape it with `smoothstep` for easing into peaks/troughs.
- Combine it with a small noise term to avoid perfect periodicity.
- Use the resulting `mod` to scale both `uOuterOscFrequency` and `uOuterOscAmplitude`.

### Modulation Formula (Conceptual)
```
breath = sin(uTime * uOuterOscJitterSpeed)
breath01 = breath * 0.5 + 0.5
breathShaped = smoothstep(0.0, 1.0, breath01)
noiseTerm = (noise(vec2(uTime * 0.12, 0.0)) - 0.5) * 0.2
mod = mix(1.0, 0.6 + breathShaped * 0.8 + noiseTerm, uOuterOscJitterStrength)
```

- If `uOuterOscJitterStrength == 0`, `mod` becomes `1.0`, preserving existing behavior.
- Otherwise, frequency and amplitude scale by `mod`.

## Data Flow and Settings
- Add defaults under `SETTINGS_CONFIG.defaults.halo`:
  - `outerOscJitterStrength: 0.25`
  - `outerOscJitterSpeed: 0.6`
- Add state to `App.jsx` and persist via session storage.
- Add inputs in `SettingsMenu` under “Halo.”
- Pass values to `Particles` and update shader uniforms.

## UI
- New inputs (number fields) under “Halo”:
  - `Outer Osc Jitter Strength`
  - `Outer Osc Jitter Speed`

## Error Handling
- If stored values are not numbers, fall back to defaults.

## Testing
- Visual: set jitter strength to `0` and confirm behavior is identical to current.
- Visual: increase jitter strength and observe slow-fast-slow breathing in outer oscillations.

## Files to Change
- `src/data/settingsConfig.js`
- `src/App.jsx`
- `src/components/SettingsMenu.jsx`
- `src/assets/medusae.jsx`

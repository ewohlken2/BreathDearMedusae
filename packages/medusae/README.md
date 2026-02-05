# @vibe-rational/medusae

An organic, breathing medusa particle engine built with React Three Fiber.

## Demo

```text
https://breath-dear-medusae.vercel.app/
```

## Install

```bash
pnpm add @vibe-rational/medusae
```

## Usage

```jsx
import { Medusae } from "@vibe-rational/medusae";
import "@vibe-rational/medusae/style.css";

export default function Hero() {
  return <Medusae />;
}
```

## Props

`Medusae` accepts a `config` object for tuning cursor, halo, and particle behavior. See `src/index.d.ts` in the package for the full shape.

```jsx
<Medusae
  config={{
    cursor: { radius: 2.5, strength: 0.8 },
    particles: { colorOne: "#ff7ad9", colorTwo: "#7af0ff" },
  }}
/>
```

## Peer Dependencies

- `react` (18 or 19)
- `react-dom` (18 or 19)
- `three` (0.180+)
- `@react-three/fiber` (9+)

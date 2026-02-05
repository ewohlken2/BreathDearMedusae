import { useEffect, useState } from "react";
import "./App.css";
import SETTINGS_CONFIG from "./data/settingsConfig";
import SettingsMenu from "./components/SettingsMenu";
import { Medusae } from "../packages/medusae/src";
import "../packages/medusae/src/medusae.css";

function App() {
  const [savedSettings, setSavedSettings] = useState(() => {
    const stored = sessionStorage.getItem(SETTINGS_CONFIG.storageKey);
    if (!stored) {
      return {
        cursor: SETTINGS_CONFIG.defaults.cursor,
        halo: SETTINGS_CONFIG.defaults.halo,
        particles: SETTINGS_CONFIG.defaults.particles,
      };
    }
    try {
      const parsed = JSON.parse(stored);
      const storedCursor = parsed.cursor ?? parsed;
      const storedHalo = parsed.halo ?? parsed;
      const storedParticles = parsed.particles ?? parsed;
      return {
        cursor: {
          radius:
            typeof storedCursor.radius === "number"
              ? storedCursor.radius
              : SETTINGS_CONFIG.defaults.cursor.radius,
          strength:
            typeof storedCursor.strength === "number"
              ? storedCursor.strength
              : SETTINGS_CONFIG.defaults.cursor.strength,
          dragFactor:
            typeof storedCursor.dragFactor === "number"
              ? storedCursor.dragFactor
              : SETTINGS_CONFIG.defaults.cursor.dragFactor,
        },
        halo: {
          outerOscFrequency:
            typeof storedHalo.outerOscFrequency === "number"
              ? storedHalo.outerOscFrequency
              : SETTINGS_CONFIG.defaults.halo.outerOscFrequency,
          outerOscAmplitude:
            typeof storedHalo.outerOscAmplitude === "number"
              ? storedHalo.outerOscAmplitude
              : SETTINGS_CONFIG.defaults.halo.outerOscAmplitude,
          outerOscJitterStrength:
            typeof storedHalo.outerOscJitterStrength === "number"
              ? storedHalo.outerOscJitterStrength
              : SETTINGS_CONFIG.defaults.halo.outerOscJitterStrength,
          outerOscJitterSpeed:
            typeof storedHalo.outerOscJitterSpeed === "number"
              ? storedHalo.outerOscJitterSpeed
              : SETTINGS_CONFIG.defaults.halo.outerOscJitterSpeed,
          radiusBase:
            typeof storedHalo.radiusBase === "number"
              ? storedHalo.radiusBase
              : SETTINGS_CONFIG.defaults.halo.radiusBase,
          radiusAmplitude:
            typeof storedHalo.radiusAmplitude === "number"
              ? storedHalo.radiusAmplitude
              : SETTINGS_CONFIG.defaults.halo.radiusAmplitude,
          shapeAmplitude:
            typeof storedHalo.shapeAmplitude === "number"
              ? storedHalo.shapeAmplitude
              : SETTINGS_CONFIG.defaults.halo.shapeAmplitude,
          rimWidth:
            typeof storedHalo.rimWidth === "number"
              ? storedHalo.rimWidth
              : SETTINGS_CONFIG.defaults.halo.rimWidth,
          outerStartOffset:
            typeof storedHalo.outerStartOffset === "number"
              ? storedHalo.outerStartOffset
              : SETTINGS_CONFIG.defaults.halo.outerStartOffset,
          outerEndOffset:
            typeof storedHalo.outerEndOffset === "number"
              ? storedHalo.outerEndOffset
              : SETTINGS_CONFIG.defaults.halo.outerEndOffset,
        },
        particles: {
          baseSize:
            typeof storedParticles.baseSize === "number"
              ? storedParticles.baseSize
              : SETTINGS_CONFIG.defaults.particles.baseSize,
          activeSize:
            typeof storedParticles.activeSize === "number"
              ? storedParticles.activeSize
              : SETTINGS_CONFIG.defaults.particles.activeSize,
          blobScaleX:
            typeof storedParticles.blobScaleX === "number"
              ? storedParticles.blobScaleX
              : SETTINGS_CONFIG.defaults.particles.blobScaleX,
          blobScaleY:
            typeof storedParticles.blobScaleY === "number"
              ? storedParticles.blobScaleY
              : SETTINGS_CONFIG.defaults.particles.blobScaleY,
          rotationSpeed:
            typeof storedParticles.rotationSpeed === "number"
              ? storedParticles.rotationSpeed
              : SETTINGS_CONFIG.defaults.particles.rotationSpeed,
          rotationJitter:
            typeof storedParticles.rotationJitter === "number"
              ? storedParticles.rotationJitter
              : SETTINGS_CONFIG.defaults.particles.rotationJitter,
          cursorFollowStrength:
            typeof storedParticles.cursorFollowStrength === "number"
              ? storedParticles.cursorFollowStrength
              : SETTINGS_CONFIG.defaults.particles.cursorFollowStrength,
          oscillationFactor:
            typeof storedParticles.oscillationFactor === "number"
              ? storedParticles.oscillationFactor
              : SETTINGS_CONFIG.defaults.particles.oscillationFactor,
        },
      };
    } catch {
      return {
        cursor: SETTINGS_CONFIG.defaults.cursor,
        halo: SETTINGS_CONFIG.defaults.halo,
        particles: SETTINGS_CONFIG.defaults.particles,
      };
    }
  });
  const [cursorJitterRadius, setCursorJitterRadius] = useState(
    savedSettings.cursor.radius,
  );
  const [cursorJitterStrength, setCursorJitterStrength] = useState(
    savedSettings.cursor.strength,
  );
  const [cursorDragFactor, setCursorDragFactor] = useState(
    savedSettings.cursor.dragFactor,
  );
  const [outerOscFrequency, setOuterOscFrequency] = useState(
    savedSettings.halo.outerOscFrequency,
  );
  const [outerOscAmplitude, setOuterOscAmplitude] = useState(
    savedSettings.halo.outerOscAmplitude,
  );
  const [outerOscJitterStrength, setOuterOscJitterStrength] = useState(
    savedSettings.halo.outerOscJitterStrength,
  );
  const [outerOscJitterSpeed, setOuterOscJitterSpeed] = useState(
    savedSettings.halo.outerOscJitterSpeed,
  );
  const [haloRadiusBase, setHaloRadiusBase] = useState(
    savedSettings.halo.radiusBase,
  );
  const [haloRadiusAmplitude, setHaloRadiusAmplitude] = useState(
    savedSettings.halo.radiusAmplitude,
  );
  const [haloShapeAmplitude, setHaloShapeAmplitude] = useState(
    savedSettings.halo.shapeAmplitude,
  );
  const [haloRimWidth, setHaloRimWidth] = useState(savedSettings.halo.rimWidth);
  const [haloOuterStartOffset, setHaloOuterStartOffset] = useState(
    savedSettings.halo.outerStartOffset,
  );
  const [haloOuterEndOffset, setHaloOuterEndOffset] = useState(
    savedSettings.halo.outerEndOffset,
  );
  const [particleBaseSize, setParticleBaseSize] = useState(
    savedSettings.particles.baseSize,
  );
  const [particleActiveSize, setParticleActiveSize] = useState(
    savedSettings.particles.activeSize,
  );
  const [blobScaleX, setBlobScaleX] = useState(
    savedSettings.particles.blobScaleX,
  );
  const [blobScaleY, setBlobScaleY] = useState(
    savedSettings.particles.blobScaleY,
  );
  const [particleRotationSpeed, setParticleRotationSpeed] = useState(
    savedSettings.particles.rotationSpeed,
  );
  const [particleRotationJitter, setParticleRotationJitter] = useState(
    savedSettings.particles.rotationJitter,
  );
  const [particleCursorFollowStrength, setParticleCursorFollowStrength] = useState(
    savedSettings.particles.cursorFollowStrength,
  );
  const [particleOscillationFactor, setParticleOscillationFactor] = useState(
    savedSettings.particles.oscillationFactor,
  );
  const [exportNotice, setExportNotice] = useState(false);

  const handleSave = () => {
    sessionStorage.setItem(
      SETTINGS_CONFIG.storageKey,
      JSON.stringify({
        cursor: {
          radius: cursorJitterRadius,
          strength: cursorJitterStrength,
          dragFactor: cursorDragFactor,
        },
        halo: {
          outerOscFrequency,
          outerOscAmplitude,
          outerOscJitterStrength,
          outerOscJitterSpeed,
          radiusBase: haloRadiusBase,
          radiusAmplitude: haloRadiusAmplitude,
          shapeAmplitude: haloShapeAmplitude,
          rimWidth: haloRimWidth,
          outerStartOffset: haloOuterStartOffset,
          outerEndOffset: haloOuterEndOffset,
        },
        particles: {
          baseSize: particleBaseSize,
          activeSize: particleActiveSize,
          blobScaleX,
          blobScaleY,
          rotationSpeed: particleRotationSpeed,
          rotationJitter: particleRotationJitter,
          cursorFollowStrength: particleCursorFollowStrength,
          oscillationFactor: particleOscillationFactor,
        },
      }),
    );
    setSavedSettings({
      cursor: {
        radius: cursorJitterRadius,
        strength: cursorJitterStrength,
        dragFactor: cursorDragFactor,
      },
      halo: {
        outerOscFrequency,
        outerOscAmplitude,
        outerOscJitterStrength,
        outerOscJitterSpeed,
        radiusBase: haloRadiusBase,
        radiusAmplitude: haloRadiusAmplitude,
        shapeAmplitude: haloShapeAmplitude,
        rimWidth: haloRimWidth,
        outerStartOffset: haloOuterStartOffset,
        outerEndOffset: haloOuterEndOffset,
      },
      particles: {
        baseSize: particleBaseSize,
        activeSize: particleActiveSize,
        blobScaleX,
        blobScaleY,
        rotationSpeed: particleRotationSpeed,
        rotationJitter: particleRotationJitter,
        cursorFollowStrength: particleCursorFollowStrength,
        oscillationFactor: particleOscillationFactor,
      },
    });
  };

  const handleReset = () => {
    setCursorJitterRadius(SETTINGS_CONFIG.defaults.cursor.radius);
    setCursorJitterStrength(SETTINGS_CONFIG.defaults.cursor.strength);
    setCursorDragFactor(SETTINGS_CONFIG.defaults.cursor.dragFactor);
    setOuterOscFrequency(SETTINGS_CONFIG.defaults.halo.outerOscFrequency);
    setOuterOscAmplitude(SETTINGS_CONFIG.defaults.halo.outerOscAmplitude);
    setOuterOscJitterStrength(
      SETTINGS_CONFIG.defaults.halo.outerOscJitterStrength,
    );
    setOuterOscJitterSpeed(SETTINGS_CONFIG.defaults.halo.outerOscJitterSpeed);
    setHaloRadiusBase(SETTINGS_CONFIG.defaults.halo.radiusBase);
    setHaloRadiusAmplitude(SETTINGS_CONFIG.defaults.halo.radiusAmplitude);
    setHaloShapeAmplitude(SETTINGS_CONFIG.defaults.halo.shapeAmplitude);
    setHaloRimWidth(SETTINGS_CONFIG.defaults.halo.rimWidth);
    setHaloOuterStartOffset(SETTINGS_CONFIG.defaults.halo.outerStartOffset);
    setHaloOuterEndOffset(SETTINGS_CONFIG.defaults.halo.outerEndOffset);
    setParticleBaseSize(SETTINGS_CONFIG.defaults.particles.baseSize);
    setParticleActiveSize(SETTINGS_CONFIG.defaults.particles.activeSize);
    setBlobScaleX(SETTINGS_CONFIG.defaults.particles.blobScaleX);
    setBlobScaleY(SETTINGS_CONFIG.defaults.particles.blobScaleY);
    setParticleRotationSpeed(SETTINGS_CONFIG.defaults.particles.rotationSpeed);
    setParticleRotationJitter(SETTINGS_CONFIG.defaults.particles.rotationJitter);
    setParticleCursorFollowStrength(
      SETTINGS_CONFIG.defaults.particles.cursorFollowStrength,
    );
    setParticleOscillationFactor(
      SETTINGS_CONFIG.defaults.particles.oscillationFactor,
    );
  };

  const handleExport = async () => {
    const payload = {
      cursor: {
        ...SETTINGS_CONFIG.defaults.cursor,
        radius: cursorJitterRadius,
        strength: cursorJitterStrength,
        dragFactor: cursorDragFactor,
      },
      halo: {
        ...SETTINGS_CONFIG.defaults.halo,
        outerOscFrequency,
        outerOscAmplitude,
        outerOscJitterStrength,
        outerOscJitterSpeed,
        radiusBase: haloRadiusBase,
        radiusAmplitude: haloRadiusAmplitude,
        shapeAmplitude: haloShapeAmplitude,
        rimWidth: haloRimWidth,
        outerStartOffset: haloOuterStartOffset,
        outerEndOffset: haloOuterEndOffset,
      },
      particles: {
        ...SETTINGS_CONFIG.defaults.particles,
        baseSize: particleBaseSize,
        activeSize: particleActiveSize,
        blobScaleX,
        blobScaleY,
        rotationSpeed: particleRotationSpeed,
        rotationJitter: particleRotationJitter,
        cursorFollowStrength: particleCursorFollowStrength,
        oscillationFactor: particleOscillationFactor,
      },
    };

    const text = `{
  cursor: {
    radius: ${payload.cursor.radius},
    strength: ${payload.cursor.strength},
    dragFactor: ${payload.cursor.dragFactor},
  },
  halo: {
    outerOscFrequency: ${payload.halo.outerOscFrequency},
    outerOscAmplitude: ${payload.halo.outerOscAmplitude},
    outerOscJitterStrength: ${payload.halo.outerOscJitterStrength},
    outerOscJitterSpeed: ${payload.halo.outerOscJitterSpeed},
    radiusBase: ${payload.halo.radiusBase},
    radiusAmplitude: ${payload.halo.radiusAmplitude},
    shapeAmplitude: ${payload.halo.shapeAmplitude},
    rimWidth: ${payload.halo.rimWidth},
    outerStartOffset: ${payload.halo.outerStartOffset},
    outerEndOffset: ${payload.halo.outerEndOffset},
  },
  particles: {
    baseSize: ${payload.particles.baseSize},
    activeSize: ${payload.particles.activeSize},
    blobScaleX: ${payload.particles.blobScaleX},
    blobScaleY: ${payload.particles.blobScaleY},
    rotationSpeed: ${payload.particles.rotationSpeed},
    rotationJitter: ${payload.particles.rotationJitter},
    cursorFollowStrength: ${payload.particles.cursorFollowStrength},
    oscillationFactor: ${payload.particles.oscillationFactor},
  },
}`;

    await navigator.clipboard.writeText(text);
    setExportNotice(true);
  };

  useEffect(() => {
    if (!exportNotice) return undefined;
    const timeout = window.setTimeout(() => setExportNotice(false), 1800);
    return () => window.clearTimeout(timeout);
  }, [exportNotice]);

  const hasDirtyChanges =
    cursorJitterRadius !== savedSettings.cursor.radius ||
    cursorJitterStrength !== savedSettings.cursor.strength ||
    cursorDragFactor !== savedSettings.cursor.dragFactor ||
    outerOscFrequency !== savedSettings.halo.outerOscFrequency ||
    outerOscAmplitude !== savedSettings.halo.outerOscAmplitude ||
    outerOscJitterStrength !== savedSettings.halo.outerOscJitterStrength ||
    outerOscJitterSpeed !== savedSettings.halo.outerOscJitterSpeed ||
    haloRadiusBase !== savedSettings.halo.radiusBase ||
    haloRadiusAmplitude !== savedSettings.halo.radiusAmplitude ||
    haloShapeAmplitude !== savedSettings.halo.shapeAmplitude ||
    haloRimWidth !== savedSettings.halo.rimWidth ||
    haloOuterStartOffset !== savedSettings.halo.outerStartOffset ||
    haloOuterEndOffset !== savedSettings.halo.outerEndOffset ||
    particleBaseSize !== savedSettings.particles.baseSize ||
    particleActiveSize !== savedSettings.particles.activeSize ||
    blobScaleX !== savedSettings.particles.blobScaleX ||
    blobScaleY !== savedSettings.particles.blobScaleY ||
    particleRotationSpeed !== savedSettings.particles.rotationSpeed ||
    particleRotationJitter !== savedSettings.particles.rotationJitter ||
    particleCursorFollowStrength !== savedSettings.particles.cursorFollowStrength ||
    particleOscillationFactor !== savedSettings.particles.oscillationFactor;

  return (
    <div className="app">
      <SettingsMenu
        radius={cursorJitterRadius}
        strength={cursorJitterStrength}
        dragFactor={cursorDragFactor}
        outerOscFrequency={outerOscFrequency}
        outerOscAmplitude={outerOscAmplitude}
        outerOscJitterStrength={outerOscJitterStrength}
        outerOscJitterSpeed={outerOscJitterSpeed}
        haloRadiusBase={haloRadiusBase}
        haloRadiusAmplitude={haloRadiusAmplitude}
        haloShapeAmplitude={haloShapeAmplitude}
        haloRimWidth={haloRimWidth}
        haloOuterStartOffset={haloOuterStartOffset}
        haloOuterEndOffset={haloOuterEndOffset}
        particleBaseSize={particleBaseSize}
        particleActiveSize={particleActiveSize}
        blobScaleX={blobScaleX}
        blobScaleY={blobScaleY}
        particleRotationSpeed={particleRotationSpeed}
        particleRotationJitter={particleRotationJitter}
        particleCursorFollowStrength={particleCursorFollowStrength}
        particleOscillationFactor={particleOscillationFactor}
        onRadiusChange={setCursorJitterRadius}
        onStrengthChange={setCursorJitterStrength}
        onDragFactorChange={setCursorDragFactor}
        onOuterOscFrequencyChange={setOuterOscFrequency}
        onOuterOscAmplitudeChange={setOuterOscAmplitude}
        onOuterOscJitterStrengthChange={setOuterOscJitterStrength}
        onOuterOscJitterSpeedChange={setOuterOscJitterSpeed}
        onHaloRadiusBaseChange={setHaloRadiusBase}
        onHaloRadiusAmplitudeChange={setHaloRadiusAmplitude}
        onHaloShapeAmplitudeChange={setHaloShapeAmplitude}
        onHaloRimWidthChange={setHaloRimWidth}
        onHaloOuterStartOffsetChange={setHaloOuterStartOffset}
        onHaloOuterEndOffsetChange={setHaloOuterEndOffset}
        onParticleBaseSizeChange={setParticleBaseSize}
        onParticleActiveSizeChange={setParticleActiveSize}
        onBlobScaleXChange={setBlobScaleX}
        onBlobScaleYChange={setBlobScaleY}
        onParticleRotationSpeedChange={setParticleRotationSpeed}
        onParticleRotationJitterChange={setParticleRotationJitter}
        onParticleCursorFollowStrengthChange={setParticleCursorFollowStrength}
        onParticleOscillationFactorChange={setParticleOscillationFactor}
        onSave={handleSave}
        onReset={handleReset}
        onExport={handleExport}
        hasDirtyChanges={hasDirtyChanges}
      />
      {exportNotice && <div className="copy-notice">Copied to clipboard</div>}
      <Medusae
        config={{
          cursor: {
            radius: cursorJitterRadius,
            strength: cursorJitterStrength,
            dragFactor: cursorDragFactor,
          },
          halo: {
            outerOscFrequency,
            outerOscAmplitude,
            outerOscJitterStrength,
            outerOscJitterSpeed,
            radiusBase: haloRadiusBase,
            radiusAmplitude: haloRadiusAmplitude,
            shapeAmplitude: haloShapeAmplitude,
            rimWidth: haloRimWidth,
            outerStartOffset: haloOuterStartOffset,
            outerEndOffset: haloOuterEndOffset,
          },
          particles: {
            baseSize: particleBaseSize,
            activeSize: particleActiveSize,
            blobScaleX,
            blobScaleY,
            rotationSpeed: particleRotationSpeed,
            rotationJitter: particleRotationJitter,
            cursorFollowStrength: particleCursorFollowStrength,
            oscillationFactor: particleOscillationFactor,
          },
        }}
      />
    </div>
  );
}

export default App;

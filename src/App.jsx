import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Particles from './assets/medusae';
import './App.css';

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [savedSettings, setSavedSettings] = useState(() => {
    const stored = sessionStorage.getItem("cursorJitterSettings");
    if (!stored) return { radius: 0.03, strength: 1 };
    try {
      const parsed = JSON.parse(stored);
      return {
        radius: typeof parsed.radius === "number" ? parsed.radius : 0.03,
        strength: typeof parsed.strength === "number" ? parsed.strength : 1,
      };
    } catch {
      return { radius: 0.03, strength: 1 };
    }
  });
  const [cursorJitterRadius, setCursorJitterRadius] = useState(savedSettings.radius);
  const [cursorJitterStrength, setCursorJitterStrength] = useState(savedSettings.strength);

  const handleSave = () => {
    sessionStorage.setItem(
      "cursorJitterSettings",
      JSON.stringify({ radius: cursorJitterRadius, strength: cursorJitterStrength })
    );
    setSavedSettings({ radius: cursorJitterRadius, strength: cursorJitterStrength });
  };

  const hasDirtyChanges =
    cursorJitterRadius !== savedSettings.radius ||
    cursorJitterStrength !== savedSettings.strength;

  return (
    <div className="app">
      <button
        className="menu-button"
        type="button"
        onClick={() => setShowSettings((prev) => !prev)}
      >
        Settings
      </button>
      {showSettings && (
        <div className="settings-dialog" role="dialog" aria-label="Scene settings">
          <div className="settings-title">Scene Settings</div>
          <label className="settings-row">
            <span>Cursor Hover Radius</span>
            <input
              type="range"
              min="0"
              max="0.1"
              step="0.005"
              value={cursorJitterRadius}
              onChange={(event) => setCursorJitterRadius(parseFloat(event.target.value))}
            />
            <span className="settings-value">{cursorJitterRadius.toFixed(3)}</span>
          </label>
          <label className="settings-row">
            <span>Cursor Hover Strength</span>
            <input
              type="range"
              min="0"
              max="2"
              step="0.05"
              value={cursorJitterStrength}
              onChange={(event) => setCursorJitterStrength(parseFloat(event.target.value))}
            />
            <span className="settings-value">{cursorJitterStrength.toFixed(2)}</span>
          </label>
          <button
            className={`settings-save ${hasDirtyChanges ? "is-dirty" : "is-saved"}`}
            type="button"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      )}
      <Canvas camera={{ position: [0, 0, 5] }}>
        <color attach="background" args={["#ffffff"]} />
        <Particles
          cursorJitterRadius={cursorJitterRadius}
          cursorJitterStrength={cursorJitterStrength}
        />
      </Canvas>
    </div>
  );
}

export default App;

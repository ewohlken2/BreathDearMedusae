import { useEffect, useState } from "react";
import "./App.css";
import SETTINGS_CONFIG from "./data/settingsConfig";
import SettingsMenu from "./components/SettingsMenu";
import { Medusae } from "../packages/medusae/src";
import "../packages/medusae/src/medusae.css";
import {
  exportSettingsText,
  loadSettings,
  mergeSettingsWithDefaults,
  saveSettings,
} from "./data/settingsModel.js";

const setByPath = (source, path, value) => {
  const parts = path.split(".");
  const next = { ...source };
  let cursor = next;
  for (let index = 0; index < parts.length - 1; index += 1) {
    const key = parts[index];
    cursor[key] = { ...cursor[key] };
    cursor = cursor[key];
  }
  cursor[parts[parts.length - 1]] = value;
  return next;
};

const areSettingsEqual = (a, b) => {
  if (a === b) return true;
  if (!a || !b || typeof a !== "object" || typeof b !== "object") return false;
  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;
  return keys.every((key) => areSettingsEqual(a[key], b[key]));
};

function App() {
  const [settings, setSettings] = useState(() => loadSettings(sessionStorage));
  const [savedSettings, setSavedSettings] = useState(() =>
    loadSettings(sessionStorage),
  );
  const [exportNotice, setExportNotice] = useState(false);

  const handleSave = () => {
    saveSettings(settings, sessionStorage);
    setSavedSettings(settings);
  };

  const handleReset = () => {
    setSettings(mergeSettingsWithDefaults());
  };

  const handleExport = async () => {
    const text = exportSettingsText(settings);
    await navigator.clipboard.writeText(text);
    setExportNotice(true);
  };

  const handleChange = (path, value) => {
    setSettings((prev) => setByPath(prev, path, value));
  };

  useEffect(() => {
    if (!exportNotice) return undefined;
    const timeout = window.setTimeout(() => setExportNotice(false), 1800);
    return () => window.clearTimeout(timeout);
  }, [exportNotice]);

  const hasDirtyChanges = !areSettingsEqual(settings, savedSettings);

  return (
    <div className="app" style={{ backgroundColor: settings.background.color }}>
      <SettingsMenu
        settings={settings}
        schema={SETTINGS_CONFIG.settingsSchema}
        onChange={handleChange}
        onSave={handleSave}
        onReset={handleReset}
        onExport={handleExport}
        hasDirtyChanges={hasDirtyChanges}
      />
      {exportNotice && <div className="copy-notice">Copied to clipboard</div>}
      <Medusae config={settings} />
    </div>
  );
}

export default App;

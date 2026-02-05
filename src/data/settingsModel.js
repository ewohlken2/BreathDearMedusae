import SETTINGS_CONFIG from "./settingsConfig.js";

const deepMerge = (defaults, overrides = {}) => {
  const result = { ...defaults };
  Object.keys(defaults).forEach((key) => {
    const value = defaults[key];
    if (value && typeof value === "object" && !Array.isArray(value)) {
      result[key] = deepMerge(value, overrides[key]);
    } else if (
      typeof overrides?.[key] === "number" ||
      typeof overrides?.[key] === "string"
    ) {
      result[key] = overrides[key];
    }
  });
  return result;
};

export const mergeSettingsWithDefaults = (input = {}) =>
  deepMerge(SETTINGS_CONFIG.defaults, input);

export const exportSettingsText = (settings) => {
  const sections = ["cursor", "halo", "particles", "background"];
  const lines = ["{"];
  sections.forEach((section) => {
    lines.push(`  ${section}: {`);
    Object.entries(settings[section]).forEach(([key, value]) => {
      if (typeof value === "string") {
        lines.push(`    ${key}: "${value}",`);
      } else {
        lines.push(`    ${key}: ${value},`);
      }
    });
    lines.push("  },");
  });
  lines.push("}");
  return lines.join("\n");
};

export const loadSettings = (storage) => {
  if (!storage) return mergeSettingsWithDefaults();
  const stored = storage.getItem(SETTINGS_CONFIG.storageKey);
  if (!stored) return mergeSettingsWithDefaults();
  try {
    const parsed = JSON.parse(stored);
    return mergeSettingsWithDefaults(parsed);
  } catch {
    return mergeSettingsWithDefaults();
  }
};

export const saveSettings = (settings, storage) => {
  storage.setItem(SETTINGS_CONFIG.storageKey, JSON.stringify(settings));
};

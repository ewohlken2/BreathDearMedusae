import test from "node:test";
import assert from "node:assert/strict";
import SETTINGS_CONFIG from "./settingsConfig.js";
import {
  mergeSettingsWithDefaults,
  exportSettingsText,
} from "./settingsModel.js";

test("mergeSettingsWithDefaults fills missing fields", () => {
  const merged = mergeSettingsWithDefaults({ cursor: { radius: 0.1 } });
  assert.equal(merged.cursor.radius, 0.1);
  assert.equal(merged.cursor.strength, SETTINGS_CONFIG.defaults.cursor.strength);
  assert.equal(
    merged.particles.rotationJitter,
    SETTINGS_CONFIG.defaults.particles.rotationJitter,
  );
});

test("exportSettingsText includes all sections", () => {
  const text = exportSettingsText(SETTINGS_CONFIG.defaults);
  assert.ok(text.includes("cursor:"));
  assert.ok(text.includes("halo:"));
  assert.ok(text.includes("particles:"));
});

test("mergeSettingsWithDefaults preserves color string overrides", () => {
  const merged = mergeSettingsWithDefaults({
    particles: { colorBase: "#ffffff" },
  });
  assert.equal(merged.particles.colorBase, "#ffffff");
});

test("exportSettingsText quotes string values", () => {
  const text = exportSettingsText({
    ...SETTINGS_CONFIG.defaults,
    particles: { ...SETTINGS_CONFIG.defaults.particles, colorBase: "#ffffff" },
  });
  assert.ok(text.includes('colorBase: "#ffffff"'));
});

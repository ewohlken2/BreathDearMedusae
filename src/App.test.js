import test from "node:test";
import assert from "node:assert/strict";
import SETTINGS_CONFIG from "./data/settingsConfig.js";
import { mergeSettingsWithDefaults } from "./data/settingsModel.js";

test("mergeSettingsWithDefaults returns defaults on empty input", () => {
  const settings = mergeSettingsWithDefaults();
  assert.deepEqual(settings, SETTINGS_CONFIG.defaults);
});

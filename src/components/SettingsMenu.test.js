import test from "node:test";
import assert from "node:assert/strict";
import SETTINGS_CONFIG from "../data/settingsConfig.js";

test("settings schema has 3 sections", () => {
  assert.equal(SETTINGS_CONFIG.settingsSchema.length, 3);
});

import test from "node:test";
import assert from "node:assert/strict";
import SETTINGS_CONFIG from "./settingsConfig.js";

test("halo defaults include outer oscillation jitter controls", () => {
  const halo = SETTINGS_CONFIG.defaults.halo;
  assert.equal(typeof halo.outerOscJitterStrength, "number");
  assert.equal(typeof halo.outerOscJitterSpeed, "number");
});

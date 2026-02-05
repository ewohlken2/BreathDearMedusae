import test from "node:test";
import assert from "node:assert/strict";
import SETTINGS_CONFIG from "./settingsConfig.js";

test("halo defaults include outer oscillation jitter controls", () => {
  const halo = SETTINGS_CONFIG.defaults.halo;
  assert.equal(typeof halo.outerOscJitterStrength, "number");
  assert.equal(typeof halo.outerOscJitterSpeed, "number");
});

test("halo defaults include oval scaling controls", () => {
  const halo = SETTINGS_CONFIG.defaults.halo;
  assert.equal(typeof halo.scaleX, "number");
  assert.equal(typeof halo.scaleY, "number");
});

test("particle defaults include rotation and cursor follow controls", () => {
  const particles = SETTINGS_CONFIG.defaults.particles;
  assert.equal(typeof particles.rotationSpeed, "number");
  assert.equal(typeof particles.rotationJitter, "number");
  assert.equal(typeof particles.cursorFollowStrength, "number");
  assert.equal(typeof particles.oscillationFactor, "number");
});

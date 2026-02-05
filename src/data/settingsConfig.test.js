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

test("particle defaults include color palette and schema fields", () => {
  const particles = SETTINGS_CONFIG.defaults.particles;
  assert.equal(typeof particles.colorBase, "string");
  assert.equal(typeof particles.colorOne, "string");
  assert.equal(typeof particles.colorTwo, "string");
  assert.equal(typeof particles.colorThree, "string");

  const particlesSection = SETTINGS_CONFIG.settingsSchema.find(
    (section) => section.id === "particles",
  );
  const colorFields = particlesSection.fields.filter(
    (field) => field.type === "color",
  );
  assert.equal(colorFields.length, 4);
});

test("background defaults include color and schema field", () => {
  const background = SETTINGS_CONFIG.defaults.background;
  assert.equal(typeof background.color, "string");

  const backgroundSection = SETTINGS_CONFIG.settingsSchema.find(
    (section) => section.id === "background",
  );
  assert.ok(backgroundSection);
  assert.equal(backgroundSection.fields.length, 1);
  assert.equal(backgroundSection.fields[0].type, "color");
});

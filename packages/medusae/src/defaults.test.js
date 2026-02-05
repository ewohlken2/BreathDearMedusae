import test from "node:test";
import assert from "node:assert/strict";
import MEDUSAE_DEFAULTS from "./defaults.js";

test("medusae defaults include cursor/halo/particles", () => {
  assert.equal(typeof MEDUSAE_DEFAULTS.cursor, "object");
  assert.equal(typeof MEDUSAE_DEFAULTS.halo, "object");
  assert.equal(typeof MEDUSAE_DEFAULTS.particles, "object");
});

test("particle defaults include color palette strings", () => {
  const particles = MEDUSAE_DEFAULTS.particles;
  assert.equal(typeof particles.colorBase, "string");
  assert.equal(typeof particles.colorBlue, "string");
  assert.equal(typeof particles.colorRed, "string");
  assert.equal(typeof particles.colorYellow, "string");
});

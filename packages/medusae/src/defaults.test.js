import test from "node:test";
import assert from "node:assert/strict";
import MEDUSAE_DEFAULTS from "./defaults.js";

test("medusae defaults include cursor/halo/particles", () => {
  assert.equal(typeof MEDUSAE_DEFAULTS.cursor, "object");
  assert.equal(typeof MEDUSAE_DEFAULTS.halo, "object");
  assert.equal(typeof MEDUSAE_DEFAULTS.particles, "object");
});

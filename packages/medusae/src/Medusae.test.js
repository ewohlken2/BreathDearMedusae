import test from "node:test";
import assert from "node:assert/strict";
import MEDUSAE_DEFAULTS from "./defaults.js";

test("medusae defaults still load", () => {
  assert.equal(typeof MEDUSAE_DEFAULTS.particles.baseSize, "number");
});

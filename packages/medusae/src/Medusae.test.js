import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import MEDUSAE_DEFAULTS from "./defaults.js";

test("medusae defaults still load", () => {
  assert.equal(typeof MEDUSAE_DEFAULTS.particles.baseSize, "number");
});

test("medusae shader exposes particle color uniforms", () => {
  const filePath = path.join(process.cwd(), "packages/medusae/src/Medusae.jsx");
  const contents = fs.readFileSync(filePath, "utf8");
  assert.ok(contents.includes("uParticleColorBase"));
  assert.ok(contents.includes("uParticleColorBlue"));
  assert.ok(contents.includes("uParticleColorRed"));
  assert.ok(contents.includes("uParticleColorYellow"));
});

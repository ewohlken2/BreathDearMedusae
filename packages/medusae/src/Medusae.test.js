import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
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

test("fragment shader declares particle color uniforms", () => {
  const filePath = path.join(process.cwd(), "packages/medusae/src/Medusae.jsx");
  const contents = fs.readFileSync(filePath, "utf8");
  const fragmentStart = contents.indexOf("fragmentShader: `");
  assert.ok(fragmentStart >= 0);
  const fragmentEnd = contents.indexOf("`,", fragmentStart);
  assert.ok(fragmentEnd > fragmentStart);
  const fragmentSource = contents.slice(fragmentStart, fragmentEnd);
  assert.ok(fragmentSource.includes("uniform vec3 uParticleColorBase;"));
  assert.ok(fragmentSource.includes("uniform vec3 uParticleColorBlue;"));
  assert.ok(fragmentSource.includes("uniform vec3 uParticleColorRed;"));
  assert.ok(fragmentSource.includes("uniform vec3 uParticleColorYellow;"));
});

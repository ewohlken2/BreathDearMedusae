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
  assert.ok(contents.includes("uParticleColorOne"));
  assert.ok(contents.includes("uParticleColorTwo"));
  assert.ok(contents.includes("uParticleColorThree"));
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
  assert.ok(fragmentSource.includes("uniform vec3 uParticleColorOne;"));
  assert.ok(fragmentSource.includes("uniform vec3 uParticleColorTwo;"));
  assert.ok(fragmentSource.includes("uniform vec3 uParticleColorThree;"));
});

test("medusae background uses configurable color", () => {
  const filePath = path.join(process.cwd(), "packages/medusae/src/Medusae.jsx");
  const contents = fs.readFileSync(filePath, "utf8");
  assert.ok(contents.includes("background"));
  assert.ok(contents.includes("attach=\"background\""));
  assert.ok(contents.includes("background.color"));
});

test("medusae listens for global pointer movement", () => {
  const filePath = path.join(process.cwd(), "packages/medusae/src/Medusae.jsx");
  const contents = fs.readFileSync(filePath, "utf8");
  assert.ok(contents.includes("pointermove"));
  assert.ok(contents.includes("addEventListener"));
  assert.ok(contents.includes("window"));
});

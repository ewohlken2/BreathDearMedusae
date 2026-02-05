import test from "node:test";
import assert from "node:assert/strict";
import pkg from "./package.json" with { type: "json" };

test("package is publishable", () => {
  assert.equal(pkg.private, undefined);
  assert.equal(pkg.style, "dist/index.css");
  assert.equal(pkg.exports["./style.css"], "./dist/index.css");
});

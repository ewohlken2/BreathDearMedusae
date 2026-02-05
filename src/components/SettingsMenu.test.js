import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import SETTINGS_CONFIG from "../data/settingsConfig.js";

test("settings schema has 4 sections", () => {
  assert.equal(SETTINGS_CONFIG.settingsSchema.length, 4);
});

test("settings menu includes color picker support", () => {
  const filePath = path.join(process.cwd(), "src/components/SettingsMenu.jsx");
  const contents = fs.readFileSync(filePath, "utf8");
  assert.ok(contents.includes("ChromePicker"));
  assert.ok(contents.includes("@radix-ui/react-popover"));
});

import { readFile, access } from "node:fs/promises";
import { constants } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const checks = [];

function pass(name) {
  checks.push({ name, ok: true });
  console.log(`PASS — ${name}`);
}

function fail(name, detail) {
  checks.push({ name, ok: false, detail });
  console.error(`FAIL — ${name}: ${detail}`);
}

async function requiredFile(relativePath) {
  try {
    await access(path.join(root, relativePath), constants.R_OK);
    pass(`Required file readable: ${relativePath}`);
  } catch (error) {
    fail(`Required file readable: ${relativePath}`, error.message);
  }
}

for (const file of [
  "index.html",
  "styles.css",
  "app.js",
  "README.md",
  "ROADMAP.md",
  "VERSION.md",
  "sample-alchemy-save.json"
]) {
  await requiredFile(file);
}

const [html, css, app, readme, sampleText] = await Promise.all([
  readFile(path.join(root, "index.html"), "utf8"),
  readFile(path.join(root, "styles.css"), "utf8"),
  readFile(path.join(root, "app.js"), "utf8"),
  readFile(path.join(root, "README.md"), "utf8"),
  readFile(path.join(root, "sample-alchemy-save.json"), "utf8")
]);

const syntax = spawnSync(process.execPath, ["--check", path.join(root, "app.js")], {
  encoding: "utf8"
});
if (syntax.status === 0) pass("app.js syntax check");
else fail("app.js syntax check", (syntax.stderr || syntax.stdout).trim());

if (/styles\.css/.test(html) && /app\.js/.test(html)) pass("HTML loads stylesheet and application script");
else fail("HTML loads stylesheet and application script", "Missing styles.css or app.js reference");

const destinations = new Set([...html.matchAll(/data-view=["']([^"']+)["']/g)].map((match) => match[1]));
if (destinations.size >= 6) pass(`Navigation exposes ${destinations.size} destinations`);
else fail("Navigation destination count", `Expected at least 6, found ${destinations.size}`);

const ingredientIds = [...app.matchAll(/\{ id: ["']([^"']+)["'], name:/g)].map((match) => match[1]);
if (ingredientIds.length >= 12 && new Set(ingredientIds).size === ingredientIds.length) {
  pass(`Ingredient fixture contains ${ingredientIds.length} unique ingredients`);
} else {
  fail("Ingredient fixture integrity", `Found ${ingredientIds.length} entries with ${new Set(ingredientIds).size} unique IDs`);
}

if (/catalyst-prototype-v0\.1/.test(app) && /localStorage/.test(app)) pass("Catalyst-owned local persistence boundary exists");
else fail("Catalyst-owned local persistence boundary exists", "Storage key or localStorage usage missing");

if (/does \*\*not\*\* overwrite/i.test(readme) && /one-way/i.test(readme)) pass("README declares one-way save boundary");
else fail("README declares one-way save boundary", "Boundary language missing");

try {
  const sample = JSON.parse(sampleText);
  if (sample && typeof sample === "object") pass("Sample import JSON parses");
  else fail("Sample import JSON parses", "Parsed value is not an object");
} catch (error) {
  fail("Sample import JSON parses", error.message);
}

if (/max-width/i.test(css) && /@media/i.test(css)) pass("Responsive CSS rules are present");
else fail("Responsive CSS rules are present", "Expected max-width and media-query rules");

const failed = checks.filter((check) => !check.ok);
console.log(`\nResult: ${checks.length - failed.length}/${checks.length} static checks passing.`);
if (failed.length) process.exit(1);

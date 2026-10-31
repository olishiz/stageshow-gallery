// Writes public/sw.js after `next build`: every prerendered page plus every
// static asset goes into a precache versioned by the build id.
import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const nextDir = path.join(root, ".next");

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)])),
  );
  return files.flat();
}

const buildId = (await readFile(path.join(nextDir, "BUILD_ID"), "utf8")).trim();
const prerender = JSON.parse(await readFile(path.join(nextDir, "prerender-manifest.json"), "utf8"));

const pages = Object.keys(prerender.routes)
  .filter((route) => !route.startsWith("/_") && !/\.\w+$/.test(route))
  .sort();

const staticAssets = (await walk(path.join(nextDir, "static")))
  .filter((f) => !f.endsWith(".map"))
  .map((f) => `/_next/static/${path.relative(path.join(nextDir, "static"), f).split(path.sep).join("/")}`);

const publicAssets = (await walk(path.join(root, "public")))
  .map((f) => `/${path.relative(path.join(root, "public"), f).split(path.sep).join("/")}`)
  .filter((f) => f !== "/sw.js" && !f.startsWith("/screenshots/"));

const assets = [...publicAssets, "/manifest.webmanifest", ...staticAssets];

const template = await readFile(path.join(root, "scripts/sw-template.js"), "utf8");
const sw = template
  .replace("__VERSION__", buildId)
  .replace("__PAGES__", JSON.stringify(pages, null, 2))
  .replace("__ASSETS__", JSON.stringify(assets, null, 2));

await writeFile(path.join(root, "public/sw.js"), sw);
console.log(`sw.js: ${pages.length} pages, ${assets.length} assets, version ${buildId}`);

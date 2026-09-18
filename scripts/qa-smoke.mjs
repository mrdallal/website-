// Automated smoke test: signs in with the seeded local admin fixture (from .env),
// visits dashboard pages, captures screenshots and reports console/page errors.
import { chromium } from "playwright-core";
import { readFileSync } from "node:fs";
import path from "node:path";

const root = "C:/Users/LARTEK/OneDrive/Desktop/my website";
const out = "C:/Users/LARTEK/AppData/Local/Temp/claude/C--Users-LARTEK-OneDrive-Desktop-my-website/b8f99563-f6b8-4f82-86bc-3433e085939a/scratchpad/shots";
const env = Object.fromEntries(
  readFileSync(path.join(root, ".env"), "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, "")];
    }),
);

const base = "http://localhost:3000";
const pages = (process.argv[2] ?? "/dashboard").split(",");
const width = Number(process.argv[3] ?? 1440);
const errors = [];

const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: process.env.QA_REDUCED === "0" ? "no-preference" : "reduce" });
const page = await context.newPage();
page.on("console", (msg) => {
  if (msg.type() === "error" || msg.type() === "warning") errors.push(`[console ${msg.type()}] ${msg.text()}`);
});
page.on("pageerror", (err) => errors.push(`[pageerror] ${err.message}`));

await page.goto(`${base}/login`, { waitUntil: "networkidle" });
await page.fill('input[name="email"]', env.ADMIN_EMAIL);
await page.fill('input[name="password"]', env.ADMIN_PASSWORD);
await Promise.all([page.waitForURL(/\/dashboard/, { timeout: 30000 }), page.click('button[type="submit"]')]);
console.log("Signed in ->", page.url());

for (const p of pages) {
  await page.goto(`${base}${p}`, { waitUntil: "networkidle" });
  // Scroll through so in-view reveals fire, then return to top before capturing.
  await page.evaluate(async () => { document.documentElement.style.scrollBehavior = "auto"; const h = document.documentElement.scrollHeight; for (let y = 0; y < h; y += 400) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } window.scrollTo(0, 0); });
  await page.waitForTimeout(1400);
  const title = await page.title();
  const status = await page.evaluate(() => document.body.innerText.includes("Application error") ? "APP ERROR" : "ok");
  const name = p.replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "") || "root";
  await page.screenshot({ path: `${out}/${name}-${width}.png`, fullPage: true });
  console.log(`${p} -> ${status} | ${title}`);
}

await browser.close();
if (errors.length) {
  console.log("--- console/page errors ---");
  for (const e of errors) console.log(e);
} else {
  console.log("No console errors.");
}

// End-to-end flow test against a running dev server (pnpm dev) using the
// seeded admin fixture from .env. Exercises: lead form submit, lead status
// change + note, convert to client, create project, create + move task,
// settings save. Run: node scripts/qa-flows.mjs
import { chromium } from "playwright-core";
import { readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const env = Object.fromEntries(
  readFileSync(path.join(root, ".env"), "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, "")];
    }),
);
const base = process.env.BASE_URL ?? "http://localhost:3000";
const errors = [];
const results = [];
const check = (name, ok, detail = "") => {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
};

const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
const page = await context.newPage();
page.on("console", (m) => m.type() === "error" && errors.push(`[console] ${m.text()}`));
page.on("pageerror", (e) => errors.push(`[pageerror] ${e.message}`));

try {
  // 1. Public lead form
  const stamp = Date.now();
  await page.goto(`${base}/contact?service=automation`, { waitUntil: "networkidle" });
  check("contact form preselects service", (await page.inputValue('select[name="service"]')) === "automation");
  await page.fill('input[name="name"]', `Flow Test ${stamp}`);
  await page.fill('input[name="email"]', `flow-${stamp}@example.com`);
  await page.fill('input[name="company"]', "Flow Co");
  await page.selectOption('select[name="budget"]', "10k-25k");
  await page.fill('textarea[name="message"]', "End-to-end flow test submission.");
  await page.waitForTimeout(2600); // pass the anti-bot timing check
  await page.click('button[type="submit"]');
  await page.waitForSelector("text=Lead submitted successfully", { timeout: 20000 });
  const ref = await page.locator("dd.font-mono").first().innerText();
  check("lead form success state shows reference", /^c[a-z0-9]{20,}$/.test(ref), ref);

  // 2. Client-side validation
  await page.goto(`${base}/contact`, { waitUntil: "networkidle" });
  await page.fill('input[name="name"]', "A");
  await page.fill('input[name="email"]', "not-an-email");
  await page.click('button[type="submit"]');
  await page.waitForSelector('[role="alert"]');
  check("client-side validation blocks bad input", (await page.locator('[role="alert"]').count()) >= 1);

  // 3. Sign in
  await page.goto(`${base}/login`, { waitUntil: "networkidle" });
  await page.fill('input[name="email"]', env.ADMIN_EMAIL);
  await page.fill('input[name="password"]', "wrong-password-123");
  await page.click('button[type="submit"]');
  await page.waitForSelector("text=Invalid email or password", { timeout: 15000 });
  check("wrong password rejected", true);
  await page.fill('input[name="password"]', env.ADMIN_PASSWORD);
  await Promise.all([page.waitForURL(/\/dashboard/, { timeout: 30000 }), page.click('button[type="submit"]')]);
  check("sign in redirects to dashboard", page.url().includes("/dashboard"));

  // 4. Lead appears, status + note + convert
  await page.goto(`${base}/dashboard/leads/${ref}`, { waitUntil: "networkidle" });
  check("lead detail loads", (await page.locator("h1").innerText()).includes(`Flow Test ${stamp}`));
  await page.click("text=Mark contacted");
  await page.waitForSelector("text=Status set to Contacted", { timeout: 15000 });
  await page.waitForTimeout(800);
  check("status changed to CONTACTED", (await page.locator("text=CONTACTED").count()) > 0);
  await page.fill('textarea[name="note"]', "Called, interested in automation.");
  await page.click("text=Add note");
  await page.waitForSelector("text=Note added", { timeout: 15000 });
  await page.waitForTimeout(800);
  check("note appears in activity", (await page.locator("text=Called, interested in automation.").count()) > 0);
  await page.click("text=Convert to client");
  await page.click("text=Create client");
  await page.waitForURL(/\/dashboard\/clients\//, { timeout: 20000 });
  const clientUrl = page.url();
  check("lead converted to client", clientUrl.includes("/dashboard/clients/"));

  // 5. Create project
  await page.goto(`${base}/dashboard/projects/new`, { waitUntil: "networkidle" });
  await page.fill('input[name="name"]', `Flow Project ${stamp}`);
  await page.selectOption('select[name="clientId"]', { index: 1 });
  await page.selectOption('select[name="status"]', "ACTIVE");
  await page.fill('input[name="deadline"]', "2026-12-31");
  await page.click("text=Create project");
  await page.waitForURL(/\/dashboard\/projects\/[a-z0-9]+\?created=1/, { timeout: 20000 });
  const projectUrl = page.url().split("?")[0];
  check("project created", true, projectUrl);

  // 6. Create task from tasks page + move on board
  await page.goto(`${base}/dashboard/tasks`, { waitUntil: "networkidle" });
  await page.click("text=New task");
  const dialog = page.locator('[role="dialog"]');
  await dialog.locator('input[name="title"]').fill(`Flow task ${stamp}`);
  await dialog.locator('select[name="projectId"]').selectOption({ label: `Flow Project ${stamp}` });
  await dialog.locator('select[name="priority"]').selectOption("HIGH");
  await dialog.locator("text=Create task").click();
  await page.waitForSelector("text=Task created", { timeout: 15000 });
  await page.waitForTimeout(1000);
  const card = page.locator("li", { hasText: `Flow task ${stamp}` }).first();
  check("task on board in TODO", (await card.count()) > 0);
  await card.locator('button[aria-label^="Move"][aria-label$="In Progress"]').click();
  await page.waitForTimeout(1500);
  const inProgressCol = page.locator('section[aria-label="In Progress"]');
  check("task moved to IN_PROGRESS", (await inProgressCol.locator(`text=Flow task ${stamp}`).count()) > 0);

  // 7. Project progress reflects tasks
  await page.goto(projectUrl, { waitUntil: "networkidle" });
  const progressText = await page.locator("text=/\\d+%|No tasks yet/").first().innerText();
  check("project progress computed", /%/.test(progressText), progressText);

  // 8. Settings save
  await page.goto(`${base}/dashboard/settings`, { waitUntil: "networkidle" });
  await page.fill('input[name="agency_name"]', "TECHSIDES");
  await page.click("text=Save settings");
  await page.waitForSelector("text=Settings saved", { timeout: 15000 });
  check("settings saved", true);

  // 9. Sign out
  await page.click("text=Sign out");
  await page.waitForURL(/\/login/, { timeout: 15000 });
  check("sign out returns to login", page.url().includes("/login"));
} catch (error) {
  check("flow completed without exception", false, error.message);
  await page.screenshot({ path: path.join(root, "qa-failure.png"), fullPage: true });
}

await browser.close();
const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} checks passed.`);
if (errors.length) {
  console.log("--- console/page errors ---");
  for (const e of errors) console.log(e);
}
process.exit(failed ? 1 : 0);

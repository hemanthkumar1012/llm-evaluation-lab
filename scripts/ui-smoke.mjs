import { chromium } from "playwright";

const base = process.env.PREVIEW_URL || "http://localhost:3000";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const results = [];

async function check(name, fn) {
  try { await fn(); results.push({ name, ok: true }); }
  catch (error) { results.push({ name, ok: false, error: error.message }); }
}

await check("mobile overview CTA is reachable", async () => {
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Run the instrument/i }).waitFor();
  await page.getByRole("button", { name: /Run the instrument/i }).click();
  await page.waitForURL(/\/run$/);
});

await check("workflow page exposes version action", async () => {
  await page.goto(`${base}/workflow`, { waitUntil: "networkidle" });
  const action = page.getByRole("button", { name: /Register version|Create workflow/i });
  await action.waitFor();
  await action.focus();
  if (await action.evaluate(el => document.activeElement !== el)) throw new Error("primary workflow action did not receive focus");
});

await check("evaluator controls are keyboard reachable", async () => {
  await page.goto(`${base}/run`, { waitUntil: "networkidle" });
  const firstSelect = page.getByLabel("Workflow version");
  await firstSelect.waitFor();
  await firstSelect.focus();
  if (await firstSelect.evaluate(el => document.activeElement !== el)) throw new Error("workflow selector did not receive focus");
  const runButton = page.getByRole("button", { name: /Run evaluation/i });
  await runButton.waitFor();
  if (await runButton.isDisabled()) throw new Error("run action is unexpectedly disabled with saved inputs");
});

console.log(JSON.stringify({ base, viewport: "390x844", results }, null, 2));
await browser.close();
if (results.some(item => !item.ok)) process.exitCode = 1;

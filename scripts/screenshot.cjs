const { chromium } = require("playwright");
const { spawn } = require("node:child_process");
const { mkdir } = require("node:fs/promises");
(async () => {
  const server = spawn(
    process.execPath,
    ["node_modules/vite/bin/vite.js", "--host", "127.0.0.1", "--port", "5199", "--strictPort"],
    { stdio: "pipe" },
  );
  let browser;
  try {
    await new Promise((resolve, reject) => {
      server.stdout.on("data", (chunk) => {
        if (chunk.toString().includes("Local:")) resolve();
      });
      server.on("exit", (code) => reject(new Error(`Preview server exited: ${code}`)));
      server.on("error", reject);
    });
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1300, height: 780 }, deviceScaleFactor: 1 });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("http://127.0.0.1:5199/demo/");
    const first = page.locator("home-theater-card").first();
    const second = page.locator("home-theater-card").nth(2);
    await first.locator("ha-card").waitFor();
    await page.evaluate(() => document.fonts.ready);
    await mkdir("docs", { recursive: true });
    await page.screenshot({ path: "docs/home-theater-card.png", fullPage: true });
    await page.locator("#theme").click();
    await page.screenshot({ path: "docs/home-theater-dark.png", fullPage: true });
    await page.locator("#theme").click();
    await first.locator('[data-action="all-sources"]').click();
    await page.screenshot({ path: "docs/home-theater-sources.png", fullPage: true });
    await page.keyboard.press("Escape");
    await page.locator("#arc").click();
    await second.locator('[data-action="configure"]').click();
    await page.screenshot({ path: "docs/home-theater-configure.png", fullPage: true });
    await page.keyboard.press("Escape");
    await page.locator("#off").click();
    await page.screenshot({ path: "docs/home-theater-off.png", fullPage: true });
    await page.setViewportSize({ width: 360, height: 800 });
    await page.screenshot({ path: "docs/home-theater-mobile.png", fullPage: false });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    if (overflow) throw new Error("Mobile viewport overflows horizontally");
    if (errors.length) throw new Error(errors.join("\n"));
    console.log("Saved six production-bundle previews; no browser errors or mobile overflow.");
  } finally {
    await browser?.close();
    server.kill();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

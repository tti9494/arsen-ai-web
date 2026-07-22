import { expect, test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const publicPages = [
  "index.html",
  "education.html",
  "paid-class.html",
  "free-class.html",
  "store.html",
  "yoonbot.html",
  "blog-automation.html",
  "cases.html",
  "student-ai-cards.html",
  "consulting.html",
  "contact.html",
  "legal-checklist.html",
];

const formPages = ["index.html", "consulting.html", "store.html", "yoonbot.html"];

function assertLocalLinksExist(hrefs, pagePath) {
  for (const href of hrefs) {
    if (!href || href.startsWith("#") || /^(mailto:|tel:)/.test(href)) continue;
    const target = new URL(href, `http://127.0.0.1:4173/${pagePath}`);
    if (target.origin !== "http://127.0.0.1:4173") continue;
    const relativePath = decodeURIComponent(target.pathname).replace(/^\//, "") || "index.html";
    expect(path.resolve(rootDir, relativePath).startsWith(rootDir)).toBeTruthy();
    expect(fs.existsSync(path.resolve(rootDir, relativePath)), `${pagePath} -> ${href}`).toBeTruthy();
  }
}

test.describe("public page rendering", () => {
  for (const pagePath of publicPages) {
    test(`${pagePath} renders without local asset failures or horizontal overflow`, async ({ page }) => {
      const pageErrors = [];
      const failedAssets = [];
      page.on("pageerror", (error) => pageErrors.push(error.message));
      page.on("response", (response) => {
        const url = new URL(response.url());
        if (url.origin === "http://127.0.0.1:4173" && response.status() >= 400 && url.pathname !== "/favicon.ico") {
          failedAssets.push(`${response.status()} ${url.pathname}`);
        }
      });

      await page.goto(`/${pagePath}`, { waitUntil: "domcontentloaded" });
      await expect(page.locator("body")).toBeVisible();
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
      expect(pageErrors).toEqual([]);
      expect(failedAssets).toEqual([]);

      const hrefs = await page.locator("a[href]").evaluateAll((links) => links.map((link) => link.getAttribute("href")));
      assertLocalLinksExist(hrefs, pagePath);
    });
  }
});

test("all public headers expose the AI 명함 route", async ({ page }) => {
  for (const pagePath of publicPages) {
    await page.goto(`/${pagePath}`, { waitUntil: "domcontentloaded" });
    const allNavigationLinks = page.locator('nav a[href="student-ai-cards.html"]');
    const mobileNavigationLinks = page.locator('#mobileMenu a[href="student-ai-cards.html"]');
    await expect(allNavigationLinks).toHaveCount(2);
    await expect(mobileNavigationLinks).toHaveCount(1);
  }
});

test("mobile menus reveal the AI 명함 route", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "mobile-only interaction");
  for (const pagePath of ["index.html", "blog-automation.html", "student-ai-cards.html"]) {
    await page.goto(`/${pagePath}`, { waitUntil: "domcontentloaded" });
    const menuButton = page.locator("#menuBtn");
    await expect(menuButton).toHaveCount(1);
    await menuButton.click();
    await expect(page.locator('#mobileMenu a[href="student-ai-cards.html"]')).toBeVisible();
  }
});

test("student AI cards render and switch their visible detail", async ({ page }) => {
  await page.goto("/student-ai-cards.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator("[data-student-id]")).toHaveCount(3);
  await page.locator('[data-student-id="mono-studio"]').click();
  await expect(page.locator("[data-student-card-detail] h2")).toHaveText("모노 홍보 스튜디오");
  await expect(page.locator('[data-student-id="mono-studio"]')).toHaveAttribute("aria-pressed", "true");
});

test("theme variants preserve the student AI card layout", async ({ page }) => {
  for (const theme of ["arsen-modern", "legacy"]) {
    await page.goto(`/student-ai-cards.html?theme=${theme}`, { waitUntil: "domcontentloaded" });
    await expect(page.locator(".student-card-grid")).toHaveCSS("display", "grid");
    await expect(page.locator("[data-student-id]")).toHaveCount(3);
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
  }
});

test("personal-information forms show explicit consent and privacy policy before submission", async ({ page }) => {
  for (const pagePath of formPages) {
    await page.goto(`/${pagePath}`, { waitUntil: "domcontentloaded" });
    const form = page.locator("[data-consultation-form]");
    await expect(form).toHaveCount(1);
    await expect(form.locator('input[name="consent_privacy"][type="checkbox"][required]')).toHaveCount(1);
    await expect(form.locator('a[href*="privacy.html"]')).toHaveCount(1);
    if (pagePath === "index.html") {
      await expect(form.locator('input[name="consent_marketing"][type="checkbox"][required]')).toHaveCount(1);
    }
  }
});

test("homepage visual smoke attaches a viewport snapshot", async ({ page }, testInfo) => {
  await page.goto("/index.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator("main")).toBeVisible();

  const screenshotPath = testInfo.outputPath(`homepage-${testInfo.project.name}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: false });
  await testInfo.attach("homepage-viewport", {
    path: screenshotPath,
    contentType: "image/png",
  });
});

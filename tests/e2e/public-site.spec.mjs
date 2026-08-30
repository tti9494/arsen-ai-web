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

const yoonbotReleaseEndpoint = "https://apply.arsen-ai.com/api/yoonbot/release";
// Deliberately different from any version hardcoded anywhere: proves the page
// derives version, basename, and metadata from the release contract alone.
const yoonbotReadyRelease = {
  download_ready: true,
  status: "available",
  latest_version: "9.9.9",
  minimum_supported_version: "9.0.0",
  platform: "win32",
  arch: "x64",
  artifact_name: "YoonBot-Setup-9.9.9.exe",
  artifact_download_url: "https://apply.arsen-ai.com/api/yoonbot/artifacts/YoonBot-Setup-9.9.9.exe",
  sha256: "0f".repeat(32),
  size_bytes: 52428800,
};

const yoonbotInvalidReleases = [
  ["non-HTTPS artifact URL", { artifact_download_url: "http://apply.arsen-ai.com/api/yoonbot/artifacts/YoonBot-Setup-9.9.9.exe" }],
  ["malformed sha256", { sha256: "not-a-real-sha" }],
  ["zero size", { size_bytes: 0 }],
  ["negative size", { size_bytes: -128 }],
  ["non-numeric size", { size_bytes: "52428800" }],
  ["artifact basename not matching latest_version", { artifact_name: "YoonBot-Setup-1.1.0.exe" }],
  ["empty latest_version", { latest_version: "" }],
];

function mockYoonbotRelease(page, body, status = 200) {
  return page.route(yoonbotReleaseEndpoint, (route) =>
    route.fulfill({
      status,
      contentType: "application/json",
      headers: { "access-control-allow-origin": "*" },
      body: JSON.stringify(body),
    }),
  );
}

function captureYoonbotConsoleErrors(page) {
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    // The deliberately failing mocked release request is the simulated
    // condition itself; page code must stay error-free in every state.
    const fromReleaseEndpoint =
      message.location().url.includes("/api/yoonbot/release") || message.text().includes("/api/yoonbot/release");
    if (message.type() === "error" && !fromReleaseEndpoint) errors.push(message.text());
  });
  return errors;
}

async function expectYoonbotFailClosed(page) {
  const downloadLink = page.locator("#yoonbotDownloadLink");
  await expect(page.locator("#yoonbotReleaseStatus")).toHaveText("릴리스 준비 중");
  await expect(page.locator("#yoonbotReleaseStatus")).toHaveAttribute("data-release-state", "unavailable");
  await expect(downloadLink).toHaveAttribute("aria-disabled", "true");
  await expect(downloadLink).not.toHaveAttribute("href", /.*/);
  await expect(page.locator("#yoonbotReleaseMeta")).toBeHidden();
}

async function attachYoonbotScreenshot(page, testInfo, stateName) {
  await page.locator("#download").scrollIntoViewIfNeeded();
  // Capture evidence only after the section's reveal transition has settled.
  await expect
    .poll(() =>
      page.evaluate(() =>
        [...document.querySelectorAll("#download [data-animate]")].every(
          (el) => el.classList.contains("is-visible") && getComputedStyle(el).opacity === "1",
        ),
      ),
    )
    .toBeTruthy();
  const screenshotPath = testInfo.outputPath(`yoonbot-${stateName}-${testInfo.project.name}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: false });
  await testInfo.attach(`yoonbot-${stateName}`, { path: screenshotPath, contentType: "image/png" });
  return screenshotPath;
}

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

test("course recruitment copy consistently presents the second cohort", async ({ page }) => {
  for (const pagePath of ["index.html", "education.html", "paid-class.html", "free-class.html"]) {
    await page.goto(`/${pagePath}`, { waitUntil: "domcontentloaded" });
    await expect(page.locator("body")).toContainText("2기");
    await expect(page.locator("body")).not.toContainText("1기");
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

test("yoonbot download link activates only from a valid release contract", async ({ page }, testInfo) => {
  const consoleErrors = captureYoonbotConsoleErrors(page);
  await mockYoonbotRelease(page, yoonbotReadyRelease);
  await page.goto("/yoonbot.html", { waitUntil: "domcontentloaded" });

  const downloadLink = page.locator("#yoonbotDownloadLink");
  await expect(downloadLink).toHaveAttribute("href", yoonbotReadyRelease.artifact_download_url);
  await expect(downloadLink).not.toHaveAttribute("aria-disabled", /.*/);
  await expect(page.locator("#yoonbotReleaseStatus")).toHaveAttribute("data-release-state", "ready");
  await expect(page.locator("#yoonbotReleaseVersion")).toHaveText(yoonbotReadyRelease.latest_version);
  await expect(page.locator("#yoonbotReleaseFile")).toHaveText(yoonbotReadyRelease.artifact_name);
  await expect(page.locator("#yoonbotReleaseWindows")).toHaveText("Windows x64 · 최소 지원 버전 9.0.0");
  await expect(page.locator("#yoonbotReleaseSha")).toHaveText(yoonbotReadyRelease.sha256);
  await expect(page.locator("#yoonbotReleaseSize")).toContainText("52,428,800");
  expect(consoleErrors).toEqual([]);
  await attachYoonbotScreenshot(page, testInfo, "ready");
});

test("yoonbot purchase, license, and official download stay connected in order", async ({ page }) => {
  await mockYoonbotRelease(page, yoonbotReadyRelease);
  await page.goto("/yoonbot.html", { waitUntil: "domcontentloaded" });

  await expect(page.locator('a[href="https://apply.arsen-ai.com/frontend/yoonbot.html#order"]')).toHaveCount(3);
  const orderSteps = page.locator("#download ol li");
  await expect(orderSteps).toHaveCount(4);
  await expect(orderSteps.nth(0)).toContainText("구매");
  await expect(orderSteps.nth(0).locator('a[href="https://apply.arsen-ai.com/frontend/yoonbot.html#order"]')).toHaveCount(1);
  await expect(orderSteps.nth(1)).toContainText("라이선스 키 발급");
  await expect(orderSteps.nth(2)).toContainText("내려받아");
  await expect(orderSteps.nth(3)).toContainText("인증");
});

test("yoonbot download stays fail-closed while the release lookup is pending", async ({ page }) => {
  const consoleErrors = captureYoonbotConsoleErrors(page);
  await page.route(yoonbotReleaseEndpoint, () => {});
  await page.goto("/yoonbot.html", { waitUntil: "domcontentloaded" });

  const downloadLink = page.locator("#yoonbotDownloadLink");
  await expect(downloadLink).toHaveAttribute("aria-disabled", "true");
  await expect(downloadLink).not.toHaveAttribute("href", /.*/);
  await expect(page.locator("#yoonbotReleaseStatus")).toHaveAttribute("data-release-state", "loading");
  await expect(page.locator("#yoonbotReleaseMeta")).toBeHidden();
  expect(consoleErrors).toEqual([]);
});

test("yoonbot download stays fail-closed when the release is unavailable", async ({ page }, testInfo) => {
  const consoleErrors = captureYoonbotConsoleErrors(page);
  await mockYoonbotRelease(page, { download_ready: false, status: "preparing" });
  await page.goto("/yoonbot.html", { waitUntil: "domcontentloaded" });

  await expectYoonbotFailClosed(page);
  await expect(page.locator('#download a[href="https://apply.arsen-ai.com/api/yoonbot/manifest"]')).toHaveCount(1);
  await expect(page.locator('a[href="https://apply.arsen-ai.com/frontend/yoonbot.html#order"]')).toHaveCount(3);
  await expect(page.locator('main a[href="consulting.html"]')).toHaveCount(1);
  expect(consoleErrors).toEqual([]);
  await attachYoonbotScreenshot(page, testInfo, "unavailable");
});

for (const status of [401, 500]) {
  test(`yoonbot download stays fail-closed on release endpoint HTTP ${status}`, async ({ page }) => {
    const consoleErrors = captureYoonbotConsoleErrors(page);
    await mockYoonbotRelease(page, { ok: false }, status);
    await page.goto("/yoonbot.html", { waitUntil: "domcontentloaded" });

    await expectYoonbotFailClosed(page);
    expect(consoleErrors).toEqual([]);
  });
}

test("yoonbot download stays fail-closed on release endpoint network failure", async ({ page }) => {
  const consoleErrors = captureYoonbotConsoleErrors(page);
  await page.route(yoonbotReleaseEndpoint, (route) => route.abort("failed"));
  await page.goto("/yoonbot.html", { waitUntil: "domcontentloaded" });

  await expectYoonbotFailClosed(page);
  expect(consoleErrors).toEqual([]);
});

for (const [label, overrides] of yoonbotInvalidReleases) {
  test(`yoonbot download stays fail-closed on invalid contract: ${label}`, async ({ page }) => {
    const consoleErrors = captureYoonbotConsoleErrors(page);
    await mockYoonbotRelease(page, { ...yoonbotReadyRelease, ...overrides });
    await page.goto("/yoonbot.html", { waitUntil: "domcontentloaded" });

    await expectYoonbotFailClosed(page);
    expect(consoleErrors).toEqual([]);
  });
}

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

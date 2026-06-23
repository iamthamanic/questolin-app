import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

const EVIDENCE_DIR = ".qa/evidence/localstorage-progress";
const PROGRESS_KEY = "questolin.progress.v1";

test.beforeAll(() => {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
});

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate((key) => localStorage.removeItem(key), PROGRESS_KEY);
});

test("restores slide index on topic page after reload", async ({ page }) => {
  await page.goto("/topic/api");
  await expect(page.locator("[data-slide-deck]")).toBeVisible();

  const counter = page.locator("[data-slide-deck]").locator('[class*="topicCounter"]');
  await expect(counter).toHaveText("1 / 7");

  await page.getByRole("button", { name: "Weiter" }).click();
  await page.getByRole("button", { name: "Weiter" }).click();
  await expect(counter).toHaveText("3 / 7");

  await page.reload();
  await expect(counter).toHaveText("3 / 7", { timeout: 10_000 });

  await page.screenshot({
    path: path.join(EVIDENCE_DIR, "01-after-reload.png"),
    fullPage: true,
  });
});

test("restores last topic on feed after reload", async ({ page }) => {
  await page.goto("/topic/datenbanken");
  await expect(page.locator("[data-slide-deck]")).toBeVisible();

  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Was ist eine Datenbank/i })).toBeVisible();

  await page.reload();
  await expect(page.getByRole("heading", { name: /Was ist eine Datenbank/i })).toBeVisible();
});

test("works when localStorage is unavailable", async ({ page }) => {
  await page.addInitScript(() => {
    const deny = () => {
      throw new DOMException("denied", "SecurityError");
    };
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: {
        getItem: deny,
        setItem: deny,
        removeItem: deny,
        clear: deny,
        key: deny,
        length: 0,
      },
    });
  });

  await page.goto("/topic/api");
  await expect(page.locator("[data-slide-deck]")).toBeVisible();
  await page.getByRole("button", { name: "Weiter" }).click();
  await page.reload();
  await expect(
    page.locator("[data-slide-deck]").locator('[class*="topicCounter"]'),
  ).toHaveText("1 / 7");
});

test("stores only progress fields in localStorage", async ({ page }) => {
  await page.goto("/topic/api");
  await page.getByRole("button", { name: "Weiter" }).click();

  const raw = await page.evaluate((key) => localStorage.getItem(key), PROGRESS_KEY);
  expect(raw).toBeTruthy();
  const parsed = JSON.parse(raw!);
  expect(parsed.version).toBe(1);
  expect(parsed.lastTopicId).toBe("api");
  expect(parsed.topics.api.slideIndex).toBe(1);
  expect(JSON.stringify(parsed)).not.toMatch(/password|token|secret|apiKey/i);
});

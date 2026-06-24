import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";
import { useDesktopNav } from "./helpers/viewport";
import { slideDeck } from "./helpers/feed";

const EVIDENCE_DIR = ".qa/evidence/localstorage-progress";
const PROGRESS_KEY = "questolin.progress.v2";
const LEVEL_ONBOARDING_KEY = "questolin.onboarding.level.v1";

const API_SLIDE_COUNT = 9;

test.beforeAll(() => {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
});

test.beforeEach(async ({ page }) => {
  await useDesktopNav(page);
  await page.goto("/feed");
  await page.evaluate((key) => localStorage.removeItem(key), PROGRESS_KEY);
  await page.evaluate((key) => localStorage.setItem(key, "1"), LEVEL_ONBOARDING_KEY);
  await page.goto("/feed");
});

test("restores slide index on topic page after reload", async ({ page }) => {
  await page.goto("/topic/api");
  await expect(page.locator("[data-slide-deck]")).toBeVisible();

  const counter = slideDeck(page).locator("[data-slide-counter]");
  await expect(counter).toHaveText(`1 / ${API_SLIDE_COUNT}`);

  await page.getByRole("button", { name: "Weiter" }).click();
  await page.getByRole("button", { name: "Weiter" }).click();
  await expect(counter).toHaveText(`3 / ${API_SLIDE_COUNT}`);

  await page.reload();
  await expect(counter).toHaveText(`3 / ${API_SLIDE_COUNT}`, { timeout: 10_000 });

  await page.screenshot({
    path: path.join(EVIDENCE_DIR, "01-after-reload.png"),
    fullPage: true,
  });
});

test("restores last topic on feed after reload", async ({ page }) => {
  await page.goto("/topic/client-server");
  await expect(page.locator("[data-slide-deck]")).toBeVisible();

  await page.goto("/feed");
  await expect(page.getByRole("heading", { name: /Client und Server/i })).toBeVisible();

  await page.reload();
  await expect(page.getByRole("heading", { name: /Client und Server/i })).toBeVisible();
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
  await expect(page.locator("[data-topic-deck]").locator("[data-slide-counter]")).toHaveText(
    `1 / ${API_SLIDE_COUNT}`,
  );
});

test("stores only progress fields in localStorage", async ({ page }) => {
  await page.goto("/topic/api");
  await page.getByRole("button", { name: "Weiter" }).click();

  const raw = await page.evaluate((key) => localStorage.getItem(key), PROGRESS_KEY);
  expect(raw).toBeTruthy();
  const parsed = JSON.parse(raw!);
  expect(parsed.version).toBe(2);
  expect(parsed.userLevel).toBe(0);
  expect(parsed.lastTopicId).toBe("api");
  expect(parsed.topics.api.slideIndex).toBe(1);
  expect(JSON.stringify(parsed)).not.toMatch(/password|token|secret|apiKey/i);
});

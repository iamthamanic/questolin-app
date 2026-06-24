import { test, expect } from "@playwright/test";
import { firstTopicPanel, slideCounter, slideDeck } from "./helpers/feed";
import { swipeHorizontalOnDeck, swipeVerticalOnHeader } from "./helpers/swipe";

const ONBOARDING_KEY = "questolin.onboarding.v1";
const LEVEL_ONBOARDING_KEY = "questolin.onboarding.level.v1";
const CLIENT_SERVER_SLIDE_COUNT = 8;
const API_SLIDE_COUNT = 9;

test.beforeEach(async ({ page }) => {
  await page.goto("/feed");
  await page.evaluate((key) => localStorage.removeItem(key), ONBOARDING_KEY);
  await page.evaluate((key) => localStorage.setItem(key, "1"), LEVEL_ONBOARDING_KEY);
  await page.goto("/feed");
});

test("story segments and overlay chrome on feed", async ({ page }) => {
  const panel = firstTopicPanel(page);
  await expect(panel.locator("[data-feed-chrome]")).toBeVisible();
  await expect(panel.getByRole("progressbar")).toBeVisible();
  await expect(panel.locator("[data-story-segment]")).toHaveCount(CLIENT_SERVER_SLIDE_COUNT);
  await expect(slideCounter(panel)).toHaveText(`1 / ${CLIENT_SERVER_SLIDE_COUNT}`);
});

test("hook slide hides generic Die Frage label", async ({ page }) => {
  await page.goto("/topic/auth");
  const deck = slideDeck(page);
  await expect(deck.getByText("Die Frage", { exact: true })).toHaveCount(0);
  await expect(deck.getByText(/wirklich du bist/)).toBeVisible();
});

test("mobile swipe coach uses gesture copy", async ({ page }) => {
  await expect(page.getByText(/Wische ↑↓/)).toBeVisible();
  await swipeVerticalOnHeader(page, "up");
  await page.waitForTimeout(300);
  await expect(page.getByText(/Wische ↑↓/)).not.toBeVisible();
});

test("feed chrome hides topic title after first slide", async ({ page }) => {
  const panel = firstTopicPanel(page);
  await expect(panel.getByRole("heading", { level: 1 })).toBeVisible();
  await swipeHorizontalOnDeck(page, "left");
  await expect(panel.getByRole("heading", { level: 1 })).toHaveCount(0);
  await expect(slideCounter(panel)).toHaveText(`2 / ${CLIENT_SERVER_SLIDE_COUNT}`);
});

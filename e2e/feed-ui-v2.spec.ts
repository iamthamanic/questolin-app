import { test, expect } from "@playwright/test";
import { firstTopicPanel, slideCounter, slideDeck } from "./helpers/feed";
import { swipeHorizontalOnDeck, swipeVerticalOnHeader } from "./helpers/swipe";
import { useDesktopNav } from "./helpers/viewport";

const ONBOARDING_KEY = "questolin.onboarding.v1";

test.beforeEach(async ({ page }) => {
  await page.goto("/feed");
  await page.evaluate((key) => localStorage.removeItem(key), ONBOARDING_KEY);
});

test("immersive feed shows chrome overlay and progress bar", async ({ page }) => {
  const panel = firstTopicPanel(page);
  await expect(panel.locator("[data-feed-chrome]")).toBeVisible();
  await expect(panel.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(panel.getByRole("progressbar")).toBeVisible();
  await expect(slideCounter(panel)).toHaveText("1 / 7");
});

test("mobile hides Zurück/Weiter; swipe advances slide", async ({ page }) => {
  await page.goto("/topic/api");
  const deck = slideDeck(page);
  await expect(deck.getByRole("button", { name: "Weiter" })).toHaveCount(0);
  await expect(deck.getByRole("button", { name: "Zurück" })).toHaveCount(0);
  await swipeHorizontalOnDeck(page, "left");
  await expect(slideCounter(deck)).toHaveText("2 / 7");
});

test("desktop shows nav buttons", async ({ page }) => {
  await useDesktopNav(page);
  await page.goto("/topic/api");
  const deck = slideDeck(page);
  await expect(deck.getByRole("button", { name: "Weiter" })).toBeVisible();
});

test("swipe coach hint dismisses after topic change", async ({ page }) => {
  await page.goto("/feed");
  await expect(page.getByText(/Nächstes Thema/)).toBeVisible();
  await swipeVerticalOnHeader(page, "up");
  await expect(page.getByText(/Nächstes Thema/)).toHaveCount(0);
});

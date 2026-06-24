import { test, expect } from "@playwright/test";
import { useDesktopNav } from "./helpers/viewport";

const PROGRESS_KEY = "questolin.progress.v1";

test("home shows start screen with collection CTA", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Was lernst du heute/i })).toBeVisible();
  await expect(page.getByTestId("home-collection-grundlagen")).toBeVisible();
  await expect(page.getByTestId("home-all-topics")).toBeVisible();
  await expect(page.locator("[data-topic-deck]")).toHaveCount(0);
});

test("collection CTA opens feed", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("home-collection-grundlagen").click();
  await expect(page).toHaveURL(/\/feed\?collection=grundlagen/);
  await expect(page.locator("[data-topic-deck]").first()).toBeVisible();
});

test("legacy ?collection= redirects to feed", async ({ page }) => {
  await page.goto("/?collection=grundlagen");
  await expect(page).toHaveURL(/\/feed\?collection=grundlagen/);
});

test("resume CTA appears after progress", async ({ page }) => {
  await useDesktopNav(page);
  await page.goto("/topic/api");
  await page.getByRole("button", { name: "Weiter" }).click();
  await page.goto("/");
  await expect(page.getByTestId("home-resume")).toBeVisible();
  await expect(page.getByTestId("home-resume")).toContainText(/Slide 2\/7/);
});

test("feed Questolin brand links home", async ({ page }) => {
  await page.goto("/feed");
  await page.locator("[data-feed-chrome]").getByRole("link", { name: "Questolin" }).first().click();
  await expect(page).toHaveURL("/");
});

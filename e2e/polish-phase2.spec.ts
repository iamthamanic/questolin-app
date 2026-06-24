import { test, expect } from "@playwright/test";
import { useDesktopNav } from "./helpers/viewport";
import { slideDeck } from "./helpers/feed";

test("slide progress bar is exposed to assistive tech", async ({ page }) => {
  await page.goto("/topic/api");
  const deck = slideDeck(page);
  const bar = deck.getByRole("progressbar");
  await expect(bar).toHaveAttribute("aria-valuenow", "1");
  await expect(bar).toHaveAttribute("aria-valuemax", "9");
});

test("renders markdown bold in slide body", async ({ page }) => {
  await useDesktopNav(page);
  await page.goto("/topic/api");
  await page.getByRole("button", { name: "Weiter" }).click();
  await expect(page.getByText("definierte Schnittstelle").first()).toBeVisible();
  await expect(
    page.locator("strong", { hasText: "definierte Schnittstelle" }).first(),
  ).toBeVisible();
});

test("code_read and code_fix slides render on git topic", async ({ page }) => {
  await useDesktopNav(page);
  await page.goto("/topic/git");
  const deck = page.locator("[data-slide-deck]");

  const weiter = deck.getByRole("button", { name: "Weiter" });
  for (let i = 0; i < 6; i++) {
    await weiter.click();
  }
  await expect(deck.locator("pre code").filter({ hasText: /# On branch main/ })).toBeVisible();

  await weiter.click();
  await expect(page.getByText("Welche Version ist korrekt?")).toBeVisible();
  await deck
    .getByRole("button", { name: /git commit -m "Update README"/i })
    .click();
  await expect(page.getByText(/add staged/i)).toBeVisible();
});

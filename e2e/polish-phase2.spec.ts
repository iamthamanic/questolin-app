import { test, expect } from "@playwright/test";

test("progress dots meet 44px touch target", async ({ page }) => {
  await page.goto("/topic/api");
  const dot = page
    .locator("[data-slide-deck]")
    .getByRole("button", { name: /Slide 1:/i });
  const box = await dot.boundingBox();
  expect(box?.width).toBeGreaterThanOrEqual(44);
  expect(box?.height).toBeGreaterThanOrEqual(44);
});

test("renders markdown bold in slide body", async ({ page }) => {
  await page.goto("/topic/api");
  await page.getByRole("button", { name: "Weiter" }).click();
  await expect(page.getByText("definierte Schnittstelle").first()).toBeVisible();
  await expect(
    page.locator("strong", { hasText: "definierte Schnittstelle" }).first(),
  ).toBeVisible();
});

test("code_read and code_fix slides render on git topic", async ({ page }) => {
  await page.goto("/topic/git");
  const deck = page.locator("[data-slide-deck]");

  await deck.getByRole("button", { name: "Slide 7: Code lesen: Status" }).click();
  await expect(deck.locator("pre code").filter({ hasText: /# On branch main/ })).toBeVisible();

  await deck.getByRole("button", { name: "Slide 8: Code reparieren: Erster Commit" }).click();
  await expect(page.getByText("Welche Version ist korrekt?")).toBeVisible();
  await deck
    .getByRole("button", { name: /git commit -m "Update README"/i })
    .click();
  await expect(page.getByText(/add staged/i)).toBeVisible();
});

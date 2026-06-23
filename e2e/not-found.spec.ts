import { test, expect } from "@playwright/test";

test("invalid topic shows German 404 (T-06)", async ({ page }) => {
  await page.goto("/topic/xyz");

  await expect(
    page.getByRole("heading", { name: "Seite nicht gefunden" }),
  ).toBeVisible();
  await expect(
    page.getByText("Dieses Lern-Thema existiert nicht oder wurde entfernt."),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Zurück zum Feed" }),
  ).toBeVisible();
});

import { test, expect } from "@playwright/test";
import { slideDeck } from "./helpers/feed";
import { swipeHorizontalOnDeck } from "./helpers/swipe";

test("quiz slide shows one question with full-width options", async ({ page }) => {
  await page.goto("/topic/auth");
  const deck = slideDeck(page);

  for (let i = 0; i < 6; i++) {
    await swipeHorizontalOnDeck(page, "left");
  }

  await expect(deck.getByText(/Frage 1 \/ 3/)).toBeVisible();
  await expect(
    deck.getByRole("button", { name: /AuthN = Wer bist du/ }),
  ).toBeVisible();

  await deck.getByRole("button", { name: /AuthN = Wer bist du/ }).click();
  await expect(deck.getByText(/Identität vs. Berechtigung/)).toBeVisible();
  await deck.getByRole("button", { name: "Nächste Frage" }).click();

  await expect(deck.getByText(/Frage 2 \/ 3/)).toBeVisible();
});

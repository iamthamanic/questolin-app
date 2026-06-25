import { test, expect } from "@playwright/test";
import { slideDeck } from "../../e2e/helpers/feed";
import { swipeHorizontalOnDeck } from "../../e2e/helpers/swipe";
import path from "path";

const EVIDENCE_DIR = ".qa/evidence/quiz-correctness-level-badge";
const LEVEL_ONBOARDING_KEY = "questolin.onboarding.level.v1";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate((key) => localStorage.setItem(key, "1"), LEVEL_ONBOARDING_KEY);
});

test("LevelBadge is visible on home and topic pages", async ({ page }) => {
  await page.goto("/");
  const badge = page.getByRole("button", { name: /Level-Fortschritt anzeigen/i });
  await expect(badge).toBeVisible();
  await expect(badge).toContainText(/Level \d+/);
  await page.screenshot({ path: path.join(EVIDENCE_DIR, "01-home-level-badge.png"), fullPage: true });

  await page.goto("/topic/api");
  await expect(page.getByRole("button", { name: /Level-Fortschritt anzeigen/i })).toBeVisible();
  await page.screenshot({ path: path.join(EVIDENCE_DIR, "02-topic-level-badge.png"), fullPage: true });
});

test("quiz requires all answers to be correct and allows retrying wrong answers", async ({ page }) => {
  await page.goto("/topic/auth");
  const deck = slideDeck(page);

  // Advance to quiz slide (slide index 6, 0-based)
  for (let i = 0; i < 6; i++) {
    await swipeHorizontalOnDeck(page, "left");
  }

  await expect(deck.getByText(/Frage 1 \/ 3/)).toBeVisible();
  await page.screenshot({ path: path.join(EVIDENCE_DIR, "03-quiz-question-1.png"), fullPage: true });

  // Pick a wrong answer first
  await deck.getByRole("button", { name: /AuthN = Passwort hashen/i }).click();
  await expect(deck.locator("[class*='feedbackBad']").getByText(/Authentifizierung und Autorisierung sind zwei getrennte Schritte/)).toBeVisible();
  // No "Nächste Frage" yet because answer is wrong
  await expect(deck.getByRole("button", { name: "Nächste Frage" })).not.toBeVisible();
  await page.screenshot({ path: path.join(EVIDENCE_DIR, "04-wrong-answer-retryable.png"), fullPage: true });

  // Now pick the correct answer
  await deck.getByRole("button", { name: /AuthN = Wer bist du/ }).click();
  await expect(deck.getByText(/Genau — Identität vs. Berechtigung./)).toBeVisible();
  await deck.getByRole("button", { name: "Nächste Frage" }).click();

  await expect(deck.getByText(/Frage 2 \/ 3/)).toBeVisible();
  await page.screenshot({ path: path.join(EVIDENCE_DIR, "05-next-question-unlocked.png"), fullPage: true });
});

test("tapping LevelBadge opens progress sheet", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Level-Fortschritt anzeigen/i }).click();
  await expect(page.getByRole("heading", { name: /Dein Fortschritt/i })).toBeVisible();
  await page.screenshot({ path: path.join(EVIDENCE_DIR, "06-level-progress-sheet.png"), fullPage: true });
});

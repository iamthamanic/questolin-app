import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { swipeHorizontalOnDeck, swipeVerticalOnHeader } from '../../e2e/helpers/swipe';
import { firstTopicPanel, slideCounter, slideDeck } from '../../e2e/helpers/feed';

const SLUG = 'swipe-feed-hardening';
const EVIDENCE_DIR = `.qa/evidence/${SLUG}`;
const ONBOARDING_KEY = 'questolin.onboarding.v1';
const LEVEL_ONBOARDING_KEY = 'questolin.onboarding.level.v1';
const API_SLIDE_COUNT = 9;

test.beforeAll(() => {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
});

test.beforeEach(async ({ page }) => {
  await page.goto('/feed');
  await page.evaluate((key) => localStorage.removeItem(key), ONBOARDING_KEY);
  await page.evaluate((key) => localStorage.setItem(key, '1'), LEVEL_ONBOARDING_KEY);
  await page.goto('/feed');
});

test.describe('Swipe feed hardening', () => {
  test('feed lists multiple topics with swipe hint', async ({ page }) => {
    await page.goto('/feed');
    const first = firstTopicPanel(page);
    await expect(first.locator('[data-feed-chrome]')).toBeVisible();
    await expect(first.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByText(/Wische ↑↓|Nächstes Thema/)).toBeVisible();

    await page.screenshot({
      path: path.join(EVIDENCE_DIR, '01-two-topics-feed.png'),
      fullPage: true,
    });
  });

  test('vertical swipe switches topic', async ({ page }) => {
    await page.goto('/feed');
    const first = firstTopicPanel(page);
    await expect(first).toBeVisible();
    await swipeVerticalOnHeader(page, 'up');
    const second = page.locator('section[aria-label]').nth(1);
    await expect(second).toBeVisible();
    await expect(slideCounter(second)).toHaveText(/1 \/ \d+/);

    await page.screenshot({
      path: path.join(EVIDENCE_DIR, '02-vertical-topic-swipe.png'),
      fullPage: true,
    });
  });

  test('horizontal touch swipe advances slide', async ({ page }) => {
    await page.goto('/topic/api');
    const deck = slideDeck(page);
    await expect(slideCounter(deck)).toHaveText(`1 / ${API_SLIDE_COUNT}`);
    await swipeHorizontalOnDeck(page, 'left');
    await expect(slideCounter(deck)).toHaveText(`2 / ${API_SLIDE_COUNT}`);

    await page.screenshot({
      path: path.join(EVIDENCE_DIR, '03-horizontal-touch-swipe.png'),
      fullPage: true,
    });
  });

  test('horizontal swipe on deck does not change topic', async ({ page }) => {
    await page.goto('/topic/api');
    const deck = slideDeck(page);
    await swipeHorizontalOnDeck(page, 'left');
    await expect(slideCounter(deck)).toHaveText(`2 / ${API_SLIDE_COUNT}`);
    await expect(page.getByRole('link', { name: '← Start' })).toBeVisible();
  });

  test('invalid topic id returns 404', async ({ page }) => {
    await page.goto('/topic/xyz');
    await expect(
      page.getByRole('heading', { name: 'Seite nicht gefunden' }),
    ).toBeVisible();
    await expect(
      page.getByText('Dieses Lern-Thema existiert nicht oder wurde entfernt.'),
    ).toBeVisible();
  });

  test('malformed topic id returns 404', async ({ page }) => {
    await page.goto('/topic/not-valid!');
    await expect(
      page.getByRole('heading', { name: 'Seite nicht gefunden' }),
    ).toBeVisible();
  });
});

import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { swipeHorizontalOnDeck, swipeVerticalOnHeader } from '../../e2e/helpers/swipe';
import { firstTopicPanel, slideCounter, slideDeck, topicPanel } from '../../e2e/helpers/feed';

const SLUG = 'swipe-feed-hardening';
const EVIDENCE_DIR = `.qa/evidence/${SLUG}`;

test.beforeAll(() => {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
});

test.describe('Swipe feed hardening', () => {
  test('feed lists multiple topics with swipe hint', async ({ page }) => {
    await page.goto('/');
    const first = firstTopicPanel(page);
    await expect(first.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByText(/Thema 1\/\d+/)).toBeVisible();
    await expect(page.getByText(/↑↓ Nächstes Thema/)).toBeVisible();

    await page.screenshot({
      path: path.join(EVIDENCE_DIR, '01-two-topics-feed.png'),
      fullPage: true,
    });
  });

  test('vertical swipe switches topic', async ({ page }) => {
    await page.goto('/');
    const first = firstTopicPanel(page);
    await expect(first).toBeVisible();
    await swipeVerticalOnHeader(page, 'up');
    const second = page.locator('section[aria-label]').nth(1);
    await expect(second).toBeVisible();
    await expect(slideCounter(second)).toHaveText('1 / 7');

    await page.screenshot({
      path: path.join(EVIDENCE_DIR, '02-vertical-topic-swipe.png'),
      fullPage: true,
    });
  });

  test('horizontal touch swipe advances slide', async ({ page }) => {
    await page.goto('/topic/api');
    const deck = slideDeck(page);
    await expect(slideCounter(deck)).toHaveText('1 / 7');
    await swipeHorizontalOnDeck(page, 'left');
    await expect(slideCounter(deck)).toHaveText('2 / 7');

    await page.screenshot({
      path: path.join(EVIDENCE_DIR, '03-horizontal-touch-swipe.png'),
      fullPage: true,
    });
  });

  test('horizontal swipe on deck does not change topic', async ({ page }) => {
    await page.goto('/topic/api');
    const deck = slideDeck(page);
    await swipeHorizontalOnDeck(page, 'left');
    await expect(slideCounter(deck)).toHaveText('2 / 7');
    await expect(page.getByRole('link', { name: '← Feed' })).toBeVisible();
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

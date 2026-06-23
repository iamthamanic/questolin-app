import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { swipeHorizontalOnDeck, swipeVerticalOnHeader } from '../../e2e/helpers/swipe';
import { slideCounter, topicPanel } from '../../e2e/helpers/feed';

const SLUG = 'swipe-feed-hardening';
const EVIDENCE_DIR = `.qa/evidence/${SLUG}`;

test.beforeAll(() => {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
});

test.describe('Swipe feed hardening', () => {
  test('feed lists two topics with swipe hint', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Was ist eine API/i })).toBeVisible();
    await expect(page.getByText('Thema 1/2')).toBeVisible();
    await expect(page.getByText(/↑↓ Nächstes Thema/)).toBeVisible();

    await page.screenshot({
      path: path.join(EVIDENCE_DIR, '01-two-topics-feed.png'),
      fullPage: true,
    });
  });

  test('vertical swipe switches topic', async ({ page }) => {
    await page.goto('/');
    const api = topicPanel(page, /Was ist eine API/i);
    await expect(api).toBeVisible();
    await swipeVerticalOnHeader(page, 'up');
    const db = topicPanel(page, /Was ist eine Datenbank/i);
    await expect(db).toBeVisible();
    await expect(slideCounter(db)).toHaveText('1 / 7');

    await page.screenshot({
      path: path.join(EVIDENCE_DIR, '02-vertical-topic-swipe.png'),
      fullPage: true,
    });
  });

  test('horizontal touch swipe advances slide', async ({ page }) => {
    await page.goto('/');
    const api = topicPanel(page, /Was ist eine API/i);
    await expect(slideCounter(api)).toHaveText('1 / 7');
    await swipeHorizontalOnDeck(page, 'left');
    await expect(slideCounter(api)).toHaveText('2 / 7');

    await page.screenshot({
      path: path.join(EVIDENCE_DIR, '03-horizontal-touch-swipe.png'),
      fullPage: true,
    });
  });

  test('horizontal swipe on deck does not change topic', async ({ page }) => {
    await page.goto('/');
    const api = topicPanel(page, /Was ist eine API/i);
    await swipeHorizontalOnDeck(page, 'left');
    await expect(slideCounter(api)).toHaveText('2 / 7');
    await expect(api.getByRole('heading', { level: 1 })).toHaveText('Was ist eine API?');
  });

  test('invalid topic id returns 404', async ({ page }) => {
    const response = await page.goto('/topic/xyz');
    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
  });

  test('malformed topic id returns 404', async ({ page }) => {
    const response = await page.goto('/topic/not-valid!');
    expect(response?.status()).toBe(404);
  });
});

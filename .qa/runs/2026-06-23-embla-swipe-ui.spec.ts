import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { firstTopicPanel, slideCounter, slideDeck } from '../../e2e/helpers/feed';
import { swipeHorizontalOnDeck } from '../../e2e/helpers/swipe';
import { useDesktopNav } from '../../e2e/helpers/viewport';

const SLUG = 'embla-swipe-ui';
const EVIDENCE_DIR = `.qa/evidence/${SLUG}`;
const ONBOARDING_KEY = 'questolin.onboarding.v1';
const LEVEL_ONBOARDING_KEY = 'questolin.onboarding.level.v1';
const FIRST_TOPIC_SLIDE_COUNT = 8;
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

test.describe('Embla Swipe UI acceptance', () => {
  test('feed shows full-viewport topic with horizontal slide deck', async ({ page }) => {
    await page.goto('/feed');
    const first = firstTopicPanel(page);
    await expect(first.locator('[data-feed-chrome]')).toBeVisible();
    await expect(first.locator('[data-feed-chrome]').getByText('Questolin')).toBeVisible();
    await expect(first.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(slideCounter(first)).toHaveText(`1 / ${FIRST_TOPIC_SLIDE_COUNT}`);

    await page.screenshot({
      path: path.join(EVIDENCE_DIR, '01-feed-first-slide.png'),
      fullPage: true,
    });
  });

  test('horizontal Weiter advances slide counter', async ({ page }) => {
    await useDesktopNav(page);
    await page.goto('/topic/api');
    const deck = slideDeck(page);
    const weiter = deck.getByRole('button', { name: 'Weiter' });
    await expect(weiter).toBeEnabled();
    await weiter.click();
    await expect(slideCounter(deck)).toHaveText(`2 / ${API_SLIDE_COUNT}`);

    await page.screenshot({
      path: path.join(EVIDENCE_DIR, '02-horizontal-next-slide.png'),
      fullPage: true,
    });
  });

  test('horizontal Zurück disabled on first slide', async ({ page }) => {
    await useDesktopNav(page);
    await page.goto('/topic/api');
    const deck = slideDeck(page);
    await expect(deck.getByRole('button', { name: 'Zurück' })).toBeDisabled();
  });

  test('last slide disables Weiter', async ({ page }) => {
    await useDesktopNav(page);
    await page.goto('/topic/api');
    const deck = slideDeck(page);
    const weiter = deck.getByRole('button', { name: 'Weiter' });
    for (let i = 0; i < API_SLIDE_COUNT - 1; i++) {
      await weiter.click();
    }
    await expect(slideCounter(deck)).toHaveText(`${API_SLIDE_COUNT} / ${API_SLIDE_COUNT}`);
    await expect(weiter).toBeDisabled();

    await page.screenshot({
      path: path.join(EVIDENCE_DIR, '03-last-slide-disabled-next.png'),
      fullPage: true,
    });
  });

  test('progress bar reflects slide index after swipe', async ({ page }) => {
    await page.goto('/topic/api');
    const deck = slideDeck(page);
    await swipeHorizontalOnDeck(page, 'left');
    await expect(slideCounter(deck)).toHaveText(`2 / ${API_SLIDE_COUNT}`);
    await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '2');

    await page.screenshot({
      path: path.join(EVIDENCE_DIR, '04-dot-navigation.png'),
      fullPage: true,
    });
  });

  test('quiz slide allows option click without crash', async ({ page }) => {
    await useDesktopNav(page);
    await page.goto('/topic/api');
    const deck = slideDeck(page);
    const weiter = deck.getByRole('button', { name: 'Weiter' });
    for (let i = 0; i < API_SLIDE_COUNT - 1; i++) {
      await weiter.click();
    }
    const option = deck.getByRole('button', {
      name: /Schnittstelle, über die Programme miteinander kommunizieren/i,
    });
    await option.click();
    await expect(option).toBeVisible();

    await page.screenshot({
      path: path.join(EVIDENCE_DIR, '05-quiz-interaction.png'),
      fullPage: true,
    });
  });

  test('topic deep link uses horizontal deck', async ({ page }) => {
    await useDesktopNav(page);
    await page.goto('/topic/api');
    const deck = slideDeck(page);
    await expect(page.getByRole('link', { name: '← Start' })).toBeVisible();
    await expect(slideCounter(deck)).toHaveText(`1 / ${API_SLIDE_COUNT}`);
    await page.getByRole('button', { name: 'Weiter' }).click();
    await expect(slideCounter(deck)).toHaveText(`2 / ${API_SLIDE_COUNT}`);

    await page.screenshot({
      path: path.join(EVIDENCE_DIR, '06-topic-deep-link.png'),
      fullPage: true,
    });
  });
});

import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { slideCounter, topicPanel } from '../../e2e/helpers/feed';

const SLUG = 'embla-swipe-ui';
const EVIDENCE_DIR = `.qa/evidence/${SLUG}`;

test.beforeAll(() => {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
});

test.describe('Embla Swipe UI acceptance', () => {
  test('feed shows full-viewport topic with horizontal slide deck', async ({ page }) => {
    await page.goto('/');
    const api = topicPanel(page, /Was ist eine API/i);
    await expect(api.locator('header p').filter({ hasText: 'Questolin' })).toBeVisible();
    await expect(api.getByRole('heading', { level: 1, name: /Was ist eine API/i })).toBeVisible();
    await expect(slideCounter(api)).toHaveText('1 / 7');

    await page.screenshot({
      path: path.join(EVIDENCE_DIR, '01-feed-first-slide.png'),
      fullPage: true,
    });
  });

  test('horizontal Weiter advances slide counter', async ({ page }) => {
    await page.goto('/');
    const api = topicPanel(page, /Was ist eine API/i);
    const weiter = api.getByRole('button', { name: 'Weiter' });
    await expect(weiter).toBeEnabled();
    await weiter.click();
    await expect(slideCounter(api)).toHaveText('2 / 7');

    await page.screenshot({
      path: path.join(EVIDENCE_DIR, '02-horizontal-next-slide.png'),
      fullPage: true,
    });
  });

  test('horizontal Zurück disabled on first slide', async ({ page }) => {
    await page.goto('/');
    const api = topicPanel(page, /Was ist eine API/i);
    await expect(api.getByRole('button', { name: 'Zurück' })).toBeDisabled();
  });

  test('last slide disables Weiter', async ({ page }) => {
    await page.goto('/');
    const api = topicPanel(page, /Was ist eine API/i);
    const weiter = api.getByRole('button', { name: 'Weiter' });
    for (let i = 0; i < 6; i++) {
      await weiter.click();
    }
    await expect(slideCounter(api)).toHaveText('7 / 7');
    await expect(weiter).toBeDisabled();

    await page.screenshot({
      path: path.join(EVIDENCE_DIR, '03-last-slide-disabled-next.png'),
      fullPage: true,
    });
  });

  test('dot navigation jumps to slide', async ({ page }) => {
    await page.goto('/');
    const api = topicPanel(page, /Was ist eine API/i);
    await api.getByRole('button', { name: /Slide 3:/i }).click();
    await expect(slideCounter(api)).toHaveText('3 / 7');

    await page.screenshot({
      path: path.join(EVIDENCE_DIR, '04-dot-navigation.png'),
      fullPage: true,
    });
  });

  test('quiz slide allows option click without crash', async ({ page }) => {
    await page.goto('/');
    const api = topicPanel(page, /Was ist eine API/i);
    const weiter = api.getByRole('button', { name: 'Weiter' });
    for (let i = 0; i < 6; i++) {
      await weiter.click();
    }
    const option = api.getByRole('button', {
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
    await page.goto('/topic/api');
    await expect(page.getByRole('link', { name: '← Feed' })).toBeVisible();
    await expect(page.getByText('1 / 7')).toBeVisible();
    await page.getByRole('button', { name: 'Weiter' }).click();
    await expect(page.getByText('2 / 7')).toBeVisible();

    await page.screenshot({
      path: path.join(EVIDENCE_DIR, '06-topic-deep-link.png'),
      fullPage: true,
    });
  });
});

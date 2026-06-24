import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { firstTopicPanel } from './helpers/feed';

const EVIDENCE_DIR = '.qa/evidence/smoke';

test.beforeAll(() => {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
});

test('app loads without console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto('/feed');
  const first = firstTopicPanel(page);
  await expect(first.locator('[data-feed-chrome]')).toBeVisible();
  await expect(first.locator('[data-feed-chrome]').getByText('Questolin')).toBeVisible();
  await expect(first.getByRole('heading', { level: 1 })).toBeVisible();

  await page.screenshot({
    path: path.join(EVIDENCE_DIR, '01-app-loads.png'),
    fullPage: true,
  });

  expect(errors, `Console errors: ${errors.join(', ')}`).toEqual([]);
});

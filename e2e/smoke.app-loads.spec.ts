import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const EVIDENCE_DIR = '.qa/evidence/smoke';

test.beforeAll(() => {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
});

import { slideCounter, topicPanel } from './helpers/feed';

test('app loads without console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto('/');
  const api = topicPanel(page, /Was ist eine API/i);
  await expect(api.locator('header p').filter({ hasText: 'Questolin' })).toBeVisible();
  await expect(api.getByRole('heading', { level: 1, name: /Was ist eine API/i })).toBeVisible();

  await page.screenshot({
    path: path.join(EVIDENCE_DIR, '01-app-loads.png'),
    fullPage: true,
  });

  expect(errors, `Console errors: ${errors.join(', ')}`).toEqual([]);
});

import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

const EVIDENCE_DIR = ".qa/evidence/questolin-chat-ui";

test.beforeAll(() => {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
});

test("opens Questolin chat and sends a question (mocked tutor API)", async ({
  page,
}) => {
  await page.route("**/api/tutor", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        reply: "Eine API ist eine Schnittstelle zwischen Programmen.",
      }),
    });
  });

  await page.goto("/topic/api");

  await expect(
    page.getByRole("button", { name: "Questolin fragen" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Questolin fragen" }).click();

  await expect(page.getByRole("heading", { name: "Questolin" })).toBeVisible();

  const sheet = page.getByRole("dialog");
  const input = sheet.getByRole("textbox", { name: "Frage an Questolin" });
  await input.fill("Was ist eine API?");
  await sheet.getByRole("button", { name: "Senden", exact: true }).click();

  await expect(
    page.getByText("Eine API ist eine Schnittstelle zwischen Programmen."),
  ).toBeVisible({ timeout: 10_000 });

  await page.screenshot({
    path: path.join(EVIDENCE_DIR, "01-chat-reply.png"),
    fullPage: true,
  });
});

test("topic deck shows Questolin FAB", async ({ page }) => {
  await page.goto("/topic/api");
  await expect(
    page.getByRole("button", { name: "Questolin fragen" }),
  ).toBeVisible();
});

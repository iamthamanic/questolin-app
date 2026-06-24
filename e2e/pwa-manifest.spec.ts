import { test, expect } from "@playwright/test";

test("PWA manifest is served with Questolin metadata", async ({ request }) => {
  const res = await request.get("/manifest.webmanifest");
  expect(res.ok()).toBeTruthy();

  const manifest = (await res.json()) as {
    name?: string;
    short_name?: string;
    display?: string;
    icons?: { sizes: string }[];
  };

  expect(manifest.name).toContain("Questolin");
  expect(manifest.short_name).toBe("Questolin");
  expect(manifest.display).toBe("standalone");
  expect(manifest.icons?.some((i) => i.sizes === "512x512")).toBe(true);
});

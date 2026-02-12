import { expect, test } from "@playwright/test";
import "dotenv/config";

test("authenticate to storefront", async ({ page }) => {
  const { SHOPIFY_STOREFRONT_URL, SHOPIFY_STOREFRONT_PASSWORD } = process.env;

  if (!SHOPIFY_STOREFRONT_URL || !SHOPIFY_STOREFRONT_PASSWORD) {
    throw new Error("Missing SHOPIFY_STOREFRONT_URL or SHOPIFY_STOREFRONT_PASSWORD in .env");
  }

  await page.goto(SHOPIFY_STOREFRONT_URL);

  // Wait for password input to appear
  await page.waitForSelector('input[type="password"]');

  await page.fill('input[type="password"]', SHOPIFY_STOREFRONT_PASSWORD);
  await page.click('button[type="submit"]');

  // Wait until we're actually inside the store
  await expect(page).toHaveURL(/myshopify.com/);

  // Save authenticated state
  await page.context().storageState({ path: "playwright/.auth/store.json" });
});

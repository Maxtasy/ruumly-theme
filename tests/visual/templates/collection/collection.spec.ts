import { expect, test } from "@playwright/test";
import { maskSelectors } from "../../../masks";
import { scrollToBottomAndBack } from "../../../util";

test(`collection page visual regression`, async ({ page }) => {
  await page.goto("/collections/gaming-chairs");

  await expect(page.locator("body")).toBeVisible();

  await scrollToBottomAndBack(page);

  await expect(page).toHaveScreenshot(`collection.png`, {
    fullPage: true,
    timeout: 10_000,
    mask: maskSelectors.map((selector) => page.locator(selector)),
  });
});

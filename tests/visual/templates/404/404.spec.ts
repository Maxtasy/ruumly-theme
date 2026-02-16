import { expect, test } from "@playwright/test";
import { maskSelectors } from "../../../masks";
import { scrollToBottomAndBack } from "../../../util";

test(`404 page visual regression`, async ({ page }) => {
  await page.goto("/404");

  await expect(page.locator("body")).toBeVisible();

  await scrollToBottomAndBack(page);

  await expect(page).toHaveScreenshot(`404.png`, {
    fullPage: true,
    timeout: 10_000,
    mask: maskSelectors.map((selector) => page.locator(selector)),
  });
});

import { expect, test } from "@playwright/test";
import { maskSelectors } from "../../../masks";
import { scrollToBottomAndBack } from "../../../util";

test(`product page visual regression`, async ({ page }) => {
  await page.goto("/products/styrspel-gaming-chair?variant=58096118661469");

  await expect(page.locator("body")).toBeVisible();

  await scrollToBottomAndBack(page);

  await expect(page).toHaveScreenshot(`product.png`, {
    fullPage: true,
    timeout: 10_000,
    mask: maskSelectors.map((selector) => page.locator(selector)),
  });
});

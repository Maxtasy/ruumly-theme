import { Page } from "@playwright/test";

export async function scrollToBottomAndBack(page: Page) {
  const scrollOnce = async () => {
    await page.evaluate(async () => {
      await new Promise<void>((resolve) => {
        const distance = 300;
        const interval = 80;
        const timer = setInterval(() => {
          window.scrollBy(0, distance);
          if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, interval);
      });
    });

    await page.waitForLoadState("networkidle");
  };

  // Do the scrolling twice to ensure we get all the lazy-loaded content.
  await scrollOnce();
  await scrollOnce();

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));

  await page.waitForLoadState("networkidle");
}

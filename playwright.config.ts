import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  use: {
    baseURL: process.env.SHOPIFY_STOREFRONT_URL,
    viewport: { width: 1980, height: 1080 },
    screenshot: "only-on-failure",
  },
  reporter: [["list"], ["html"]],
  // Run authentication once before all tests
  projects: [
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: "mobile-chrome",
      use: {
        ...devices["Pixel 5"],
        storageState: "playwright/.auth/store.json",
      },
      dependencies: ["setup"],
    },
    {
      name: "desktop-chrome",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/store.json",
      },
      dependencies: ["setup"],
    },
    {
      name: "mobile-safari",
      use: {
        ...devices["iPhone 14 Pro"],
        storageState: "playwright/.auth/store.json",
      },
      dependencies: ["setup"],
    },
    {
      name: "desktop-safari",
      use: {
        ...devices["Desktop Safari"],
        storageState: "playwright/.auth/store.json",
      },
      dependencies: ["setup"],
    },
  ],
});

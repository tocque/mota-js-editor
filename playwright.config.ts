import { defineConfig, devices } from "@playwright/test";

const PORT = 1055;
const baseURL = `http://127.0.0.1:${PORT}`;
const useSystemChrome = process.env.PLAYWRIGHT_USE_SYSTEM_CHROME === "1" ||
  (!process.env.CI && process.platform === "darwin");

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    testIdAttribute: "data-test-id",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  webServer: {
    command: "pnpm dev -- --host 127.0.0.1",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: useSystemChrome ? "chrome" : "chromium",
      use: {
        ...devices["Desktop Chrome"],
        channel: useSystemChrome ? "chrome" : undefined,
      },
    },
  ],
});

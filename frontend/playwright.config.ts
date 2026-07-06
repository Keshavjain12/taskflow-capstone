import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [["html", { open: "never" }]],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    viewport: { width: 1280, height: 900 },
  },
  // devices["Desktop Chrome"] carries its own viewport (1280x720), and
  // spreading it here would silently override the taller viewport set in
  // `use` above (project-level `use` wins per-key over the global one).
  // Re-asserting viewport after the spread keeps our height in effect.
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 } },
    },
  ],
  webServer: process.env.CI
    ? undefined
    : {
        command: "npm run preview",
        url: "http://localhost:3000",
        reuseExistingServer: true,
      },
});

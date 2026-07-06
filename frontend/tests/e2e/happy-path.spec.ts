import { test, expect } from "@playwright/test";

/**
 * Full E2E happy path: register -> land on dashboard -> create a project ->
 * open the board -> create a task -> move it across statuses.
 * Requires the backend + frontend to be running (see docker-compose.yml).
 */
test.describe("TaskFlow happy path", () => {
  test("register, create a project, and create a task", async ({ page }) => {
    const uniqueEmail = `e2e-${Date.now()}@taskflow.dev`;

    await page.goto("/register");
    await page.getByLabel("Name").fill("E2E Tester");
    await page.getByLabel("Email").fill(uniqueEmail);
    await page.getByLabel("Password").fill("Password123!");
    await page.getByRole("button", { name: "Create account" }).click();

    await expect(page).toHaveURL(/\/projects$/);
    await expect(page.getByText("No projects yet")).toBeVisible();

    await page.getByRole("button", { name: "New project", exact: true }).click();
    await page.getByLabel("Name").fill("E2E Project");
    await page.getByRole("button", { name: "Create project" }).click();

    // Scoped to the project card's heading, since the dashboard's "Recent
    // activity" widget and sidebar "Recent" list can also render the same
    // project name as plain text elsewhere on the page.
    const projectCardHeading = page.getByRole("heading", { name: "E2E Project" });
    await expect(projectCardHeading).toBeVisible();
    await projectCardHeading.click();

    await expect(page).toHaveURL(/\/projects\/.+/);
    await page.getByRole("button", { name: "New task", exact: true }).click();
    await page.getByLabel("Title").fill("Write E2E coverage");
    await page.getByRole("button", { name: "Create task" }).click();

    await expect(page.getByText("Write E2E coverage")).toBeVisible();

    await page
      .getByLabel("Change status for Write E2E coverage")
      .selectOption("DONE");

    const doneHeader = page.getByRole("heading", { name: "Done" });
    const doneColumn = doneHeader.locator("xpath=..");
    await expect(doneColumn.getByText("1", { exact: true })).toBeVisible();
  });

  test("login page rejects invalid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("nobody@taskflow.dev");
    await page.getByLabel("Password").fill("wrong-password");
    await page.getByRole("button", { name: "Log in" }).click();
    await expect(page).toHaveURL(/\/login$/);
  });
});

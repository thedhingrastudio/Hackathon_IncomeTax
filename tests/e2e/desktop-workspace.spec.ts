import { expect, test, type Page, type TestInfo } from "@playwright/test";

function collectDiagnostics(page: Page) {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  const failedRequests: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
  page.on("pageerror", (error) => pageErrors.push(error.stack ?? error.message));
  page.on("requestfailed", (request) => {
    if (request.failure()?.errorText === "net::ERR_ABORTED" && request.resourceType() === "fetch") return;
    failedRequests.push(`${request.method()} ${request.url()}: ${request.failure()?.errorText ?? "unknown error"}`);
  });
  return { consoleErrors, pageErrors, failedRequests };
}

async function saveReviewScreenshot(page: Page, testInfo: TestInfo, name: string) {
  const path = testInfo.outputPath(`${name}.png`);
  await page.screenshot({ path, fullPage: true });
  await testInfo.attach(name, { path, contentType: "image/png" });
}

async function assertNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
}

test("desktop Assistance Home opens as a persistent split workspace", async ({ page }, testInfo) => {
  const diagnostics = collectDiagnostics(page);
  await page.goto("/");

  const portal = page.locator(".portal-workspace");
  const openButton = page.getByRole("button", { name: "Open assistance" });
  await expect(openButton).toBeVisible();
  await expect(openButton).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByRole("complementary", { name: "Assistance Workspace" })).toBeHidden();
  const closedPortal = await portal.boundingBox();
  expect(closedPortal).not.toBeNull();
  expect(closedPortal!.width / 1440).toBeGreaterThan(0.98);
  await assertNoHorizontalOverflow(page);
  await saveReviewScreenshot(page, testInfo, "dashboard-assistance-closed");

  await openButton.click();
  const workspace = page.getByRole("complementary", { name: "Assistance Workspace" });
  await expect(workspace).toBeVisible();
  await expect(workspace.getByRole("heading", { name: "Welcome, Rohan" })).toBeVisible();
  await expect(workspace.getByText("Outstanding Demand", { exact: true })).toBeVisible();
  await expect(workspace.getByText("₹18,420", { exact: true })).toBeVisible();
  await expect(workspace.getByText("AY 2026–27", { exact: true })).toBeVisible();
  await expect(workspace.getByText("Action required", { exact: true })).toBeVisible();
  await expect(workspace.getByText("No upcoming deadlines in the current demo data.", { exact: true })).toBeVisible();
  await expect(workspace.getByLabel("Ask about your taxes")).toBeVisible();
  await expect(page.getByRole("heading", { name: "1 item needs your attention" })).toBeVisible();
  await expect(page.locator(".desktop-workspace")).toHaveClass(/is-open/);
  await expect(page.locator(".desktop-portal-links")).toBeHidden();
  await expect(page.getByRole("button", { name: /menu/i })).toBeVisible();

  const openPortal = await portal.boundingBox();
  const openWorkspace = await workspace.boundingBox();
  expect(openPortal).not.toBeNull();
  expect(openWorkspace).not.toBeNull();
  const combinedWidth = openPortal!.width + openWorkspace!.width;
  expect(openPortal!.width / combinedWidth).toBeGreaterThan(0.44);
  expect(openPortal!.width / combinedWidth).toBeLessThan(0.50);
  expect(openWorkspace!.width / combinedWidth).toBeGreaterThan(0.50);
  expect(openWorkspace!.width / combinedWidth).toBeLessThan(0.56);
  await assertNoHorizontalOverflow(page);
  await saveReviewScreenshot(page, testInfo, "dashboard-assistance-open");

  await workspace.getByRole("link", { name: "Understand this" }).click();
  await expect(page).toHaveURL(/\/pending-actions\/demand$/);
  await expect(page.getByRole("heading", { name: "Outstanding Demand" })).toBeVisible();
  await expect(workspace).toBeVisible();
  await saveReviewScreenshot(page, testInfo, "outstanding-demand-assistance-open");

  await workspace.getByRole("button", { name: "Close assistance" }).click();
  await expect(workspace).toBeHidden();
  await expect(openButton).toBeFocused();
  const reopenedPortal = await portal.boundingBox();
  expect(reopenedPortal!.width / 1440).toBeGreaterThan(0.98);

  await openButton.click();
  await expect(workspace.getByRole("button", { name: "Close assistance" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(workspace).toBeHidden();
  await expect(openButton).toBeFocused();

  expect(diagnostics.consoleErrors.filter((message) => /hydration|hydrated|server rendered html/i.test(message))).toEqual([]);
  expect(diagnostics.consoleErrors).toEqual([]);
  expect(diagnostics.pageErrors).toEqual([]);
  expect(diagnostics.failedRequests).toEqual([]);
});

test("workspace foundation has no horizontal overflow at 1150px", async ({ page }) => {
  const diagnostics = collectDiagnostics(page);
  await page.setViewportSize({ width: 1150, height: 900 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open assistance" }).click();
  await expect(page.getByRole("complementary", { name: "Assistance Workspace" })).toBeVisible();
  await expect(page.getByRole("complementary", { name: "Assistance Workspace" }).getByRole("heading", { name: "Welcome, Rohan" })).toBeVisible();
  await assertNoHorizontalOverflow(page);
  expect(diagnostics.consoleErrors).toEqual([]);
  expect(diagnostics.pageErrors).toEqual([]);
  expect(diagnostics.failedRequests).toEqual([]);
});

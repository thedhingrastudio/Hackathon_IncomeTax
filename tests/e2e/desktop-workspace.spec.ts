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
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();

  const portal = page.locator(".portal-workspace");
  const openButton = page.getByRole("button", { name: "Open assistance" });
  const assistanceHandle = page.locator(".assistance-handle");
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
  await expect(assistanceHandle).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator(".desktop-workspace")).toHaveClass(/is-open/);
  await expect(workspace).toBeVisible();
  await expect(workspace.getByRole("heading", { name: "Welcome, Rohan" })).toBeVisible();
  await expect(workspace.getByText("Outstanding Demand", { exact: true })).toBeVisible();
  await expect(workspace.getByText("₹18,420", { exact: true })).toBeVisible();
  await expect(workspace.getByText("AY 2026–27", { exact: true })).toBeVisible();
  await expect(workspace.getByText("Action required", { exact: true })).toBeVisible();
  await expect(workspace.getByText("No upcoming deadlines in the current demo data.", { exact: true })).toBeVisible();
  await expect(workspace.getByLabel("Ask about your taxes")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Outstanding Demand" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Account status" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Recent activity" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Quick access" })).toBeVisible();
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
  await saveReviewScreenshot(page, testInfo, "assistance-home-before-demand");

  await workspace.getByRole("button", { name: "Understand this" }).click();
  await expect(workspace.getByRole("heading", { name: "Checking why this is showing…" })).toBeVisible();
  await expect(workspace.getByText("Checking records connected to this demand", { exact: true })).toBeVisible();
  await saveReviewScreenshot(page, testInfo, "checking-connected-records");
  await expect(page).toHaveURL(/\/pending-actions\/demand$/);
  await expect(page.getByRole("heading", { name: "Outstanding Demand" })).toBeVisible();
  await expect(workspace).toBeVisible();
  await expect(workspace.getByRole("heading", { name: "Understanding your demand" })).toBeVisible();
  await expect(workspace.getByLabel("You paid: ₹18,420, Confirmed")).toBeVisible();
  await expect(workspace.getByLabel("Return recognised: ₹0")).toBeVisible();
  await expect(workspace.locator(".understanding-comparison").getByText("₹18,420", { exact: true })).toHaveCount(2);
  await expect(workspace.getByText("not counted", { exact: true })).toBeVisible();
  await expect(workspace.getByText("Your payment exists in Income Tax records, but it wasn't included when your return was processed.", { exact: true })).toBeVisible();
  await expect(workspace.getByLabel("Ask about your taxes")).toHaveAttribute("placeholder", "Ask a follow-up…");
  await expect(workspace.locator("[data-chat-message]" )).toHaveCount(0);
  const sourceTrigger = workspace.getByRole("button", { name: "Why we think this" });
  await expect(sourceTrigger).toHaveAttribute("aria-expanded", "false");
  await expect(workspace.getByText("These connected Income Tax records support the explanation.", { exact: true })).toBeHidden();
  await saveReviewScreenshot(page, testInfo, "understanding-surface");

  await sourceTrigger.click();
  await expect(sourceTrigger).toHaveAttribute("aria-expanded", "true");
  const sourceTrace = workspace.locator(".source-trace-content");
  for (const label of ["Payment", "Form 26AS", "Processed return", "Outstanding demand"]) await expect(sourceTrace.getByText(label, { exact: true })).toBeVisible();
  await saveReviewScreenshot(page, testInfo, "why-we-think-this-expanded");

  await workspace.getByRole("button", { name: "Fix this" }).click();
  await expect(page).toHaveURL(/\/pending-actions\/demand$/);
  await expect(workspace.getByRole("heading", { name: "Here's what needs to happen" })).toBeVisible();
  await expect(workspace.getByRole("heading", { name: "Correct your tax credit" })).toBeVisible();
  await expect(workspace.getByText("Payment identified", { exact: true })).toBeVisible();
  await expect(workspace.getByText("₹18,420", { exact: true })).toBeVisible();
  await expect(workspace.getByText("15 July 2026 · Self-Assessment Tax", { exact: true })).toBeVisible();
  await expect(workspace.getByText("Everything required is ready.", { exact: true })).toBeVisible();
  await expect(workspace.getByRole("heading", { name: "Respond to the demand" })).toBeVisible();
  await expect(workspace.getByText("Starts after Step 1", { exact: true })).toBeVisible();
  await expect(workspace.getByText("Corrective plan", { exact: true })).toBeVisible();
  await expect(workspace.getByText("Form 26AS", { exact: true })).toHaveCount(0);
  await expect(workspace.getByText("processing-demo-2026-27-001", { exact: true })).toHaveCount(0);
  const composer = workspace.getByLabel("Ask about your taxes");
  const governmentProcess = workspace.getByText("Government process", { exact: true });
  await governmentProcess.scrollIntoViewIfNeeded();
  await expect(governmentProcess).toBeVisible();
  await expect(composer).toBeVisible();
  await governmentProcess.click();
  await expect(workspace.getByText(/Response to Outstanding Demand/)).toBeVisible();
  await page.waitForTimeout(350);
  await saveReviewScreenshot(page, testInfo, "action-workspace-plan");

  await workspace.getByRole("button", { name: "Review correction" }).click();
  await expect(page).toHaveURL(/\/pending-actions\/demand\/assist\/rectification$/);
  await expect(page.getByLabel("Tax credit correction review").getByRole("heading", { name: "Correct your tax credit" })).toBeVisible();
  await expect(page.getByText("Nothing has been submitted yet.", { exact: true })).toBeVisible();
  const storedCase = await page.evaluate(() => window.localStorage.getItem("income-tax-demo-case:v1"));
  expect(storedCase).not.toBeNull();
  expect(JSON.parse(storedCase!)).toMatchObject({ state: "RECTIFICATION_REVIEW" });
  expect(JSON.parse(storedCase!)).not.toHaveProperty("rectificationReference");
  await expect(workspace).toBeVisible();
  await saveReviewScreenshot(page, testInfo, "fix-this-corrective-flow");

  await workspace.getByRole("button", { name: "Close assistance" }).click();
  await expect(workspace).toBeHidden();
  await expect(openButton).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator(".desktop-workspace")).toHaveClass(/is-closed/);
  await expect(openButton).toBeFocused();
  const reopenedPortal = await portal.boundingBox();
  expect(reopenedPortal!.width / 1440).toBeGreaterThan(0.98);

  await openButton.focus();
  await page.keyboard.press("Enter");
  await expect(assistanceHandle).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator(".desktop-workspace")).toHaveClass(/is-open/);
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

test("professional demand workspace keeps manual services and related records available", async ({ page }, testInfo) => {
  const diagnostics = collectDiagnostics(page);
  await page.goto("/pending-actions/demand");
  await expect(page.getByRole("heading", { name: "Demand details" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Related tax records" })).toBeVisible();
  await expect(page.getByRole("link", { name: "View payment" })).toHaveAttribute("href", "/payments");
  await expect(page.getByRole("link", { name: "View Form 26AS" })).toHaveAttribute("href", "/payments/form-26as");
  await expect(page.getByRole("link", { name: "View return" })).toHaveAttribute("href", "/returns");
  await expect(page.getByRole("link", { name: "Respond to demand" })).toHaveAttribute("href", "/pending-actions/demand/respond");
  await expect(page.getByRole("link", { name: "Pay demand" })).toHaveAttribute("href", "/pending-actions/demand/pay");
  await assertNoHorizontalOverflow(page);
  await saveReviewScreenshot(page, testInfo, "outstanding-demand-assistance-closed");

  await page.getByRole("button", { name: "Open assistance" }).click();
  await expect(page.getByRole("complementary", { name: "Assistance Workspace" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Related tax records" })).toBeVisible();
  await assertNoHorizontalOverflow(page);
  await saveReviewScreenshot(page, testInfo, "outstanding-demand-assistance-open");
  expect(diagnostics.consoleErrors).toEqual([]);
  expect(diagnostics.pageErrors).toEqual([]);
  expect(diagnostics.failedRequests).toEqual([]);
});

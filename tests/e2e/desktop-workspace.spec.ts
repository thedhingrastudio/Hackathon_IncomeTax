import { expect, test, type Page, type TestInfo } from "@playwright/test";

test.beforeEach(async ({ context }) => {
  await context.addCookies([{ name: "income-tax-demo-session", value: "rohan-mehta-demo", url: "http://127.0.0.1:3100" }]);
});

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
  await page.goto("/dashboard");
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
  await expect(workspace.getByTestId("assistance-home-assembly")).toBeVisible();
  await saveReviewScreenshot(page, testInfo, "assistance-home-assembly");
  await expect(workspace.getByRole("heading", { name: "1 item needs your attention" })).toBeVisible();
  await expect(workspace.getByTestId("assistance-home-assembly")).toHaveCount(0);
  await expect(workspace.getByText("Outstanding Demand", { exact: true })).toBeVisible();
  await expect(workspace.getByText("₹18,420", { exact: true })).toBeVisible();
  await expect(workspace.locator(".assistance-attention").getByText(/Response pending/)).toBeVisible();
  await expect(workspace.getByText("Action required", { exact: true })).toBeVisible();
  await expect(workspace.getByRole("heading", { name: "Upcoming" })).toBeVisible();
  await expect(workspace.getByText("Respond to outstanding demand", { exact: true })).toBeVisible();
  await expect(workspace.getByText("Review case status", { exact: true })).toBeVisible();
  await expect(workspace.getByText("These are synthetic case reminders, not statutory Income Tax deadlines.", { exact: true })).toBeAttached();
  await expect(workspace.getByLabel("Ask about your taxes")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Outstanding Demand" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Account at a glance" })).toBeAttached();
  await expect(page.getByRole("heading", { name: "Your account" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Recent tax activity" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Tax services" })).toBeVisible();
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
  const firstViewport = await page.evaluate(() => {
    const scroll = document.querySelector(".assistance-workspace-scroll")!;
    const upcoming = document.querySelector(".assistance-upcoming")!;
    const composer = document.querySelector(".assistance-composer")!;
    return { clientHeight: scroll.clientHeight, scrollHeight: scroll.scrollHeight, upcomingBottom: upcoming.getBoundingClientRect().bottom, composerTop: composer.getBoundingClientRect().top };
  });
  expect(firstViewport.scrollHeight).toBeLessThanOrEqual(firstViewport.clientHeight);
  expect(firstViewport.upcomingBottom).toBeLessThan(firstViewport.composerTop);
  await saveReviewScreenshot(page, testInfo, "dashboard-assistance-open");
  await saveReviewScreenshot(page, testInfo, "assistance-home-before-demand");

  await workspace.getByRole("button", { name: "Close assistance" }).click();
  await openButton.click();
  await expect(workspace.getByRole("heading", { name: "1 item needs your attention" })).toBeVisible();
  await expect(workspace.getByTestId("assistance-home-assembly")).toHaveCount(0);

  await workspace.getByRole("button", { name: "Understand this demand" }).click();
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
  const governmentProcess = workspace.getByText("Official government process", { exact: true });
  await governmentProcess.scrollIntoViewIfNeeded();
  await expect(governmentProcess).toBeVisible();
  await expect(composer).toBeVisible();
  await governmentProcess.click();
  await expect(workspace.getByText("Hide process", { exact: true })).toBeVisible();
  const governmentProcessDetails = workspace.locator(".government-process-reveal");
  await expect(governmentProcessDetails.getByText("Tax Credit Mismatch Correction", { exact: true })).toBeVisible();
  await expect(governmentProcessDetails.getByText("Submit response", { exact: true })).toBeVisible();
  await page.waitForTimeout(350);
  await saveReviewScreenshot(page, testInfo, "action-workspace-plan");

  await workspace.getByRole("button", { name: "Review correction" }).click();
  await expect(page).toHaveURL(/\/pending-actions\/demand$/);
  await expect(workspace.getByRole("heading", { name: "Review correction" })).toBeVisible();
  await expect(workspace.getByText("You're asking Income Tax to include this payment in your processed return.", { exact: true })).toBeVisible();
  await expect(workspace.getByText("Tax Credit Mismatch Correction", { exact: true })).toBeVisible();
  await expect(workspace.getByText("Nothing has been submitted yet.", { exact: true })).toBeVisible();
  await expect(workspace.getByLabel("Ask about your taxes")).toHaveCount(0);
  const correctionConfirmation = workspace.getByRole("button", { name: "Confirm and submit correction" });
  await expect(correctionConfirmation).toBeVisible();
  expect(await correctionConfirmation.evaluate((element) => getComputedStyle(element).backgroundColor)).not.toBe("rgba(0, 0, 0, 0)");
  let storedCase = await page.evaluate(() => window.localStorage.getItem("income-tax-demo-case:v1"));
  expect(storedCase).not.toBeNull();
  expect(JSON.parse(storedCase!)).toMatchObject({ state: "RECTIFICATION_REVIEW" });
  expect(JSON.parse(storedCase!)).not.toHaveProperty("rectificationReference");
  await saveReviewScreenshot(page, testInfo, "rectification-review");

  await workspace.getByRole("button", { name: "Back" }).click();
  await expect(workspace.getByRole("heading", { name: "Here's what needs to happen" })).toBeVisible();
  storedCase = await page.evaluate(() => window.localStorage.getItem("income-tax-demo-case:v1"));
  expect(JSON.parse(storedCase!)).not.toHaveProperty("rectificationReference");
  await workspace.getByRole("button", { name: "Review correction" }).click();

  await workspace.getByRole("button", { name: "Confirm and submit correction" }).click();
  await expect(workspace.getByRole("heading", { name: "Here's what needs to happen" })).toBeVisible();
  await expect(workspace.getByText("RECT-DEMO-01842", { exact: true })).toBeVisible();
  await expect(workspace.getByText("Ready for review", { exact: true })).toBeVisible();
  await expect(workspace.getByRole("button", { name: "Review response" })).toBeVisible();
  storedCase = await page.evaluate(() => window.localStorage.getItem("income-tax-demo-case:v1"));
  expect(JSON.parse(storedCase!)).toMatchObject({ state: "RECTIFICATION_SUBMITTED", rectificationReference: "RECT-DEMO-01842" });
  await saveReviewScreenshot(page, testInfo, "action-workspace-after-rectification");

  await workspace.getByRole("button", { name: "Review response" }).click();
  await expect(workspace.getByRole("heading", { name: "Review demand response" })).toBeVisible();
  await expect(workspace.getByText("I disagree with this demand", { exact: true })).toBeVisible();
  await expect(workspace.getByText("Rectification / Revised Return filed at CPC", { exact: true })).toBeVisible();
  await expect(workspace.getByText("RECT-DEMO-01842", { exact: true })).toBeVisible();
  await expect(workspace.getByText("Nothing has been submitted yet.", { exact: true })).toBeVisible();
  await expect(workspace.getByLabel("Ask about your taxes")).toHaveCount(0);
  const responseConfirmation = workspace.getByRole("button", { name: "Confirm and submit response" });
  await expect(responseConfirmation).toBeVisible();
  expect(await responseConfirmation.evaluate((element) => getComputedStyle(element).backgroundColor)).not.toBe("rgba(0, 0, 0, 0)");
  storedCase = await page.evaluate(() => window.localStorage.getItem("income-tax-demo-case:v1"));
  expect(JSON.parse(storedCase!)).toMatchObject({ state: "DEMAND_RESPONSE_REVIEW" });
  expect(JSON.parse(storedCase!)).not.toHaveProperty("demandResponseReference");
  await saveReviewScreenshot(page, testInfo, "demand-response-review");

  await workspace.getByRole("button", { name: "Back" }).click();
  await expect(workspace.getByRole("heading", { name: "Here's what needs to happen" })).toBeVisible();
  storedCase = await page.evaluate(() => window.localStorage.getItem("income-tax-demo-case:v1"));
  expect(JSON.parse(storedCase!)).not.toHaveProperty("demandResponseReference");
  await workspace.getByRole("button", { name: "Review response" }).click();

  await workspace.getByRole("button", { name: "Confirm and submit response" }).click();
  await expect(workspace.getByRole("heading", { name: "Response submitted" })).toBeVisible();
  await expect(workspace.getByText("DEMAND-RESP-DEMO-18420", { exact: true })).toBeVisible();
  await expect(workspace.getByText("Waiting for Income Tax review", { exact: true })).toBeVisible();
  await expect(workspace.getByLabel("Ask about your taxes")).toHaveCount(0);
  storedCase = await page.evaluate(() => window.localStorage.getItem("income-tax-demo-case:v1"));
  expect(JSON.parse(storedCase!)).toMatchObject({ state: "WAITING_FOR_REVIEW", rectificationReference: "RECT-DEMO-01842", demandResponseReference: "DEMAND-RESP-DEMO-18420" });
  expect(JSON.parse(storedCase!).state).not.toBe("RESOLVED");
  await saveReviewScreenshot(page, testInfo, "demand-response-submitted");

  await workspace.getByRole("button", { name: "View case status" }).click();
  await expect(workspace.getByRole("heading", { name: "Waiting for Income Tax review" })).toBeVisible();
  await expect(workspace.getByText("Nothing you need to do right now.", { exact: true })).toBeVisible();
  await expect(workspace.getByText("Outstanding demand · ₹18,420", { exact: true })).toBeVisible();
  const timeline = workspace.getByRole("list", { name: "Case progress" });
  for (const label of ["Payment found", "Problem identified", "Tax-credit correction submitted", "Demand response submitted", "Income Tax review", "Resolved"]) await expect(timeline.getByText(label, { exact: true })).toBeVisible();
  await expect(timeline.getByText("RECT-DEMO-01842", { exact: true })).toBeVisible();
  await expect(timeline.getByText("DEMAND-RESP-DEMO-18420", { exact: true })).toBeVisible();
  await expect(timeline.getByRole("listitem").filter({ hasText: "Income Tax review" })).toHaveAttribute("aria-current", "step");
  await expect(timeline.getByRole("listitem").filter({ hasText: "Resolved" })).toHaveClass(/is-pending/);
  await expect(workspace.getByLabel("Ask about this case")).toHaveAttribute("placeholder", "Ask about this case…");
  const fullCaseLink = workspace.getByRole("link", { name: "View full case" });
  await expect(fullCaseLink).toBeVisible();
  const fullCaseColors = await fullCaseLink.evaluate((element) => { const style = getComputedStyle(element); return { background: style.backgroundColor, foreground: style.color }; });
  expect(fullCaseColors.foreground).not.toBe(fullCaseColors.background);
  await assertNoHorizontalOverflow(page);
  await saveReviewScreenshot(page, testInfo, "assistance-tracking");

  await workspace.getByRole("button", { name: "Close assistance" }).click();
  await openButton.click();
  await expect(workspace.getByRole("heading", { name: "Waiting for Income Tax review" })).toBeVisible();
  await workspace.getByRole("link", { name: "View full case" }).click();
  await expect(page).toHaveURL(/\/case\/CASE-DEMO-18420$/);
  await expect(page.getByRole("heading", { name: "Outstanding Demand case" })).toBeVisible();
  await expect(workspace.getByRole("heading", { name: "Waiting for Income Tax review" })).toBeVisible();
  await saveReviewScreenshot(page, testInfo, "full-case-page-with-assistance-tracking");

  await page.reload();
  await expect(openButton).toHaveAttribute("aria-expanded", "false");
  await openButton.click();
  await expect(workspace.getByRole("heading", { name: "Your case is being reviewed" })).toBeVisible();
  await expect(workspace.getByText("Waiting for Income Tax review", { exact: true })).toBeVisible();
  await expect(workspace.getByText("Nothing you need to do right now.", { exact: true })).toBeVisible();
  await expect(workspace.getByText("RECT-DEMO-01842", { exact: true })).toBeVisible();
  await expect(workspace.getByText("DEMAND-RESP-DEMO-18420", { exact: true })).toBeVisible();
  await expect(workspace.getByText("Action required", { exact: true })).toHaveCount(0);
  await expect(workspace.getByRole("button", { name: "Understand this demand" })).toHaveCount(0);
  await expect(workspace.getByText("Respond to outstanding demand", { exact: true })).toHaveCount(0);
  await expect(workspace.getByText("Review case status", { exact: true })).toBeVisible();
  await expect(workspace.getByLabel("Ask about this case")).toBeVisible();
  await saveReviewScreenshot(page, testInfo, "assistance-home-after-submission");
  await saveReviewScreenshot(page, testInfo, "phase-2-h-waiting-contextual-questions");
  await workspace.getByRole("button", { name: "View case" }).click();
  await expect(workspace.getByRole("heading", { name: "Waiting for Income Tax review" })).toBeVisible();
  await expect(workspace.getByText("RECT-DEMO-01842", { exact: true })).toBeVisible();
  await expect(workspace.getByText("DEMAND-RESP-DEMO-18420", { exact: true })).toBeVisible();
  storedCase = await page.evaluate(() => window.localStorage.getItem("income-tax-demo-case:v1"));
  expect(JSON.parse(storedCase!)).toMatchObject({ state: "WAITING_FOR_REVIEW" });
  await saveReviewScreenshot(page, testInfo, "assistance-tracking-after-reload");

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

test("Assistance Home remains usable with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/dashboard");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
  await page.getByRole("button", { name: "Open assistance" }).click();
  const workspace = page.getByRole("complementary", { name: "Assistance Workspace" });
  await expect(workspace.getByRole("heading", { name: "1 item needs your attention" })).toBeVisible();
  await expect(workspace.getByText("Respond to outstanding demand", { exact: true })).toBeVisible();
  await expect(workspace.getByLabel("Ask about your taxes")).toBeVisible();
});

test("deterministic questions recompose Assistance into trusted account UI", async ({ page }, testInfo) => {
  await page.goto("/dashboard");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
  await page.getByRole("button", { name: "Open assistance" }).click();
  const workspace = page.getByRole("complementary", { name: "Assistance Workspace" });
  await expect(workspace.getByLabel("Try asking")).toBeVisible();
  for (const question of ["What needs my attention?", "Did my payment go through?", "What happens next?"]) await expect(workspace.getByRole("button", { name: question })).toBeVisible();
  await saveReviewScreenshot(page, testInfo, "phase-2-a-home-you-can-ask");

  await workspace.getByRole("button", { name: "What needs my attention?" }).click();
  await expect(workspace.getByRole("heading", { name: "1 item needs your attention" })).toBeVisible();
  await expect(workspace.getByText("Respond to outstanding demand", { exact: true })).toBeVisible();

  const composer = workspace.getByLabel("Ask about your taxes");
  await composer.fill("Why do I still have a demand?");
  await workspace.getByRole("button", { name: "Send question" }).click();
  await expect(workspace.locator(".assistance-response-assembly")).toBeVisible();
  await expect(workspace.getByRole("heading", { name: "Understanding your demand" })).toBeVisible();
  await expect(workspace.locator("[data-chat-message]")).toHaveCount(0);
  await saveReviewScreenshot(page, testInfo, "phase-2-b-explain-demand");
  await workspace.getByRole("button", { name: "Back to overview" }).click();
  await expect(workspace.getByRole("heading", { name: "1 item needs your attention" })).toBeVisible();

  await composer.fill("Did my payment go through?");
  await workspace.getByRole("button", { name: "Send question" }).click();
  await expect(workspace.getByRole("heading", { name: /₹18,420/ })).toBeVisible();
  await expect(workspace.getByText("Confirmed", { exact: true }).first()).toBeVisible();
  await expect(workspace.getByText("MOCK-2481", { exact: true })).toBeVisible();
  await saveReviewScreenshot(page, testInfo, "phase-2-c-payment-status");

  await composer.fill("Do I need to pay again?");
  await workspace.getByRole("button", { name: "Send question" }).click();
  await expect(workspace.getByRole("heading", { name: "Review the mismatch first" })).toBeVisible();
  await expect(workspace.getByText("Review the tax-credit mismatch before making another payment.", { exact: true })).toBeVisible();
  await saveReviewScreenshot(page, testInfo, "phase-2-d-pay-again");

  await composer.fill("What dates should I remember?");
  await workspace.getByRole("button", { name: "Send question" }).click();
  await expect(workspace.getByLabel(/August 2026 calendar/)).toBeVisible();
  await saveReviewScreenshot(page, testInfo, "phase-2-e-dates");

  await composer.fill("What happened to my return?");
  await workspace.getByRole("button", { name: "Send question" }).click();
  await expect(workspace.getByRole("heading", { name: "Your return was processed" })).toBeVisible();
  await expect(workspace.getByText("₹0", { exact: true })).toBeVisible();
  await saveReviewScreenshot(page, testInfo, "phase-2-f-return-status");

  await composer.fill("What does my Form 26AS show?");
  await workspace.getByRole("button", { name: "Send question" }).click();
  await expect(workspace.getByRole("heading", { name: "Self-Assessment Tax" })).toBeVisible();
  await expect(workspace.getByText("Reflected", { exact: true })).toBeVisible();

  await composer.fill("What records did you check?");
  await workspace.getByRole("button", { name: "Send question" }).click();
  await expect(workspace.getByRole("heading", { name: "Records used for this explanation" })).toBeVisible();
  await expect(workspace.getByText("Processed return", { exact: true })).toBeVisible();

  await composer.fill("Can you plan my holiday?");
  await workspace.getByRole("button", { name: "Send question" }).click();
  await expect(workspace.getByRole("heading", { name: "I can help with your tax records, outstanding demand, payments, return status and case progress." })).toBeVisible();
  for (const question of ["What needs my attention?", "Did my payment go through?", "What happens next?"]) await expect(workspace.getByRole("button", { name: question }).first()).toBeVisible();
  await saveReviewScreenshot(page, testInfo, "phase-2-g-scope-boundary");

  await workspace.getByRole("button", { name: "What happens next?" }).first().click();
  await expect(workspace.getByRole("heading", { name: "Here's what needs to happen" })).toBeVisible();
  await expect(workspace.getByText("Two government steps are required, in this order.", { exact: true })).toBeVisible();
});

test("workspace foundation has no horizontal overflow at 1150px", async ({ page }, testInfo) => {
  const diagnostics = collectDiagnostics(page);
  await page.setViewportSize({ width: 1150, height: 900 });
  await page.goto("/dashboard");
  await page.getByRole("button", { name: "Open assistance" }).click();
  await expect(page.getByRole("complementary", { name: "Assistance Workspace" })).toBeVisible();
  await expect(page.getByRole("complementary", { name: "Assistance Workspace" }).getByRole("heading", { name: "1 item needs your attention" })).toBeVisible();
  const workspace = page.getByRole("complementary", { name: "Assistance Workspace" });
  await workspace.getByRole("button", { name: "Did my payment go through?" }).click();
  await expect(workspace.getByText("MOCK-2481", { exact: true })).toBeVisible();
  await saveReviewScreenshot(page, testInfo, "phase-2-narrow-question-flow");
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

test("public landing and demo login lead into the protected dashboard", async ({ page, context }, testInfo) => {
  await context.clearCookies();
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "A clearer way to understand your taxes." })).toBeVisible();
  await expect(page.locator(".public-hero").getByRole("heading", { name: "Your payment was found." })).toBeVisible();
  await expect(page.locator(".public-hero .hero-preview-highlight")).toHaveText("₹18,420 wasn't counted");
  await expect(page.getByRole("heading", { name: "Tell us what you need to get done." })).toBeVisible();
  await expect(page.locator(".journey-situation blockquote")).toContainText("I already paid ₹18,420.");
  await expect(page.locator(".journey-situation blockquote")).toContainText("Why is there still a demand?");
  await expect(page.locator(".intent-outcome-canvas").getByText("₹18,420 wasn't counted in the processed return.", { exact: true })).toBeVisible();
  await expect(page.getByText("Nothing is submitted automatically.", { exact: true })).toBeVisible();
  await expect(page.getByText("Income Tax review", { exact: true })).toBeVisible();
  await saveReviewScreenshot(page, testInfo, "landing-intent-outcome-desktop");
  await page.getByRole("link", { name: "Login", exact: true }).first().click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByText("rohan.mehta", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Use test account" }).click();
  await expect(page.getByLabel("User ID")).toHaveValue("rohan.mehta");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: "Your tax account" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Log out of demo" })).toBeVisible();
});

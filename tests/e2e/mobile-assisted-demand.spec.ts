import { expect, test, type Page, type TestInfo } from "@playwright/test";

test.beforeEach(async ({ context }) => {
  await context.addCookies([{ name: "income-tax-demo-session", value: "rohan-mehta-demo", url: "http://127.0.0.1:3100" }]);
});

type BrowserDiagnostics = {
  consoleErrors: string[];
  pageErrors: string[];
  failedRequests: string[];
  nextRequests: { url: string; status?: number; failure?: string }[];
};

const diagnosticsByPage = new WeakMap<Page, BrowserDiagnostics>();

function monitorBrowser(page: Page) {
  const diagnostics: BrowserDiagnostics = {
    consoleErrors: [],
    pageErrors: [],
    failedRequests: [],
    nextRequests: [],
  };

  page.on("console", (message) => {
    if (message.type() === "error") diagnostics.consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => diagnostics.pageErrors.push(error.stack ?? error.message));
  page.on("requestfailed", (request) => {
    if (request.failure()?.errorText === "net::ERR_ABORTED" && request.resourceType() === "fetch") return;
    const failure = `${request.method()} ${request.url()}: ${request.failure()?.errorText ?? "unknown error"}`;
    diagnostics.failedRequests.push(failure);
    if (request.url().includes("/_next/")) {
      diagnostics.nextRequests.push({ url: request.url(), failure });
    }
  });
  page.on("response", (response) => {
    if (response.url().includes("/_next/") && !response.ok()) {
      diagnostics.nextRequests.push({ url: response.url(), status: response.status() });
    }
  });

  diagnosticsByPage.set(page, diagnostics);
  return diagnostics;
}

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status === testInfo.expectedStatus) return;
  const diagnostics = diagnosticsByPage.get(page);
  const switchState = await page.locator("#mobile-primary-menu [role=switch]").evaluateAll((elements) =>
    elements.map((element) => ({
      checked: (element as HTMLInputElement).checked,
      ariaChecked: element.getAttribute("aria-checked"),
    })),
  ).catch(() => []);
  await testInfo.attach("mobile-runtime-diagnostics", {
    body: Buffer.from(JSON.stringify({ diagnostics, url: page.url(), switchState }, null, 2)),
    contentType: "application/json",
  });
  await page.screenshot({ path: testInfo.outputPath("mobile-failure.png"), fullPage: true });
});

async function openMenu(page: Page) {
  const menuButton = page.getByRole("button", { name: /menu/i });
  await expect(menuButton).toBeVisible();
  await menuButton.click();
  await expect(menuButton).toHaveAttribute("aria-expanded", "true");
  const menu = page.locator("#mobile-primary-menu");
  await expect(menu).toBeVisible();
  return { menu, menuButton };
}

async function attachScreenshot(page: Page, testInfo: TestInfo, name: string) {
  const path = testInfo.outputPath(`${name}.png`);
  await page.screenshot({ fullPage: true, path });
  await testInfo.attach(name, { path, contentType: "image/png" });
}

async function assertDesktopShellLayout(page: Page) {
  await expect(page.locator(".desktop-portal-links")).toBeVisible();
  await expect(page.getByRole("button", { name: /menu/i })).toBeHidden();
  const mainBox = await page.locator("#main-content").boundingBox();
  expect(mainBox).not.toBeNull();
  expect(mainBox!.x).toBeGreaterThan(0);
  expect(mainBox!.x + mainBox!.width).toBeLessThan(1440);
  const skipBox = await page.getByRole("link", { name: "Skip to main content" }).boundingBox();
  expect(skipBox).not.toBeNull();
  expect(skipBox!.y + skipBox!.height).toBeLessThanOrEqual(0);
}

async function assertMobileShellLayout(page: Page) {
  await expect(page.getByRole("button", { name: /menu/i })).toBeVisible();
  await expect(page.locator(".desktop-portal-links")).toBeHidden();
  const dimensions = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
}

test("mobile menu and assisted demand journey remain interactive and persistent", async ({ page }, testInfo) => {
  const diagnostics = monitorBrowser(page);
  await page.goto("/dashboard");
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();
    await attachScreenshot(page, testInfo, "mobile-dashboard-assist-closed");

    const mobileAssist = page.getByRole("button", { name: "Open assistance" });
    await expect(mobileAssist).toBeVisible();
    await mobileAssist.click();
    const mobileWorkspace = page.getByRole("complementary", { name: "Assistance Workspace" });
    await expect(mobileWorkspace).toBeVisible();
    await expect(mobileWorkspace.getByRole("heading", { name: "1 item needs your attention" })).toBeVisible();
    const mobileBounds = await mobileWorkspace.boundingBox();
    expect(mobileBounds).not.toBeNull();
    expect(Math.round(mobileBounds!.width)).toBe(390);
    expect(Math.round(mobileBounds!.height)).toBe(844);
    await attachScreenshot(page, testInfo, "mobile-dashboard-assistance-open");
    await mobileWorkspace.getByRole("button", { name: "Close assistance" }).click();
    await expect(mobileWorkspace).toBeHidden();
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(mobileAssist).toBeFocused();

    const { menu, menuButton } = await openMenu(page);
    for (const label of ["Dashboard", "Returns", "Payments & Tax Records", "Pending Actions", "Services", "Help", "AI Assistance"]) {
      await expect(menu.getByText(label, { exact: true })).toBeVisible();
    }

    const aiSwitch = menu.getByRole("switch");
    const stateLabel = menu.locator(".ai-preference__heading p");
    const track = menu.locator(".preference-switch__track");
    await expect(aiSwitch).not.toBeChecked();
    await expect(aiSwitch).toHaveAttribute("aria-checked", "false");
    await expect(stateLabel).toHaveText("Off");
    const inactiveTrackColor = await track.evaluate((element) => getComputedStyle(element).backgroundColor);

    await aiSwitch.click();
    await expect(aiSwitch).toBeChecked();
    await expect(aiSwitch).toHaveAttribute("aria-checked", "true");
    await expect(stateLabel).toHaveText("On");
    const activeTrackColor = await track.evaluate((element) => getComputedStyle(element).backgroundColor);
    expect(activeTrackColor).not.toBe(inactiveTrackColor);

    await menuButton.click();
    await expect(menuButton).toHaveAttribute("aria-expanded", "false");
    await expect(menu).toBeHidden();

    await page.getByRole("link", { name: "Review outstanding demand" }).click();
    await expect(page).toHaveURL(/\/pending-actions\/demand$/);
    await expect(page.getByRole("heading", { name: "Not sure why this is showing?" })).toBeVisible();
    const contextualHelp = page.getByRole("link", { name: "Help me understand this" });
    await expect(contextualHelp).toBeVisible();

    await page.reload();
    const persistedMenu = await openMenu(page);
    const persistedSwitch = persistedMenu.menu.getByRole("switch");
    await expect(persistedSwitch).toBeChecked();
    await expect(persistedSwitch).toHaveAttribute("aria-checked", "true");
    await expect(persistedMenu.menu.locator(".ai-preference__heading p")).toHaveText("On");
    await persistedMenu.menuButton.click();
    await expect(page.getByRole("link", { name: "Help me understand this" })).toBeVisible();

    await page.getByRole("link", { name: "Help me understand this" }).click();
    await expect(page).toHaveURL(/\/pending-actions\/demand\/assist$/);
    await expect(page.getByText("Checking this demand", { exact: true })).toBeVisible();
    await expect(page.getByText("We found the problem", { exact: true })).toBeVisible();
    await expect(page.getByText("₹18,420", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("₹0", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Here's how we'll fix this", { exact: true })).toBeVisible();

    const offMenu = await openMenu(page);
    const offSwitch = offMenu.menu.getByRole("switch");
    await offMenu.menu.getByRole("switch").click();
    await expect(offSwitch).not.toBeChecked();
    await expect(offSwitch).toHaveAttribute("aria-checked", "false");
    await expect(offMenu.menu.locator(".ai-preference__heading p")).toHaveText("Off");
    await page.reload();
    const reloadedOffMenu = await openMenu(page);
    await expect(reloadedOffMenu.menu.getByRole("switch")).not.toBeChecked();
    await expect(reloadedOffMenu.menu.getByRole("switch")).toHaveAttribute("aria-checked", "false");
    await expect(reloadedOffMenu.menu.locator(".ai-preference__heading p")).toHaveText("Off");
    await page.goto("/pending-actions/demand");
    await expect(page.getByRole("heading", { name: "Not sure why this is showing?" })).toBeHidden();
    await expect(page.getByRole("link", { name: "Help me understand this" })).toBeHidden();

    const hydrationErrors = diagnostics.consoleErrors.filter((message) => /hydration|hydrated|server rendered html/i.test(message));
    expect(hydrationErrors, "React hydration errors").toEqual([]);
    expect(diagnostics.consoleErrors, "browser console errors").toEqual([]);
    expect(diagnostics.pageErrors, "uncaught browser page errors").toEqual([]);
    expect(diagnostics.failedRequests, "failed browser network requests").toEqual([]);
    expect(diagnostics.nextRequests, "failed Next.js client asset requests").toEqual([]);
});

test("assisted corrective workflow requires both citizen confirmations", async ({ page }) => {
  const diagnostics = monitorBrowser(page);
  await page.goto("/dashboard");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();

  const { menu, menuButton } = await openMenu(page);
  await menu.getByRole("switch").click();
  await expect(menu.getByRole("switch")).toBeChecked();
  await menuButton.click();
  await page.getByRole("link", { name: "Review outstanding demand" }).click();
  await page.getByRole("link", { name: "Help me understand this" }).click();
  await expect(page.getByText("Here's how we'll fix this", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Review correction" }).click();
  await expect(page).toHaveURL(/\/pending-actions\/demand\/assist\/rectification$/);
  await expect(page.getByRole("heading", { name: "Correct your tax credit" })).toBeVisible();
  await expect(page.getByText("MOCK-2481", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Nothing has been submitted yet.", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Correction submitted" })).toBeHidden();

  await page.getByRole("button", { name: "Confirm and submit correction" }).click();
  await expect(page.getByRole("heading", { name: "Correction submitted" })).toBeVisible();
  await expect(page.getByText("RECT-DEMO-01842", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Review demand response" }).click();

  await expect(page.getByRole("heading", { name: "Respond to the outstanding demand" })).toBeVisible();
  await expect(page.getByText("I disagree with this demand", { exact: true })).toBeVisible();
  await expect(page.getByText("Tax payment / tax credit has not been considered", { exact: true })).toBeVisible();
  await expect(page.getByText("Nothing has been submitted yet.", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Your requests have been submitted" })).toBeHidden();

  await page.getByRole("button", { name: "Confirm and submit response" }).click();
  await expect(page.getByRole("heading", { name: "Your requests have been submitted" })).toBeVisible();
  await expect(page.getByText("RECT-DEMO-01842", { exact: true })).toBeVisible();
  await expect(page.getByText("DEMAND-RESP-DEMO-18420", { exact: true })).toBeVisible();
  await expect(page.getByText("Income Tax still needs to review these requests.", { exact: true })).toBeVisible();
  await expect(page.getByText("The outstanding demand has not been marked as resolved.", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "View case status" }).click();
  await expect(page).toHaveURL(/\/case\/CASE-DEMO-18420$/);
  await expect(page.getByRole("heading", { name: "Outstanding Demand case" })).toBeVisible();
  await expect(page.getByText("Waiting for Income Tax review", { exact: true })).toBeVisible();
  await expect(page.getByText("Nothing right now.", { exact: true })).toBeVisible();
  await expect(page.getByText("RECT-DEMO-01842", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("DEMAND-RESP-DEMO-18420", { exact: true }).first()).toBeVisible();
  await page.reload();
  await expect(page.getByText("Waiting for Income Tax review", { exact: true })).toBeVisible();
  const caseMenu=await openMenu(page);await caseMenu.menu.getByRole("switch").click();await expect(caseMenu.menu.getByRole("switch")).not.toBeChecked();await caseMenu.menuButton.click();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Outstanding Demand case" })).toBeVisible();

  const hydrationErrors = diagnostics.consoleErrors.filter((message) => /hydration|hydrated|server rendered html/i.test(message));
  expect(hydrationErrors, "React hydration errors").toEqual([]);
  expect(diagnostics.consoleErrors, "browser console errors").toEqual([]);
  expect(diagnostics.pageErrors, "uncaught browser page errors").toEqual([]);
  expect(diagnostics.failedRequests, "failed browser network requests").toEqual([]);
  expect(diagnostics.nextRequests, "failed Next.js client asset requests").toEqual([]);
});

test.describe("desktop portal and conventional workflow layout", () => {
  test.use({ viewport: { width: 1440, height: 1000 } });

  test("shared shell and every conventional response state retain application styling", async ({ page }, testInfo) => {
    const diagnostics = monitorBrowser(page);
    await page.goto("/dashboard");
    await assertDesktopShellLayout(page);
    await attachScreenshot(page, testInfo, "desktop-dashboard");

    await page.goto("/pending-actions/demand");
    await assertDesktopShellLayout(page);
    await attachScreenshot(page, testInfo, "desktop-demand");

    await page.goto("/pending-actions/demand/respond");
    await assertDesktopShellLayout(page);
    const responseOptions = page.locator(".response-option");
    await expect(responseOptions).toHaveCount(3);
    const optionBoxes = await responseOptions.evaluateAll((options) => options.map((option) => {
      const rectangle = option.getBoundingClientRect();
      return { display: getComputedStyle(option).display, x: rectangle.x, y: rectangle.y, width: rectangle.width };
    }));
    expect(optionBoxes.every((box) => box.display === "flex" && box.width > 0)).toBe(true);
    expect(new Set(optionBoxes.map((box) => Math.round(box.x))).size).toBe(1);
    expect(optionBoxes[1].y).toBeGreaterThan(optionBoxes[0].y);
    await attachScreenshot(page, testInfo, "desktop-response-step-1");

    await page.getByRole("radio", { name: /I disagree with this demand/ }).check();
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByRole("heading", { name: "Tell us why you disagree" })).toBeVisible();
    await page.getByRole("radio", { name: "Tax payment / tax credit has not been considered" }).check();
    await attachScreenshot(page, testInfo, "desktop-response-step-2");
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByRole("heading", { name: "Review your response" })).toBeVisible();
    await expect(page.getByText("Nothing has been submitted yet.", { exact: true })).toBeVisible();
    await attachScreenshot(page, testInfo, "desktop-response-review");
    await page.getByRole("button", { name: "Confirm and submit" }).click();
    await expect(page.getByRole("heading", { name: "Response submitted" })).toBeVisible();
    await assertDesktopShellLayout(page);
    await attachScreenshot(page, testInfo, "desktop-response-submitted");

    await page.evaluate(() => window.localStorage.clear());
    await page.goto("/pending-actions/demand/assist");
    await expect(page.getByRole("heading", { name: "AI Assistance is turned off" })).toBeVisible();
    await assertDesktopShellLayout(page);
    await attachScreenshot(page, testInfo, "desktop-ai-off-fallback");

    expect(diagnostics.consoleErrors).toEqual([]);
    expect(diagnostics.pageErrors).toEqual([]);
    expect(diagnostics.failedRequests).toEqual([]);
  });
});

test("mobile conventional response states fit the viewport", async ({ page }, testInfo) => {
  monitorBrowser(page);
  await page.goto("/pending-actions/demand/respond");
  await assertMobileShellLayout(page);
  await attachScreenshot(page, testInfo, "mobile-response-step-1");
  await page.getByRole("radio", { name: /I disagree with this demand/ }).check();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("radio", { name: "Tax payment / tax credit has not been considered" }).check();
  await page.getByRole("button", { name: "Continue" }).click();
  await assertMobileShellLayout(page);
  await attachScreenshot(page, testInfo, "mobile-response-review");
  await page.getByRole("button", { name: "Confirm and submit" }).click();
  await expect(page.getByRole("heading", { name: "Response submitted" })).toBeVisible();
  await assertMobileShellLayout(page);
  await attachScreenshot(page, testInfo, "mobile-response-submitted");
});

test("landing intent-to-outcome story stacks clearly on mobile", async ({ page }, testInfo) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "A clearer way to understand your tax actions." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "A clearer way to understand your taxes." })).toBeHidden();
  await expect(page.locator(".public-hero .hero-mobile-mismatch")).toHaveText("₹18,420 wasn't counted");
  await expect(page.getByRole("heading", { name: "Tell us what you need to get done." })).toBeVisible();
  const story = page.locator(".intent-outcome-canvas");
  for (const heading of ["Your payment was found.", "Two next steps are prepared for you.", "Income Tax reviews submitted requests"]) await expect(story.getByRole("heading", { name: heading })).toBeVisible();
  await expect(story.getByText("₹18,420 wasn't counted in the processed return.", { exact: true })).toBeVisible();
  await expect(story.getByText("Nothing is submitted automatically.", { exact: true })).toBeVisible();
  const dimensions = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
  const hero = page.locator(".public-hero");
  await expect(hero.getByRole("link", { name: "Login" })).toBeVisible();
  await expect(hero.getByRole("link", { name: /See how Assistance works/ })).toBeVisible();
  const heroBox = await hero.boundingBox();
  const previewBox = await(hero.locator(".hero-assistance-preview")).boundingBox();
  expect(heroBox).not.toBeNull();
  expect(previewBox).not.toBeNull();
  expect(previewBox!.width).toBeLessThanOrEqual(330);
  expect(previewBox!.height).toBeLessThan(260);
  await attachScreenshot(page, testInfo, "landing-intent-outcome-mobile");
});

test("mobile login provides functional validation, credentials, and password visibility", async ({ page, context }, testInfo) => {
  await context.clearCookies();
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Sign in to your tax account" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Review your account with clarity." })).toBeHidden();
  await expect(page.getByText("Test account", { exact: true })).toBeVisible();
  await expect(page.getByText("Rohan Mehta", { exact: true })).toBeVisible();
  const userId = page.getByLabel("User ID");
  const password = page.locator("#password");
  await attachScreenshot(page, testInfo, "mobile-login-empty");

  await userId.fill("rohan.mehta");
  await password.fill("incorrect");
  await password.press("Enter");
  const loginError = page.locator(".login-error");
  await expect(loginError).toHaveText("User ID or password is incorrect.");
  await expect(page).toHaveURL(/\/login$/);
  await expect(userId).toHaveValue("rohan.mehta");
  await attachScreenshot(page, testInfo, "mobile-login-invalid");

  await password.fill("correcting");
  await expect(loginError).toBeHidden();

  await page.getByRole("button", { name: "Use test account" }).click();
  await expect(userId).toHaveValue("rohan.mehta");
  await expect(password).toHaveValue("Demo@123");
  await expect(page).toHaveURL(/\/login$/);
  await expect(loginError).toBeHidden();
  await attachScreenshot(page, testInfo, "mobile-login-test-account");

  const showPassword = page.getByRole("button", { name: "Show password" });
  await expect(password).toHaveAttribute("type", "password");
  await expect(showPassword).toHaveAttribute("aria-pressed", "false");
  await showPassword.click();
  const hidePassword = page.getByRole("button", { name: "Hide password" });
  await expect(password).toHaveAttribute("type", "text");
  await expect(password).toHaveValue("Demo@123");
  await expect(hidePassword).toHaveAttribute("aria-pressed", "true");
  await hidePassword.click();
  await expect(password).toHaveAttribute("type", "password");
  await expect(password).toHaveValue("Demo@123");

  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
});

test("mobile foundation has no overflow across supported widths", async ({ page }) => {
  for (const width of [360, 390, 430, 768]) {
    await page.setViewportSize({ width, height: width === 768 ? 900 : 844 });
    await page.goto("/dashboard");
    await expect(page.getByRole("button", { name: "Open assistance" })).toBeVisible();
    const dimensions = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
    expect(dimensions.content, `${width}px content width`).toBeLessThanOrEqual(dimensions.viewport);
  }
});

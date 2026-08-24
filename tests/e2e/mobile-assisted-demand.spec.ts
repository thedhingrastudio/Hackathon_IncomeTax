import { expect, test, type Page, type TestInfo } from "@playwright/test";

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

test("mobile menu and assisted demand journey remain interactive and persistent", async ({ page }) => {
  const diagnostics = monitorBrowser(page);
  await page.goto("/");
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();

    const { menu, menuButton } = await openMenu(page);
    for (const label of ["Dashboard", "Returns", "Payments & Tax Records", "Pending Actions", "Services", "Help", "AI Assistance"]) {
      await expect(menu.getByText(label, { exact: true })).toBeVisible();
    }

    const aiSwitch = menu.getByRole("switch");
    const stateLabel = menu.locator(".ai-preference__heading p");
    const track = menu.locator(".ux4g-switch-track");
    await expect(aiSwitch).not.toBeChecked();
    await expect(aiSwitch).toHaveAttribute("aria-checked", "false");
    await expect(stateLabel).toHaveText("Off");
    const inactiveTrackColor = await track.evaluate((element) => getComputedStyle(element).backgroundColor);

    await menu.locator(".ux4g-switch-control").click();
    await expect(aiSwitch).toBeChecked();
    await expect(aiSwitch).toHaveAttribute("aria-checked", "true");
    await expect(stateLabel).toHaveText("On");
    const activeTrackColor = await track.evaluate((element) => getComputedStyle(element).backgroundColor);
    expect(activeTrackColor).not.toBe(inactiveTrackColor);

    await menuButton.click();
    await expect(menuButton).toHaveAttribute("aria-expanded", "false");
    await expect(menu).toBeHidden();

    await page.getByRole("link", { name: "View demand" }).click();
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
    await offMenu.menu.locator(".ux4g-switch-control").click();
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

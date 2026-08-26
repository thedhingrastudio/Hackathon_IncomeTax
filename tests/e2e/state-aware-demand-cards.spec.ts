import { expect, test } from "@playwright/test";

test.beforeEach(async ({ context }) => {
  await context.addCookies([{ name: "income-tax-demo-session", value: "rohan-mehta-demo", url: "http://127.0.0.1:3100" }]);
});

const baseCase = {
  version: 1,
  caseId: "CASE-DEMO-18420",
  taxpayerId: "taxpayer-demo-001",
  assessmentYear: "2026-27",
  demandReference: "tax-demand-001",
  demandAmount: 18420,
  currency: "INR",
  diagnosis: "payment_missing_from_processed_return",
  createdAt: "2026-08-04T00:00:00.000Z",
  updatedAt: "2026-08-04T00:00:00.000Z",
} as const;

async function storeCase(page: import("@playwright/test").Page, state: "RECTIFICATION_SUBMITTED" | "WAITING_FOR_REVIEW" | "RESOLVED") {
  await page.evaluate(({ record, nextState }) => {
    const next = { ...record, state: nextState, rectificationReference: "RECT-DEMO-01842", ...(nextState === "WAITING_FOR_REVIEW" || nextState === "RESOLVED" ? { demandResponseReference: "DEMAND-RESP-DEMO-18420" } : {}) };
    window.localStorage.setItem("income-tax-demo-case:v1", JSON.stringify(next));
  }, { record: baseCase, nextState: state });
}

test("demand cards switch from evidence to waiting status only after both submissions", async ({ page }, testInfo) => {
  await page.goto("/dashboard");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();

  const dashboardCard = page.locator(".tax-account-demand-card");
  const dashboardJourney = dashboardCard.getByRole("list", { name: "Case progress" });
  for (const label of ["Payment", "Form 26AS", "Processed return", "Outstanding demand"]) await expect(dashboardJourney.getByText(label, { exact: true })).toBeVisible();
  await expect(dashboardCard.getByRole("link", { name: "Review outstanding demand" })).toBeVisible();

  await storeCase(page, "RECTIFICATION_SUBMITTED");
  await page.reload();
  await expect(dashboardCard.getByText("Outstanding demand", { exact: true }).first()).toBeVisible();
  await expect(dashboardCard.getByText("Action required", { exact: false })).toBeVisible();
  await expect(dashboardCard.getByText("Waiting for Income Tax review", { exact: true })).toHaveCount(0);

  await storeCase(page, "WAITING_FOR_REVIEW");
  await page.reload();
  await expect(dashboardCard.getByText("Case status", { exact: true })).toBeVisible();
  await expect(dashboardCard.getByText("Under review · AY 2026–27", { exact: true })).toBeVisible();
  await expect(dashboardCard.getByRole("heading", { name: "Income Tax is reviewing your case" })).toBeVisible();
  await expect(dashboardCard.getByText("Your correction and demand response have been submitted. Nothing else is needed from you right now.", { exact: true })).toBeVisible();
  await expect(dashboardCard.locator(".status-journey")).toHaveCount(0);
  await expect(dashboardCard.getByRole("link", { name: "Review outstanding demand" })).toHaveCount(0);
  await expect(dashboardCard.getByText("₹18,420", { exact: true })).toBeVisible();
  await expect(dashboardCard.getByText("RECT-DEMO-01842", { exact: true })).toBeVisible();
  await expect(dashboardCard.getByText("DEMAND-RESP-DEMO-18420", { exact: true })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("dashboard-waiting-for-review.png"), fullPage: true });

  await page.goto("/pending-actions");
  const pendingCard = page.locator(".demand-card");
  await expect(pendingCard.getByRole("heading", { name: "Waiting for Income Tax review" })).toBeVisible();
  await expect(pendingCard.getByText("Status", { exact: true })).toBeVisible();
  await expect(pendingCard.locator(".status-journey")).toHaveCount(0);
  await expect(pendingCard.getByRole("link", { name: "Review demand" })).toHaveCount(0);
  await expect(pendingCard.getByText(/Outstanding demand · ₹18,420/)).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("pending-actions-waiting-for-review.png"), fullPage: true });
  await pendingCard.getByRole("link", { name: "View case progress" }).click();
  await expect(page).toHaveURL(/\/case\/CASE-DEMO-18420$/);

  await page.goto("/dashboard");
  await storeCase(page, "RESOLVED");
  await page.reload();
  await expect(page.getByText("Resolved", { exact: true }).first()).toBeVisible();
  await expect(dashboardCard.getByRole("heading", { name: "Income Tax is reviewing your case" })).toHaveCount(0);
});

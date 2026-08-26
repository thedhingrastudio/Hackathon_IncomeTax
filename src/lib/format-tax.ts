export function formatIndianCurrency(amount: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
}

export function formatIndianDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}

export function formatIndianShortDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`)).toUpperCase();
}

export function formatAssessmentYear(year: string) {
  const [start, end] = year.split("-");
  return `${start}–${end}`;
}

const labels: Record<string, string> = {
  action_required: "Action required",
  confirmed: "Confirmed",
  processed: "Processed",
  reflected: "Reflected",
  self_assessment_tax: "Self-Assessment Tax",
  simulated_cpc_processing: "Simulated CPC processing",
};

export function formatRecordLabel(value: string) {
  return labels[value] ?? value.replaceAll("_", " ").replace(/^./, (letter) => letter.toUpperCase());
}

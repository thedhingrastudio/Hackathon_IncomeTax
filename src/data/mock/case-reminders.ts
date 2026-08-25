/** Synthetic prototype reminders. These are not statutory or official Income Tax deadlines. */
export type SyntheticCaseReminder = {
  kind: "synthetic_case_reminder";
  date: string;
  title: string;
  context: string;
  status: "upcoming";
  officialDeadline: false;
};

export const syntheticCaseReminders: readonly SyntheticCaseReminder[] = [
  { kind: "synthetic_case_reminder", date: "2026-08-28", title: "Respond to outstanding demand", context: "AY 2026–27", status: "upcoming", officialDeadline: false },
  { kind: "synthetic_case_reminder", date: "2026-09-12", title: "Review case status", context: "If Income Tax review is still pending", status: "upcoming", officialDeadline: false },
];

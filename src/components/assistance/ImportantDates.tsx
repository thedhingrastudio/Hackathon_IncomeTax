import { CalendarDays } from "lucide-react";
import { getSyntheticCaseReminders } from "@/data/mock";

const weekdays = ["M", "T", "W", "T", "F", "S", "S"];

export default function ImportantDates({ waitingForReview = false }: { waitingForReview?: boolean }) {
  const reminders = getSyntheticCaseReminders().filter((reminder) => !waitingForReview || reminder.title !== "Respond to outstanding demand");
  const highlighted = new Date(`${reminders[0].date}T00:00:00Z`);
  const year = highlighted.getUTCFullYear();
  const month = highlighted.getUTCMonth();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const mondayOffset = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7;
  const cells = [...Array(mondayOffset).fill(null), ...Array.from({ length: daysInMonth }, (_, index) => index + 1)];

  return <section className="assistance-dates" aria-labelledby="assistance-dates-title">
    <div className="assistance-section-heading"><CalendarDays aria-hidden="true" /><h3 id="assistance-dates-title">Dates to remember</h3></div>
    <div className="reminder-layout">
      <div className="reminder-calendar" aria-label={`${new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric", timeZone: "UTC" }).format(highlighted)} calendar. ${highlighted.getUTCDate()} is a synthetic case reminder.`}>
        <p>{new Intl.DateTimeFormat("en-IN", { month: "long", timeZone: "UTC" }).format(highlighted)} <strong>{year}</strong></p>
        <div className="reminder-weekdays" aria-hidden="true">{weekdays.map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}</div>
        <div className="reminder-days" aria-hidden="true">{cells.map((day, index) => <span className={day === highlighted.getUTCDate() ? "is-reminder" : ""} key={`${day ?? "blank"}-${index}`}>{day}</span>)}</div>
      </div>
      <div className="reminder-list"><p className="assistance-kicker">Dates to remember</p><ol>{reminders.map((reminder) => {
        const date = new Date(`${reminder.date}T00:00:00Z`);
        const label = new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", timeZone: "UTC" }).format(date).toUpperCase();
        return <li key={reminder.date}><time dateTime={reminder.date}>{label}</time><strong>{reminder.title}</strong><span>{reminder.context}</span><small>{reminder.status}</small></li>;
      })}</ol><p className="reminder-disclosure">Synthetic case reminders, not statutory deadlines.</p></div>
    </div>
  </section>;
}

import { getSyntheticCaseReminders } from "@/data/mock";

export default function UpcomingReminders({ waitingForReview = false }: { waitingForReview?: boolean }) {
  const reminders = getSyntheticCaseReminders().filter((reminder) => !waitingForReview || reminder.title !== "Respond to outstanding demand");

  return <section aria-describedby="upcoming-reminders-disclosure" aria-labelledby="upcoming-reminders-title" className="assistance-upcoming">
    <h3 id="upcoming-reminders-title">Upcoming</h3>
    <ol>{reminders.map((reminder) => {
      const date = new Date(`${reminder.date}T00:00:00Z`);
      const month = new Intl.DateTimeFormat("en-IN", { month: "short", timeZone: "UTC" }).format(date).toUpperCase().replace("SEP", "SEPT");
      const day = new Intl.DateTimeFormat("en-IN", { day: "2-digit", timeZone: "UTC" }).format(date);
      return <li key={reminder.date}><time dateTime={reminder.date}><span>{month}</span><strong>{day}</strong></time><div><strong>{reminder.title}</strong>{reminder.context ? <span>{reminder.context}</span> : null}</div></li>;
    })}</ol>
    <p className="visually-hidden" id="upcoming-reminders-disclosure">These are synthetic case reminders, not statutory Income Tax deadlines.</p>
  </section>;
}

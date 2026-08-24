import { CalendarDays } from "lucide-react";

export default function ImportantDates() {
  return (
    <section className="assistance-dates" aria-labelledby="assistance-dates-title">
      <div className="assistance-section-heading">
        <CalendarDays aria-hidden="true" />
        <h3 id="assistance-dates-title">Dates to remember</h3>
      </div>
      <div className="assistance-empty-date">
        <p>No upcoming deadlines in the current demo data.</p>
        <span>Verified dates will appear here when they are available.</span>
      </div>
    </section>
  );
}

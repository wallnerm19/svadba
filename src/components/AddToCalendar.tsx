import { CalendarPlus, Download } from 'lucide-react';
import { downloadIcs, googleCalendarUrl } from '../lib/calendar';
import { calendarEvent } from '../lib/wedding';
import { Button, ButtonLink } from './ui/Button';

/** Tlačidlá „Pridať do kalendára“ – Google Kalendár a univerzálny súbor .ics (Apple, Outlook…). */
export function AddToCalendar() {
  return (
    <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
      <ButtonLink href={googleCalendarUrl(calendarEvent)} external variant="primary">
        <CalendarPlus size={16} strokeWidth={1.5} aria-hidden="true" />
        Google Kalendár
      </ButtonLink>
      <Button variant="outline" onClick={() => downloadIcs(calendarEvent)}>
        <Download size={16} strokeWidth={1.5} aria-hidden="true" />
        Apple / Outlook (.ics)
      </Button>
    </div>
  );
}

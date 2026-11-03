// A gentle daily reminder, without a server: a calendar event that repeats
// every day at the time the person picks. It lives in their own calendar,
// which they can move or delete like any event. No streak, no count.
//
// Two ways in: a .ics file (iPhone, Mac, Outlook, Samsung Calendar, most
// calendars) or Google Calendar's "add event" page with the same event.

type Lang = 'el' | 'en';

const SITE = 'https://neurodivergent-mindfulness.org';

const TEXT = {
  el: {
    title: 'Λίγα λεπτά για σένα',
    details: 'Μία άσκηση, όποια ταιριάζει σήμερα: μια αναπνοή, λίγη κίνηση, ή μια μικροδόση. Αν δεν είναι η μέρα, άφησέ το.',
  },
  en: {
    title: 'A few minutes for you',
    details: 'One practice, whichever suits today: a breath, a little movement, or a microdose. If today is not the day, let it go.',
  },
};

const pad = (n: number) => String(n).padStart(2, '0');

/** "HH:MM" → [h, m], or 09:00 if it does not read as a time. */
export function parseTime(time: string): [number, number] {
  const m = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!m) return [9, 0];
  const h = Math.min(23, Number(m[1]));
  const min = Math.min(59, Number(m[2]));
  return [h, min];
}

/** The first day the reminder rings: today if the time is still ahead, else tomorrow. */
export function firstDay(time: string, now: Date): Date {
  const [h, m] = parseTime(time);
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);
  if (d.getTime() <= now.getTime()) d.setDate(d.getDate() + 1);
  return d;
}

/** Local ("floating") date-time, so the event follows the phone's own time zone. */
const local = (d: Date) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
const utcStamp = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

const MINUTES = 10;

/** Long lines are folded at 75 bytes (RFC 5545), never inside a letter. */
export function fold(line: string): string {
  const enc = new TextEncoder();
  const parts: string[] = [];
  let cur = '';
  let bytes = 0;
  for (const ch of line) {
    const n = enc.encode(ch).length;
    const limit = parts.length ? 74 : 75; // continuation lines start with a space
    if (bytes + n > limit) { parts.push(cur); cur = ''; bytes = 0; }
    cur += ch;
    bytes += n;
  }
  parts.push(cur);
  return parts.join('\r\n ');
}

export function buildIcs(lang: Lang, time: string, now = new Date(), uid = `${now.getTime()}-${Math.random().toString(36).slice(2)}`): string {
  const t = TEXT[lang];
  const start = firstDay(time, now);
  const end = new Date(start.getTime() + MINUTES * 60 * 1000);
  const url = `${SITE}/${lang}`;
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Neurodivergent Mindfulness//Daily reminder//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}@neurodivergent-mindfulness.org`,
    `DTSTAMP:${utcStamp(now)}`,
    `DTSTART:${local(start)}`,
    `DTEND:${local(end)}`,
    'RRULE:FREQ=DAILY',
    `SUMMARY:${esc(t.title)}`,
    `DESCRIPTION:${esc(`${t.details}\n${url}`)}`,
    `URL:${url}`,
    'TRANSP:TRANSPARENT',
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:${esc(t.title)}`,
    'TRIGGER:PT0M',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].map(fold).join('\r\n') + '\r\n';
}

export function googleCalendarUrl(lang: Lang, time: string, now = new Date()): string {
  const t = TEXT[lang];
  const start = firstDay(time, now);
  const end = new Date(start.getTime() + MINUTES * 60 * 1000);
  const q = new URLSearchParams({
    action: 'TEMPLATE',
    text: t.title,
    details: `${t.details}\n${SITE}/${lang}`,
    dates: `${local(start)}/${local(end)}`,
    recur: 'RRULE:FREQ=DAILY',
  });
  return `https://calendar.google.com/calendar/render?${q.toString()}`;
}

/** Saves the .ics file; the phone or computer then offers to add it to its calendar. */
export function openIcs(lang: Lang, time: string) {
  const ics = buildIcs(lang, time);
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const href = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = href;
  a.download = lang === 'el' ? 'ypenthymisi.ics' : 'mindfulness-reminder.ics';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(href), 1000);
}

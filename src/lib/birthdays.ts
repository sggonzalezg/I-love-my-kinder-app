import { fromIsoDate, MONTHS, MONTHS_SHORT, WEEKDAYS } from './dates';

const DAY_MS = 24 * 60 * 60 * 1000;
export const BIRTHDAY_WINDOW_DAYS = 60;

export interface BirthdayChild {
  id: string;
  name: string;
  birthDate: string | null;
}

export interface UpcomingBirthday {
  id: string;
  name: string;
  day: number;
  month: string;
  monthShort: string;
  weekday: string;
  isToday: boolean;
  ageTurning: number;
}

export function birthdayLabel(birthDate: string): string {
  const date = fromIsoDate(birthDate);
  return `${date.getDate()} de ${MONTHS[date.getMonth()]}`;
}

// new Date(year, 1, 29) rolls over to 1 March in a common year, which is when the nursery celebrates it.
function nextBirthday(birthDate: string, today: Date): Date {
  const birth = fromIsoDate(birthDate);
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const thisYear = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
  return thisYear >= startOfToday ? thisYear : new Date(today.getFullYear() + 1, birth.getMonth(), birth.getDate());
}

export function upcomingBirthdays(children: BirthdayChild[], today: Date, windowDays = BIRTHDAY_WINDOW_DAYS): UpcomingBirthday[] {
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return children
    .filter((child): child is BirthdayChild & { birthDate: string } => Boolean(child.birthDate))
    .map((child) => {
      const next = nextBirthday(child.birthDate, today);
      const daysUntil = Math.round((next.getTime() - startOfToday.getTime()) / DAY_MS);
      return {
        id: child.id,
        name: child.name,
        day: next.getDate(),
        month: MONTHS[next.getMonth()],
        monthShort: MONTHS_SHORT[next.getMonth()],
        weekday: WEEKDAYS[next.getDay()],
        isToday: daysUntil === 0,
        ageTurning: next.getFullYear() - fromIsoDate(child.birthDate).getFullYear(),
        daysUntil,
      };
    })
    .filter((birthday) => birthday.daysUntil <= windowDays)
    .sort((first, second) => first.daysUntil - second.daysUntil)
    .map(({ daysUntil, ...birthday }) => birthday);
}

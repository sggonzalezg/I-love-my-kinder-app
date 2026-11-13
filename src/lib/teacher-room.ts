import { upcomingBirthdays, type BirthdayChild, type UpcomingBirthday } from './birthdays';
import { countLabel } from './format';

// "Próximos cumples" in T7 covers about a month; past it the card says "No hay cumples este mes" and names the next one.
export const ROOM_BIRTHDAY_WINDOW_DAYS = 30;
const DAYS_IN_LEAP_YEAR = 366;

export type RoomBirthdayChild = BirthdayChild & { firstName: string };
export type RoomBirthday = UpcomingBirthday & { firstName: string };

export interface RoomBirthdays {
  today: RoomBirthday[];
  upcoming: RoomBirthday[];
  /** The first birthday after the window, only when nothing falls inside it. */
  next: RoomBirthday | null;
}

export function roomBirthdays(children: RoomBirthdayChild[], today: Date): RoomBirthdays {
  const firstNames = new Map(children.map((child) => [child.id, child.firstName]));
  const withFirstName = (birthday: UpcomingBirthday): RoomBirthday => ({ ...birthday, firstName: firstNames.get(birthday.id) ?? birthday.name });
  const close = upcomingBirthdays(children, today, ROOM_BIRTHDAY_WINDOW_DAYS).map(withFirstName);
  const [next] = close.length ? [] : upcomingBirthdays(children, today, DAYS_IN_LEAP_YEAR).map(withFirstName);
  return {
    today: close.filter((birthday) => birthday.isToday),
    upcoming: close.filter((birthday) => !birthday.isToday),
    next: next ?? null,
  };
}

export function childCountLabel(count: number): string {
  return countLabel(count, 'niño', 'niños');
}

export function todayBirthdayLine(ageTurning: number, groupLabel: string): string {
  return `${countLabel(ageTurning, 'año', 'años')} · ${groupLabel}`;
}

export function turningLabel(ageTurning: number): string {
  return `Cumple ${ageTurning}`;
}

export function nextBirthdayLine({ day, month, firstName }: Pick<RoomBirthday, 'day' | 'month' | 'firstName'>): string {
  return `El próximo es el ${day} de ${month}: ${firstName}.`;
}

// Spanish (Uruguay) date copy. Hand-written so output does not depend on the device's Intl data.

export const WEEKDAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
export const WEEKDAYS_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
export const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
export const MONTHS_SHORT = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export function formatLongDate(date: Date): string {
  return `${WEEKDAYS[date.getDay()]} ${date.getDate()} de ${MONTHS[date.getMonth()]}`;
}

export function formatTime(date: Date): string {
  return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
}

/** "09:05:00" or "09:05" from Postgres TIME → "9:05". */
export function formatDbTime(time: string | null | undefined): string {
  if (!time) return '--:--';
  const [h, m] = time.split(':');
  return `${Number(h)}:${m}`;
}

export function dayChipLabel(day: Date, today: Date): string {
  if (sameDay(day, today)) return 'Hoy';
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (sameDay(day, yesterday)) return 'Ayer';
  return `${WEEKDAYS_SHORT[day.getDay()]} ${day.getDate()}`;
}

export function formatCountdown(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

export function toIsoDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function fromIsoDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function shortDateTime(iso: string, now = new Date()): string {
  const d = new Date(iso);
  return sameDay(d, now) ? formatTime(d) : `${WEEKDAYS_SHORT[d.getDay()].toLowerCase()} ${d.getDate()}/${d.getMonth() + 1}`;
}

export { sameDay };

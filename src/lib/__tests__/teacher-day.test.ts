import type { ChildSyncStatus } from '../routine-queue';
import {
  dayHeaderDate,
  defaultGroupIndex,
  firstToLogIndex,
  hygieneSheetCopy,
  isFutureTime,
  logButtonLabel,
  minutesBefore,
  readyCount,
  stepTime,
  syncedLabel,
  toTimeValue,
} from '../teacher-day';

describe('teacher day (T2 and T4)', () => {
  it('counts a child as ready once her day is saved, sent or not', () => {
    const statuses: ChildSyncStatus[] = ['synced', 'pending', 'none', 'rejected'];
    expect(readyCount(statuses)).toBe(2);
  });

  it('starts the log on the first child not logged, or on the first child when all are', () => {
    expect(firstToLogIndex(['synced', 'none', 'none'])).toBe(1);
    expect(firstToLogIndex(['synced', 'pending'])).toBe(0);
  });

  it('says "Registrar el día" before the first save and "Seguir registrando" after', () => {
    expect(logButtonLabel(0)).toBe('Registrar el día');
    expect(logButtonLabel(7)).toBe('Seguir registrando');
  });

  it('dates the day as "Viernes 23"', () => {
    expect(dayHeaderDate(new Date(2026, 9, 23))).toBe('Viernes 23');
  });

  it('opens on the group of the current shift when the teacher has two', () => {
    const groups = [{ shift: 'morning' as const }, { shift: 'afternoon' as const }];
    expect(defaultGroupIndex(groups, new Date(2026, 10, 12, 9, 0))).toBe(0);
    expect(defaultGroupIndex(groups, new Date(2026, 10, 12, 14, 0))).toBe(1);
    expect(defaultGroupIndex([{ shift: 'morning' as const }], new Date(2026, 10, 12, 14, 0))).toBe(0);
  });

  it('writes times as the backend expects them, HH:MM with a leading zero', () => {
    expect(toTimeValue(new Date(2026, 10, 12, 9, 5))).toBe('09:05');
  });

  it('goes back 15 and 30 minutes for the quick chips, never before midnight', () => {
    const now = new Date(2026, 10, 12, 10, 42);
    expect(minutesBefore(now, 15)).toBe('10:27');
    expect(minutesBefore(new Date(2026, 10, 12, 0, 10), 30)).toBe('00:00');
  });

  it('refuses a time after now', () => {
    const now = new Date(2026, 10, 12, 10, 42);
    expect(isFutureTime('10:43', now)).toBe(true);
    expect(isFutureTime('10:42', now)).toBe(false);
  });

  it('steps the hour or the minute, wrapping inside the day and stopping at now', () => {
    const now = new Date(2026, 10, 12, 10, 42);
    expect(stepTime('10:27', 'minute', 1, now)).toBe('10:28');
    expect(stepTime('10:59', 'minute', 1, new Date(2026, 10, 12, 23, 0))).toBe('10:00');
    expect(stepTime('09:27', 'hour', -1, now)).toBe('08:27');
    expect(stepTime('10:27', 'hour', 1, now)).toBe('10:27');
  });

  it('titles the time sheet by kind: a diaper change or a bathroom visit', () => {
    expect(hygieneSheetCopy('diaper', '10:27')).toEqual({ title: '¿A qué hora fue el cambio?', add: 'Agregar cambio a las 10:27' });
    expect(hygieneSheetCopy('bathroom', '10:27')).toEqual({ title: '¿A qué hora fue al baño?', add: 'Agregar a las 10:27' });
  });

  it('says when a logged day was saved', () => {
    expect(syncedLabel(new Date(2026, 10, 12, 12, 40).toISOString())).toBe('Cargado a las 12:40');
  });
});

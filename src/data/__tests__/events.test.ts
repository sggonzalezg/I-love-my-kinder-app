import { getEventsForMonth, getEventsByDate, getUpcomingEvents, getPastEvents, mockEvents } from '../events';

describe('events data', () => {
  it('filters events by month', () => {
    // November 2026
    const novEvents = getEventsForMonth(2026, 10);
    expect(novEvents.length).toBeGreaterThan(0);
    novEvents.forEach((e) => {
      const date = new Date(e.date);
      expect(date.getUTCFullYear()).toBe(2026);
      expect(date.getUTCMonth()).toBe(10);
    });
  });

  it('returns no events for empty months', () => {
    const events = getEventsForMonth(2025, 0);
    expect(events).toEqual([]);
  });

  it('filters events by date', () => {
    const date = mockEvents[0].date;
    const events = getEventsByDate(date);
    expect(events.every((e) => e.date === date)).toBe(true);
  });

  it('sorts events by time_start within a date', () => {
    const date = '2026-11-10';
    const events = getEventsByDate(date);
    for (let i = 1; i < events.length; i++) {
      const prev = events[i - 1].time_start || '00:00';
      const curr = events[i].time_start || '00:00';
      expect(prev.localeCompare(curr)).toBeLessThanOrEqual(0);
    }
  });

  it('returns upcoming events from a date', () => {
    const fromDate = '2026-11-01';
    const upcoming = getUpcomingEvents(fromDate, 30);
    const from = new Date(fromDate);

    upcoming.forEach((e) => {
      const eventDate = new Date(e.date + 'T00:00:00Z');
      expect(eventDate.getTime()).toBeGreaterThanOrEqual(from.getTime());
    });
  });

  it('respects daysAhead limit for upcoming events', () => {
    const fromDate = '2026-11-01';
    const upcoming = getUpcomingEvents(fromDate, 5);
    const from = new Date(fromDate);
    const to = new Date(from);
    to.setDate(to.getDate() + 5);

    upcoming.forEach((e) => {
      const eventDate = new Date(e.date + 'T00:00:00Z');
      expect(eventDate.getTime()).toBeLessThanOrEqual(to.getTime());
    });
  });

  it('returns past events before a date', () => {
    const upToDate = '2026-11-20';
    const past = getPastEvents(upToDate, 30);
    const upTo = new Date(upToDate);

    past.forEach((e) => {
      const eventDate = new Date(e.date + 'T00:00:00Z');
      expect(eventDate.getTime()).toBeLessThan(upTo.getTime());
    });
  });

  it('filters past events by year and month', () => {
    const upToDate = '2026-12-31';
    const past = getPastEvents(upToDate, 365, 2026, 10);

    past.forEach((e) => {
      const date = new Date(e.date);
      expect(date.getUTCFullYear()).toBe(2026);
      expect(date.getUTCMonth()).toBe(10);
    });
  });

  it('sorts past events newest first', () => {
    const upToDate = '2026-12-31';
    const past = getPastEvents(upToDate, 365);
    for (let i = 1; i < past.length; i++) {
      expect(past[i - 1].date.localeCompare(past[i].date)).toBeGreaterThanOrEqual(0);
    }
  });
});

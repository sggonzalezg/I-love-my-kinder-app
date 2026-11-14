import {
  buildMonthGrid,
  calendarList,
  eventAuthorLabel,
  eventAuthorLine,
  eventFromRow,
  eventTypeLabel,
  eventRowMeta,
  eventsOnDate,
  markedDays,
  monthBounds,
  monthPeriod,
  monthTitle,
  pastBefore,
  upcomingFrom,
  type Event,
  type EventRow,
} from '../calendar';

describe('month grid (F10)', () => {
  it('starts weeks on Monday and pads with nulls', () => {
    // October 2026 starts on a Thursday.
    const weeks = buildMonthGrid(2026, 9);
    expect(weeks[0]).toEqual([null, null, null, 1, 2, 3, 4]);
  });

  it('ends with the last day of the month', () => {
    const weeks = buildMonthGrid(2026, 9);
    const last = weeks[weeks.length - 1];
    expect(last.filter((d) => d !== null).pop()).toBe(31);
    expect(last).toHaveLength(7);
  });

  it('titles the month in Spanish', () => {
    expect(monthTitle(2026, 9)).toBe('Octubre');
  });

  it('labels event types with the client words', () => {
    expect(eventTypeLabel('outing')).toBe('Salida');
    expect(eventTypeLabel('no_classes')).toBe('Sin clases');
    expect(eventTypeLabel('celebration')).toBe('Fiesta o acto');
  });
});

const NOW = new Date(2026, 9, 24, 10, 0);

function row(overrides: Partial<EventRow> = {}): EventRow {
  return {
    id: 'huerta',
    title: 'Taller de huerta con familias',
    event_type: 'workshop',
    starts_at: new Date(2026, 9, 28, 9, 30).toISOString(),
    ends_at: new Date(2026, 9, 28, 11, 0).toISOString(),
    all_day: false,
    location: 'Huerta del jardín',
    transport: null,
    description: 'Vamos a plantar lechugas.',
    remind_day_before: true,
    changed_at: null,
    previous_values: null,
    rooms: { name: 'Sala 2' },
    shifts: { name: 'morning' },
    room_id: 'room-2',
    shift_id: 'morning-shift',
    created_by: 'teacher-sofia',
    ...overrides,
  };
}

const NO_EXTRAS = { imageUrl: null, authorLine: null };

describe('eventFromRow', () => {
  it('takes the day and the times in local time', () => {
    const event = eventFromRow(row(), NO_EXTRAS, NOW);
    expect(event.date).toBe('2026-10-28');
    expect(event.time_start).toBe('9:30');
    expect(event.time_end).toBe('11:00');
  });

  it('has no times for an all-day event', () => {
    const event = eventFromRow(row({ all_day: true, event_type: 'no_classes' }), NO_EXTRAS, NOW);
    expect(event.time_start).toBeUndefined();
    expect(event.type).toBe('no_classes');
  });

  it('names the group it was sent to', () => {
    expect(eventFromRow(row(), NO_EXTRAS, NOW).audience).toBe('Sala 2 · Matutino');
  });

  it('says the whole nursery when it has no room', () => {
    expect(eventFromRow(row({ rooms: null, shifts: null }), NO_EXTRAS, NOW).audience).toBe('Todo el jardín');
  });

  it('keeps the place, the image and the author line', () => {
    const event = eventFromRow(row(), { imageUrl: 'https://signed', authorLine: 'Lo agendó Maestra Sofía' }, NOW);
    expect(event.place).toBe('Huerta del jardín');
    expect(event.image_url).toBe('https://signed');
    expect(event.author_line).toBe('Lo agendó Maestra Sofía');
  });

  it('keeps how an outing goes and its permission counts', () => {
    const permissionCounts = { authorizedCount: 18, declinedCount: 2, pendingCount: 6, childCount: 26 };
    const event = eventFromRow(row({ event_type: 'outing', transport: 'Caminando' }), { ...NO_EXTRAS, permissionCounts }, NOW);
    expect(event.transport).toBe('Caminando');
    expect(event.permission_counts).toEqual(permissionCounts);
  });

  it('reminds the day before at 18:00', () => {
    const reminder = new Date(eventFromRow(row(), NO_EXTRAS, NOW).reminder_at!);
    expect([reminder.getDate(), reminder.getHours(), reminder.getMinutes()]).toEqual([27, 18, 0]);
  });

  it('has no reminder when the nursery turned it off', () => {
    expect(eventFromRow(row({ remind_day_before: false }), NO_EXTRAS, NOW).reminder_at).toBeUndefined();
  });

  it('has no reminder once the event started', () => {
    expect(eventFromRow(row(), NO_EXTRAS, new Date(2026, 9, 28, 10, 0)).reminder_at).toBeUndefined();
  });

  it('shows the previous start time of a change made in the last 3 days', () => {
    const changed = row({
      changed_at: new Date(2026, 9, 22, 12, 0).toISOString(),
      previous_values: { starts_at: new Date(2026, 9, 28, 9, 0).toISOString() },
    });
    expect(eventFromRow(changed, NO_EXTRAS, NOW).changed_previous_time).toBe('9:00');
  });

  it('forgets a change older than 3 days', () => {
    const changed = row({
      changed_at: new Date(2026, 9, 20, 12, 0).toISOString(),
      previous_values: { starts_at: new Date(2026, 9, 28, 9, 0).toISOString() },
    });
    expect(eventFromRow(changed, NO_EXTRAS, NOW).changed_previous_time).toBeUndefined();
  });

  it('shows no change when the previous start is unknown', () => {
    const changed = row({ changed_at: new Date(2026, 9, 23, 12, 0).toISOString(), previous_values: {} });
    expect(eventFromRow(changed, NO_EXTRAS, NOW).changed_previous_time).toBeUndefined();
  });
});

describe('eventFromRow for staff', () => {
  it('keeps who made the event and its group', () => {
    const event = eventFromRow(row(), NO_EXTRAS, NOW);
    expect([event.created_by, event.room_id, event.shift_id]).toEqual(['teacher-sofia', 'room-2', 'morning-shift']);
  });

  it('is not over before it ends', () => {
    expect(eventFromRow(row(), NO_EXTRAS, new Date(2026, 9, 28, 10, 59)).has_ended).toBe(false);
  });

  it('is over once it ended', () => {
    expect(eventFromRow(row(), NO_EXTRAS, new Date(2026, 9, 28, 11, 0)).has_ended).toBe(true);
  });

  it('carries the author label of the row', () => {
    expect(eventFromRow(row(), { ...NO_EXTRAS, authorLabel: 'Vos' }, NOW).author_label).toBe('Vos');
  });
});

describe('eventAuthorLabel (T8 rows)', () => {
  it('says Vos for the user own event', () => {
    expect(eventAuthorLabel(true, null)).toBe('Vos');
  });

  it('names the teacher who made it', () => {
    expect(eventAuthorLabel(false, { role: 'teacher', firstName: 'Sofía' })).toBe('Maestra Sofía');
  });

  it('says Dirección for the director', () => {
    expect(eventAuthorLabel(false, { role: 'director', firstName: 'Laura' })).toBe('Dirección');
  });

  it('is left out when the author does not read', () => {
    expect(eventAuthorLabel(false, null)).toBeNull();
  });
});

describe('eventRowMeta', () => {
  it('puts the author before the audience', () => {
    expect(eventRowMeta(event('huerta', '2026-10-28', { author_label: 'Vos', audience: 'Sala 2 · Matutino' }))).toBe('Vos · Sala 2 · Matutino');
  });

  it('shows only the audience without an author', () => {
    expect(eventRowMeta(event('fiesta', '2026-10-31'))).toBe('Todo el jardín');
  });
});

describe('eventAuthorLine', () => {
  it('says vos for the user own event', () => {
    expect(eventAuthorLine(true, null)).toBe('Lo agendaste vos');
  });

  it('names the teacher who made it', () => {
    expect(eventAuthorLine(false, { role: 'teacher', firstName: 'Sofía' })).toBe('Lo agendó Maestra Sofía');
  });

  it('says Dirección for the director', () => {
    expect(eventAuthorLine(false, { role: 'director', firstName: 'Laura' })).toBe('Lo agendó Dirección');
  });

  it('is left out when the author is unknown', () => {
    expect(eventAuthorLine(false, null)).toBeNull();
  });
});

function event(id: string, date: string, overrides: Partial<Event> = {}): Event {
  return { id, type: 'workshop', title: id, date, audience: 'Todo el jardín', ...overrides };
}

describe('markedDays', () => {
  it('marks event days and no-class days of the shown month only', () => {
    const events = [
      event('a', '2026-10-13', { type: 'no_classes' }),
      event('b', '2026-10-28'),
      event('c', '2026-11-04'),
    ];
    const marked = markedDays(events, 2026, 9);
    expect([...marked.withEvents]).toEqual([28]);
    expect([...marked.noClasses]).toEqual([13]);
  });
});

describe('eventsOnDate', () => {
  it('lists the day events by start time, all-day first', () => {
    const events = [
      event('late', '2026-10-28', { time_start: '15:00' }),
      event('early', '2026-10-28', { time_start: '9:30' }),
      event('allDay', '2026-10-28'),
      event('other', '2026-10-29', { time_start: '8:00' }),
    ];
    expect(eventsOnDate(events, '2026-10-28').map((item) => item.id)).toEqual(['allDay', 'early', 'late']);
  });
});

describe('upcomingFrom and pastBefore', () => {
  const events = [
    event('past', '2026-10-13'),
    event('older', '2026-10-02'),
    event('today', '2026-10-24'),
    event('later', '2026-11-04'),
    event('soon', '2026-10-28'),
  ];

  it('lists today and later events, soonest first', () => {
    expect(upcomingFrom(events, '2026-10-24').map((item) => item.id)).toEqual(['today', 'soon', 'later']);
  });

  it('lists the events before today, newest first', () => {
    expect(pastBefore(events, '2026-10-24').map((item) => item.id)).toEqual(['past', 'older']);
  });
});

describe('monthPeriod', () => {
  it('tells the current, a past and a later month apart', () => {
    expect(monthPeriod(2026, 9, NOW)).toBe('current');
    expect(monthPeriod(2025, 11, NOW)).toBe('past');
    expect(monthPeriod(2027, 0, NOW)).toBe('future');
  });
});

describe('calendarList', () => {
  const october = [event('past', '2026-10-13'), event('soon', '2026-10-28')];
  const upcoming = [event('soon', '2026-10-28'), event('november', '2026-11-04')];
  const base = { year: 2026, month: 9, selectedDay: null, pastShown: false, monthEvents: october, upcomingEvents: upcoming, today: NOW };

  it('lists what comes from today on in the current month and counts its past events', () => {
    const list = calendarList(base);
    expect(list.kind).toBe('upcoming');
    expect(list.events.map((item) => item.id)).toEqual(['soon', 'november']);
    expect(list.pastCount).toBe(1);
  });

  it('lists the past events of the current month when asked', () => {
    const list = calendarList({ ...base, pastShown: true });
    expect(list.kind).toBe('past');
    expect(list.events.map((item) => item.id)).toEqual(['past']);
  });

  it('lists only the tapped day', () => {
    const list = calendarList({ ...base, selectedDay: 13 });
    expect(list.kind).toBe('day');
    expect(list.events.map((item) => item.id)).toEqual(['past']);
  });

  it('lists a past month newest first', () => {
    const december = [event('meeting', '2025-12-02'), event('show', '2025-12-19')];
    const list = calendarList({ ...base, year: 2025, month: 11, monthEvents: december });
    expect(list.kind).toBe('past');
    expect(list.events.map((item) => item.id)).toEqual(['show', 'meeting']);
  });

  it('lists a later month on its own', () => {
    const december = [event('party', '2026-12-19')];
    const list = calendarList({ ...base, month: 11, monthEvents: december });
    expect(list.kind).toBe('upcoming');
    expect(list.events.map((item) => item.id)).toEqual(['party']);
    expect(list.pastCount).toBe(0);
  });
});

describe('monthBounds', () => {
  it('runs from the first local midnight of the month to the first of the next', () => {
    const { start, end } = monthBounds(2026, 11);
    expect(start).toEqual(new Date(2026, 11, 1));
    expect(end).toEqual(new Date(2027, 0, 1));
  });
});

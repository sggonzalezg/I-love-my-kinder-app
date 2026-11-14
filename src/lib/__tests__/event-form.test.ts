import {
  FORM_EVENT_TYPES,
  audienceOptions,
  canCreateEvents,
  canEditEvent,
  canSaveEvent,
  dateSheetDoneLabel,
  emptyEventForm,
  eventChange,
  eventInstants,
  eventWriteRow,
  formDayLabel,
  formShortDayLabel,
  formValuesFromRow,
  isFormDirty,
  notifyFamiliesLine,
  savedEventToast,
  timeError,
  type EventFormValues,
} from '@/lib/event-form';

const MORNING_GROUP = { roomId: 'room-2', roomName: 'Sala 2', shiftId: 'shift-am', shift: 'morning' as const };
const AFTERNOON_GROUP = { roomId: 'room-2', roomName: 'Sala 2', shiftId: 'shift-pm', shift: 'afternoon' as const };

function filledForm(overrides: Partial<EventFormValues> = {}): EventFormValues {
  return {
    ...emptyEventForm('room-2:shift-am'),
    type: 'workshop',
    title: 'Taller de huerta con familias',
    date: '2026-10-28',
    startTime: '09:30',
    endTime: '11:00',
    ...overrides,
  };
}

describe('FORM_EVENT_TYPES', () => {
  it('offers the six types in the mockup order, Salida included', () => {
    expect(FORM_EVENT_TYPES).toEqual(['workshop', 'meeting', 'outing', 'celebration', 'no_classes', 'other']);
  });
});

describe('audienceOptions', () => {
  it('lists each group and then each room with both shifts', () => {
    const options = audienceOptions([MORNING_GROUP, AFTERNOON_GROUP]);

    expect(options.map((option) => option.label)).toEqual(['Sala 2 · Matutino', 'Sala 2 · Vespertino', 'Sala 2 · ambos turnos']);
  });

  it('gives the room option no shift', () => {
    const roomOption = audienceOptions([MORNING_GROUP])[1];

    expect(roomOption).toEqual({ key: 'room-2:', roomId: 'room-2', shiftId: null, label: 'Sala 2 · ambos turnos' });
  });
});

describe('timeError', () => {
  it('explains an end before the start', () => {
    expect(timeError(filledForm({ endTime: '08:00' }))).toBe('Termina antes de empezar. Elegí una hora después de las 9:30.');
  });

  it('has no error when the end comes after the start', () => {
    expect(timeError(filledForm())).toBeNull();
  });

  it('ignores the times of an all-day event', () => {
    expect(timeError(filledForm({ allDay: true, endTime: '08:00' }))).toBeNull();
  });
});

describe('canSaveEvent', () => {
  it('accepts a filled form', () => {
    expect(canSaveEvent(filledForm())).toBe(true);
  });

  it('needs a type', () => {
    expect(canSaveEvent(filledForm({ type: null }))).toBe(false);
  });

  it('needs a title that is not only spaces', () => {
    expect(canSaveEvent(filledForm({ title: '   ' }))).toBe(false);
  });

  it('needs a day', () => {
    expect(canSaveEvent(filledForm({ date: null }))).toBe(false);
  });

  it('needs an audience', () => {
    expect(canSaveEvent(filledForm({ audienceKey: null }))).toBe(false);
  });

  it('refuses an end before the start', () => {
    expect(canSaveEvent(filledForm({ endTime: '08:00' }))).toBe(false);
  });

  it('needs where and how an outing goes', () => {
    expect(canSaveEvent(filledForm({ type: 'outing', place: 'Parque Rodó' }))).toBe(false);
  });
});

describe('eventInstants', () => {
  it('joins the day and the local times', () => {
    const { startsAt, endsAt } = eventInstants(filledForm());

    expect(startsAt).toEqual(new Date(2026, 9, 28, 9, 30));
    expect(endsAt).toEqual(new Date(2026, 9, 28, 11, 0));
  });

  it('runs an all-day event from midnight to the next midnight', () => {
    const { startsAt, endsAt } = eventInstants(filledForm({ allDay: true }));

    expect(startsAt).toEqual(new Date(2026, 9, 28));
    expect(endsAt).toEqual(new Date(2026, 9, 29));
  });

  it('runs a several-day event to the midnight after its last day', () => {
    const { endsAt } = eventInstants(filledForm({ allDay: true, date: '2026-07-21', untilDate: '2026-08-01' }));

    expect(endsAt).toEqual(new Date(2026, 7, 2));
  });
});

describe('eventWriteRow', () => {
  it('maps the form to the events columns', () => {
    const audience = audienceOptions([MORNING_GROUP])[0];

    const row = eventWriteRow(filledForm({ title: '  Taller  ', place: ' Huerta ', description: '' }), audience);

    expect(row).toEqual({
      title: 'Taller',
      event_type: 'workshop',
      starts_at: new Date(2026, 9, 28, 9, 30).toISOString(),
      ends_at: new Date(2026, 9, 28, 11, 0).toISOString(),
      all_day: false,
      location: 'Huerta',
      description: null,
      room_id: 'room-2',
      shift_id: 'shift-am',
      remind_day_before: true,
      transport: null,
    });
  });

  it('stores how an outing goes and never makes it all day', () => {
    const audience = audienceOptions([MORNING_GROUP])[0];

    const row = eventWriteRow(filledForm({ type: 'outing', allDay: true, place: 'Parque Rodó', transportChoice: 'hiredBus' }), audience);

    expect(row).toMatchObject({ event_type: 'outing', all_day: false, transport: 'Ómnibus contratado' });
  });
});

describe('formValuesFromRow', () => {
  it('fills the form back from a stored timed event', () => {
    const audience = audienceOptions([MORNING_GROUP])[0];
    const values = filledForm({ place: 'Huerta', description: 'Traer guantes', remindDayBefore: false });

    expect(formValuesFromRow({ ...eventWriteRow(values, audience) })).toEqual(values);
  });

  it('fills an outing back with its transport', () => {
    const audience = audienceOptions([MORNING_GROUP])[0];
    const values = filledForm({ type: 'outing', place: 'Parque Rodó', transportChoice: 'other', otherTransport: 'En camioneta' });

    expect(formValuesFromRow(eventWriteRow(values, audience))).toEqual(values);
  });

  it('fills the last day of a stored several-day event', () => {
    const audience = audienceOptions([MORNING_GROUP])[1];
    const values = filledForm({ allDay: true, date: '2026-07-21', untilDate: '2026-08-01', audienceKey: 'room-2:', startTime: '09:00', endTime: '10:00' });

    expect(formValuesFromRow(eventWriteRow(values, audience))).toEqual(values);
  });

  it('leaves Hasta empty for a one-day all-day event', () => {
    const audience = audienceOptions([MORNING_GROUP])[0];

    expect(formValuesFromRow(eventWriteRow(filledForm({ allDay: true }), audience)).untilDate).toBeNull();
  });
});

describe('eventChange', () => {
  it('records the old start when the start moved', () => {
    const now = new Date(2026, 9, 20, 12);

    expect(eventChange('2026-10-28T12:30:00.000Z', '2026-10-28T13:00:00.000Z', now)).toEqual({
      changed_at: now.toISOString(),
      previous_values: { starts_at: '2026-10-28T12:30:00.000Z' },
    });
  });

  it('records nothing when the start stayed', () => {
    expect(eventChange('2026-10-28T12:30:00.000Z', '2026-10-28T12:30:00.000Z', new Date())).toEqual({});
  });
});

describe('isFormDirty', () => {
  it('is clean while nothing changed', () => {
    expect(isFormDirty(filledForm(), filledForm())).toBe(false);
  });

  it('is dirty once a field changed', () => {
    expect(isFormDirty(filledForm(), filledForm({ title: 'Otro' }))).toBe(true);
  });
});

describe('labels', () => {
  it('writes the day with the long weekday and short month', () => {
    expect(formDayLabel('2026-10-28')).toBe('Miércoles 28 oct');
  });

  it('writes Desde and Hasta with the short weekday', () => {
    expect(formShortDayLabel('2026-07-21')).toBe('Mar 21 jul');
  });

  it('names the chosen day on the sheet button', () => {
    expect(dateSheetDoneLabel('2026-10-28')).toBe('Listo · miércoles 28');
  });

  it('counts the families of a group', () => {
    expect(notifyFamiliesLine('Sala 2 · Matutino', 26)).toBe('26 familias de Sala 2 · Matutino');
  });

  it('names the families without a count', () => {
    expect(notifyFamiliesLine('Sala 2 · ambos turnos', null)).toBe('Las familias de Sala 2 · ambos turnos');
  });
});

describe('savedEventToast', () => {
  it('says how many families were told', () => {
    expect(savedEventToast(false, 26)).toBe('Evento guardado. Les avisamos a 26 familias.');
  });

  it('says one family in singular', () => {
    expect(savedEventToast(false, 1)).toBe('Evento guardado. Les avisamos a 1 familia.');
  });

  it('tells the families in general without a count', () => {
    expect(savedEventToast(false, null)).toBe('Evento guardado. Les avisamos a las familias.');
  });

  it('confirms an edit', () => {
    expect(savedEventToast(true, 26)).toBe('Cambios guardados.');
  });
});

describe('event permissions', () => {
  it('lets a teacher create events', () => {
    expect(canCreateEvents('teacher')).toBe(true);
  });

  it('keeps families from creating events', () => {
    expect(canCreateEvents('family')).toBe(false);
  });

  it('lets a teacher edit her own event', () => {
    expect(canEditEvent('teacher', true)).toBe(true);
  });

  it('keeps a teacher from editing an event she did not create', () => {
    expect(canEditEvent('teacher', false)).toBe(false);
  });

  it('keeps families from editing events', () => {
    expect(canEditEvent('family', true)).toBe(false);
  });
});

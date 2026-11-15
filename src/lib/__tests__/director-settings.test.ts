import {
  changedShifts,
  hasSettingsChanges,
  nurseryDetailsOf,
  nurseryFieldErrors,
  nurseryUpdate,
  settingsShifts,
  shiftTimeError,
  shiftUpsertRows,
} from '../director-settings';

const SAVED_DETAILS = { address: 'Av. Rivera 3456, Montevideo', contactPhone: '094 555 010', urgentPhone: '094 555 010' };

describe('settingsShifts', () => {
  it('lists the morning shift before the afternoon one, with short times', () => {
    const shifts = settingsShifts([
      { name: 'afternoon', start_time: '13:00:00', end_time: '18:00:00' },
      { name: 'morning', start_time: '08:00:00', end_time: '12:30:00' },
    ]);

    expect(shifts).toEqual([
      { name: 'morning', startTime: '08:00', endTime: '12:30' },
      { name: 'afternoon', startTime: '13:00', endTime: '18:00' },
    ]);
  });

  it('adds a shift the nursery has no row for, with no times', () => {
    const shifts = settingsShifts([{ name: 'morning', start_time: '08:00:00', end_time: '12:30:00' }]);

    expect(shifts[1]).toEqual({ name: 'afternoon', startTime: null, endTime: null });
  });
});

describe('nurseryDetailsOf', () => {
  it('turns the stored row into field values', () => {
    const details = nurseryDetailsOf({ address: 'Av. Rivera 3456', contact_phone: '+59894555010', urgent_phone: '+59822222224' });

    expect(details).toEqual({ address: 'Av. Rivera 3456', contactPhone: '094 555 010', urgentPhone: '2222 2224' });
  });

  it('leaves missing values empty', () => {
    expect(nurseryDetailsOf({ address: null, contact_phone: null, urgent_phone: null })).toEqual({ address: '', contactPhone: '', urgentPhone: '' });
  });
});

describe('nurseryFieldErrors', () => {
  it('has no errors for the stored values', () => {
    expect(nurseryFieldErrors(SAVED_DETAILS, SAVED_DETAILS)).toEqual({});
  });

  it('refuses emptying a field that had a value', () => {
    const errors = nurseryFieldErrors(SAVED_DETAILS, { ...SAVED_DETAILS, address: '  ' });

    expect(errors.address).toBe('No puede quedar vacío.');
  });

  it('lets a field the nursery never filled stay empty', () => {
    const saved = { ...SAVED_DETAILS, urgentPhone: '' };

    expect(nurseryFieldErrors(saved, saved)).toEqual({});
  });

  it('refuses an address over 200 characters', () => {
    const errors = nurseryFieldErrors(SAVED_DETAILS, { ...SAVED_DETAILS, address: 'a'.repeat(201) });

    expect(errors.address).toBe('La dirección puede tener hasta 200 letras.');
  });

  it('asks to check a short urgent phone with the design copy', () => {
    const errors = nurseryFieldErrors(SAVED_DETAILS, { ...SAVED_DETAILS, urgentPhone: '094 55' });

    expect(errors.urgentPhone).toBe('Revisá el número: las familias lo llaman en una urgencia.');
  });

  it('accepts a landline as the urgent phone', () => {
    expect(nurseryFieldErrors(SAVED_DETAILS, { ...SAVED_DETAILS, urgentPhone: '2222 2224' })).toEqual({});
  });

  it('refuses a landline as the WhatsApp contact', () => {
    const errors = nurseryFieldErrors(SAVED_DETAILS, { ...SAVED_DETAILS, contactPhone: '2222 2224' });

    expect(errors.contactPhone).toBe('Revisá el número: tiene que ser un celular con WhatsApp.');
  });
});

describe('shiftTimeError', () => {
  it('has no error when the shift ends after it starts', () => {
    expect(shiftTimeError({ name: 'morning', startTime: '08:00', endTime: '12:30' })).toBeNull();
  });

  it('says the shift ends before it starts', () => {
    expect(shiftTimeError({ name: 'afternoon', startTime: '18:00', endTime: '13:00' })).toBe('El turno vespertino termina antes de empezar.');
  });

  it('treats the same start and end as ending before starting', () => {
    expect(shiftTimeError({ name: 'morning', startTime: '08:00', endTime: '08:00' })).toBe('El turno matutino termina antes de empezar.');
  });

  it('asks for both times when only one is set', () => {
    expect(shiftTimeError({ name: 'afternoon', startTime: '13:00', endTime: null })).toBe('Elegí cuándo empieza y termina el turno vespertino.');
  });

  it('has no error for a shift that never had times', () => {
    expect(shiftTimeError({ name: 'afternoon', startTime: null, endTime: null })).toBeNull();
  });
});

describe('changes to save', () => {
  const savedShifts = settingsShifts([
    { name: 'morning', start_time: '08:00:00', end_time: '12:30:00' },
    { name: 'afternoon', start_time: '13:00:00', end_time: '18:00:00' },
  ]);

  it('maps only the changed fields to their columns, phones in E.164', () => {
    const update = nurseryUpdate(SAVED_DETAILS, { ...SAVED_DETAILS, urgentPhone: '2222 2224', address: ' Av. Italia 10 ' });

    expect(update).toEqual({ address: 'Av. Italia 10', urgent_phone: '+59822222224' });
  });

  it('keeps only the shifts whose times changed', () => {
    const edited = [savedShifts[0], { ...savedShifts[1], endTime: '18:30' }];

    expect(changedShifts(savedShifts, edited)).toEqual([{ name: 'afternoon', startTime: '13:00', endTime: '18:30' }]);
  });

  it('writes the changed shifts by nursery and name', () => {
    const rows = shiftUpsertRows('nursery-1', [{ name: 'afternoon', startTime: '13:00', endTime: '18:30' }]);

    expect(rows).toEqual([{ nursery_id: 'nursery-1', name: 'afternoon', start_time: '13:00', end_time: '18:30' }]);
  });

  it('sees no changes on the stored settings', () => {
    expect(hasSettingsChanges({ details: SAVED_DETAILS, shifts: savedShifts }, { details: SAVED_DETAILS, shifts: savedShifts })).toBe(false);
  });

  it('sees a change in one field', () => {
    const edited = { details: { ...SAVED_DETAILS, address: 'Av. Italia 10' }, shifts: savedShifts };

    expect(hasSettingsChanges({ details: SAVED_DETAILS, shifts: savedShifts }, edited)).toBe(true);
  });
});

import {
  EMPTY_NEW_CHILD_VALUES,
  NEW_CHILD_MESSAGES,
  birthDateToIso,
  createChildArgs,
  newChildSaveError,
  roomChoices,
  shiftChoices,
  validateNewChild,
  withDefaultShift,
  type NewChildFormValues,
} from '../new-child-form';

const TODAY = new Date(2026, 10, 15);

const VALID_VALUES: NewChildFormValues = {
  firstName: ' Julieta ',
  lastName: 'Sosa ',
  birthDate: '12/05/2023',
  nationalId: '4.876.543-8',
  roomId: 'room-2',
  shiftId: 'shift-morning',
};

describe('birthDateToIso', () => {
  it('reads a day written as dd/mm/yyyy', () => {
    expect(birthDateToIso('12/05/2023')).toBe('2023-05-12');
  });

  it('accepts one-digit day and month', () => {
    expect(birthDateToIso('3/7/2024')).toBe('2024-07-03');
  });

  it('refuses a day the calendar does not have', () => {
    expect(birthDateToIso('31/02/2024')).toBeNull();
  });

  it('refuses another format', () => {
    expect(birthDateToIso('2024-07-03')).toBeNull();
  });
});

describe('validateNewChild', () => {
  it('passes complete values', () => {
    expect(validateNewChild(VALID_VALUES, TODAY)).toEqual({});
  });

  it('asks for every required field of an empty form', () => {
    expect(Object.keys(validateNewChild(EMPTY_NEW_CHILD_VALUES, TODAY)).sort()).toEqual(
      ['birthDate', 'firstName', 'lastName', 'nationalId', 'roomId', 'shiftId'].sort(),
    );
  });

  it('refuses names with spaces only', () => {
    expect(validateNewChild({ ...VALID_VALUES, firstName: '   ' }, TODAY).firstName).toBe(NEW_CHILD_MESSAGES.firstNameMissing);
  });

  it('refuses a future birth date', () => {
    expect(validateNewChild({ ...VALID_VALUES, birthDate: '12/05/2032' }, TODAY).birthDate).toBe(NEW_CHILD_MESSAGES.birthDateFuture);
  });

  it('accepts a child born today', () => {
    expect(validateNewChild({ ...VALID_VALUES, birthDate: '15/11/2026' }, TODAY).birthDate).toBeUndefined();
  });

  it('flags a birth date that is not a date', () => {
    expect(validateNewChild({ ...VALID_VALUES, birthDate: '12/13/2023' }, TODAY).birthDate).toBe(NEW_CHILD_MESSAGES.birthDateInvalid);
  });

  it('flags a cédula with a wrong check digit', () => {
    expect(validateNewChild({ ...VALID_VALUES, nationalId: '4.876.543-7' }, TODAY).nationalId).toBeDefined();
  });
});

describe('createChildArgs', () => {
  it('sends trimmed names, the ISO date and the cédula digits', () => {
    expect(createChildArgs('nursery-1', VALID_VALUES)).toEqual({
      target_nursery_id: 'nursery-1',
      child_first_name: 'Julieta',
      child_last_name: 'Sosa',
      child_birth_date: '2023-05-12',
      child_national_id: '48765438',
      target_room_id: 'room-2',
      target_shift_id: 'shift-morning',
    });
  });
});

describe('newChildSaveError', () => {
  it('puts a taken cédula under the cédula field', () => {
    expect(newChildSaveError('national_id_taken')).toEqual({ field: 'nationalId', message: NEW_CHILD_MESSAGES.nationalIdOfOtherChild });
  });

  it('puts a wrong check digit under the cédula field', () => {
    expect(newChildSaveError('national_id_wrong_check_digit').field).toBe('nationalId');
  });

  it('explains a group that left the nursery', () => {
    expect(newChildSaveError('group_not_in_nursery')).toEqual({ field: null, message: NEW_CHILD_MESSAGES.groupNotInNursery });
  });

  it('falls back to a general message', () => {
    expect(newChildSaveError('fetch failed')).toEqual({ field: null, message: NEW_CHILD_MESSAGES.saveFailed });
  });
});

describe('roomChoices', () => {
  it('orders rooms by name with numbers in order', () => {
    const rooms = [
      { id: 'r10', name: 'Sala 10' },
      { id: 'r2', name: 'Sala 2' },
    ];

    expect(roomChoices(rooms).map((choice) => choice.label)).toEqual(['Sala 2', 'Sala 10']);
  });
});

describe('withDefaultShift', () => {
  const shifts = [
    { value: 's1', label: 'Matutino' },
    { value: 's2', label: 'Vespertino' },
  ];

  it('starts on the first shift', () => {
    expect(withDefaultShift(EMPTY_NEW_CHILD_VALUES, shifts).shiftId).toBe('s1');
  });

  it('keeps the shift the director chose', () => {
    expect(withDefaultShift({ ...EMPTY_NEW_CHILD_VALUES, shiftId: 's2' }, shifts).shiftId).toBe('s2');
  });

  it('leaves no shift when the nursery has none', () => {
    expect(withDefaultShift(EMPTY_NEW_CHILD_VALUES, []).shiftId).toBeNull();
  });
});

describe('shiftChoices', () => {
  it('puts the morning first with its Spanish label', () => {
    const shifts = [
      { id: 's2', name: 'afternoon' as const },
      { id: 's1', name: 'morning' as const },
    ];

    expect(shiftChoices(shifts)).toEqual([
      { value: 's1', label: 'Matutino' },
      { value: 's2', label: 'Vespertino' },
    ]);
  });
});

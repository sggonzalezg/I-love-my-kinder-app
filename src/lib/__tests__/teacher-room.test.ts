import { childCountLabel, nextBirthdayLine, roomBirthdays, todayBirthdayLine, turningLabel } from '../teacher-room';

const TODAY = new Date(2026, 9, 25);

describe('roomBirthdays', () => {
  it('splits a birthday today from the upcoming ones, in date order', () => {
    const children = [
      { id: 'bruno', name: 'Bruno García', firstName: 'Bruno', birthDate: '2023-10-28' },
      { id: 'valentina', name: 'Valentina Méndez', firstName: 'Valentina', birthDate: '2023-10-25' },
      { id: 'lucia', name: 'Lucía Pereira', firstName: 'Lucía', birthDate: '2024-10-31' },
    ];

    const birthdays = roomBirthdays(children, TODAY);

    expect(birthdays.today.map((birthday) => birthday.firstName)).toEqual(['Valentina']);
    expect(birthdays.upcoming.map((birthday) => birthday.name)).toEqual(['Bruno García', 'Lucía Pereira']);
  });

  it('keeps the upcoming list to the next 30 days and has no next birthday then', () => {
    const children = [
      { id: 'bruno', name: 'Bruno García', firstName: 'Bruno', birthDate: '2023-10-28' },
      { id: 'martina', name: 'Martina Silva', firstName: 'Martina', birthDate: '2023-12-05' },
    ];

    const birthdays = roomBirthdays(children, TODAY);

    expect(birthdays.upcoming.map((birthday) => birthday.firstName)).toEqual(['Bruno']);
    expect(birthdays.next).toBeNull();
  });

  it('gives the first birthday after the window when none is close', () => {
    const children = [
      { id: 'tomas', name: 'Tomás Rivas', firstName: 'Tomás', birthDate: '2023-05-12' },
      { id: 'martina', name: 'Martina Silva', firstName: 'Martina', birthDate: '2023-12-05' },
    ];

    const birthdays = roomBirthdays(children, TODAY);

    expect(birthdays.upcoming).toEqual([]);
    expect(birthdays.next?.firstName).toBe('Martina');
  });

  it('has no next birthday when no child has a birth date', () => {
    const children = [{ id: 'tomas', name: 'Tomás Rivas', firstName: 'Tomás', birthDate: null }];

    expect(roomBirthdays(children, TODAY).next).toBeNull();
  });
});

describe('birthday lines', () => {
  it('names the next birthday with its full date', () => {
    expect(nextBirthdayLine({ day: 5, month: 'diciembre', firstName: 'Martina' })).toBe('El próximo es el 5 de diciembre: Martina.');
  });

  it('gives the age and the group of a birthday today', () => {
    expect(todayBirthdayLine(3, 'Sala 2 · Matutino')).toBe('3 años · Sala 2 · Matutino');
  });

  it('uses the singular for a first birthday', () => {
    expect(todayBirthdayLine(1, 'Sala 1 · Matutino')).toBe('1 año · Sala 1 · Matutino');
  });

  it('says the age a child turns', () => {
    expect(turningLabel(3)).toBe('Cumple 3');
  });
});

describe('childCountLabel', () => {
  it('counts children in the plural', () => {
    expect(childCountLabel(15)).toBe('15 niños');
  });

  it('counts one child in the singular', () => {
    expect(childCountLabel(1)).toBe('1 niño');
  });
});

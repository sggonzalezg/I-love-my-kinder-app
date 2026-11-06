import { birthdayLabel, upcomingBirthdays } from '../birthdays';

const TODAY = new Date(2026, 9, 25);

describe('birthdayLabel', () => {
  it('shows day and month without the year', () => {
    expect(birthdayLabel('2023-05-12')).toBe('12 de mayo');
  });
});

describe('upcomingBirthdays', () => {
  it('orders children by the next birthday from today', () => {
    const children = [
      { id: 'tomas', name: 'Tomás R.', birthDate: '2023-05-12' },
      { id: 'bruno', name: 'Bruno G.', birthDate: '2023-10-28' },
      { id: 'valentin', name: 'Valentín R.', birthDate: '2022-11-05' },
    ];

    const result = upcomingBirthdays(children, TODAY, 365);

    expect(result.map((birthday) => birthday.id)).toEqual(['bruno', 'valentin', 'tomas']);
  });

  it('marks a birthday today and the age the child turns', () => {
    const children = [{ id: 'valentina', name: 'Valentina M.', birthDate: '2023-10-25' }];

    const [birthday] = upcomingBirthdays(children, TODAY);

    expect(birthday.isToday).toBe(true);
    expect(birthday.ageTurning).toBe(3);
  });

  it('gives the date tile and weekday of the next birthday', () => {
    const children = [{ id: 'bruno', name: 'Bruno G.', birthDate: '2023-10-28' }];

    const [birthday] = upcomingBirthdays(children, TODAY);

    expect(birthday).toMatchObject({ day: 28, monthShort: 'oct', weekday: 'Miércoles', isToday: false });
  });

  it('leaves out children without a visible birthday', () => {
    const children = [{ id: 'hidden', name: 'L.', birthDate: null }];

    expect(upcomingBirthdays(children, TODAY)).toEqual([]);
  });

  it('keeps only the birthdays inside the window', () => {
    const children = [{ id: 'tomas', name: 'Tomás R.', birthDate: '2023-05-12' }];

    expect(upcomingBirthdays(children, TODAY, 30)).toEqual([]);
  });

  it('moves a 29 February birthday to 1 March in a common year', () => {
    const children = [{ id: 'leap', name: 'Leo P.', birthDate: '2024-02-29' }];

    const [birthday] = upcomingBirthdays(children, new Date(2027, 1, 20));

    expect(birthday).toMatchObject({ day: 1, monthShort: 'mar' });
  });
});

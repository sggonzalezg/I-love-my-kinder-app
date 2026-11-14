import { ageLabel, allergyState, childFileSubtitle, detailLine, formatNationalId, maskNationalId } from '../child-file';

const TODAY = new Date(2026, 10, 12);

describe('allergyState', () => {
  it('says there are none when nothing is recorded', () => {
    expect(allergyState(null)).toBe('none');
    expect(allergyState('   ')).toBe('none');
  });

  it('lists the recorded allergies', () => {
    expect(allergyState('Maní')).toBe('listed');
  });
});

describe('ageLabel', () => {
  it('counts whole years until the birthday comes', () => {
    expect(ageLabel('2023-11-13', TODAY)).toBe('2 años');
    expect(ageLabel('2023-11-12', TODAY)).toBe('3 años');
  });

  it('uses the singular for one year', () => {
    expect(ageLabel('2025-01-05', TODAY)).toBe('1 año');
  });

  it('counts months under one year', () => {
    expect(ageLabel('2026-03-20', TODAY)).toBe('7 meses');
    expect(ageLabel('2026-10-01', TODAY)).toBe('1 mes');
  });
});

describe('childFileSubtitle', () => {
  it('joins the groups and the age', () => {
    expect(childFileSubtitle(['Sala 2 · Matutino'], '2023-05-01', TODAY)).toBe('Sala 2 · Matutino · 3 años');
  });

  it('leaves the age out without a birth date', () => {
    expect(childFileSubtitle(['Sala 2 · Matutino', 'Sala 2 · Vespertino'], null, TODAY)).toBe('Sala 2 · Matutino · Sala 2 · Vespertino');
  });
});

describe('national id', () => {
  it('formats a cédula with dots and the check digit', () => {
    expect(formatNationalId('12345678')).toBe('1.234.567-8');
    expect(formatNationalId('9876543')).toBe('987.654-3');
  });

  it('masks every digit but the check digit', () => {
    expect(maskNationalId('12345678')).toBe('•••••••-8');
  });
});

describe('detailLine', () => {
  it('joins the parts that exist', () => {
    expect(detailLine(['Madre', '099 456 789'])).toBe('Madre · 099 456 789');
    expect(detailLine([null, '099 456 789'])).toBe('099 456 789');
  });
});

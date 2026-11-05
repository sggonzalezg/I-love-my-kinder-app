import { currentShift, groupLabel, shiftBandTitle, shiftLabel } from '../shift';

describe('shift helpers', () => {
  it('uses the client terms Matutino and Vespertino', () => {
    expect(shiftLabel('morning')).toBe('Matutino');
    expect(shiftLabel('afternoon')).toBe('Vespertino');
  });

  it('builds the band title "Turno matutino"', () => {
    expect(shiftBandTitle('morning')).toBe('Turno matutino');
    expect(shiftBandTitle('afternoon')).toBe('Turno vespertino');
  });

  it('opens on Vespertino from 13:00 (design F6)', () => {
    expect(currentShift(new Date(2026, 9, 24, 12, 59))).toBe('morning');
    expect(currentShift(new Date(2026, 9, 24, 13, 0))).toBe('afternoon');
  });

  it('labels a group as "Sala 2 · Matutino"', () => {
    expect(groupLabel('Sala 2', 'morning')).toBe('Sala 2 · Matutino');
  });
});

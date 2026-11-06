import { classmateInitials, classmateName } from '../classmates';

describe('classmateName', () => {
  it('shows the first name and the last initial of a visible child', () => {
    expect(classmateName({ first_name: 'Bruno', last_name: 'González', display_name: 'Bruno González' })).toBe('Bruno G.');
  });

  it('shows only what the server left for a child without the visibility authorization', () => {
    expect(classmateName({ first_name: null, last_name: null, display_name: 'L.' })).toBe('L.');
  });
});

describe('classmateInitials', () => {
  it('uses first and last initials of a visible child', () => {
    expect(classmateInitials({ first_name: 'Valentina', last_name: 'Méndez', display_name: 'Valentina Méndez' })).toBe('VM');
  });

  it('uses the masked name of a hidden child', () => {
    expect(classmateInitials({ first_name: null, last_name: null, display_name: 'L.' })).toBe('L');
  });
});

import { classmateInitials, classmateName } from '../classmates';

describe('classmateName', () => {
  it('shows the first name and the last initial', () => {
    expect(classmateName({ first_name: 'Bruno', last_name: 'González' })).toBe('Bruno G.');
  });

  it('shows only the first name when there is no last name', () => {
    expect(classmateName({ first_name: 'Bruno', last_name: '' })).toBe('Bruno');
  });
});

describe('classmateInitials', () => {
  it('uses first and last initials', () => {
    expect(classmateInitials({ first_name: 'Valentina', last_name: 'Méndez' })).toBe('VM');
  });
});

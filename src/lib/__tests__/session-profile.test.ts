import { linkedProfile, type LinkedRows } from '../session-profile';

const NO_ROWS: LinkedRows = { familyMembers: [], teachers: [], directors: [] };

const ana = { id: 'f1', nursery_id: 'n1', first_name: 'Ana', last_name: 'Rodríguez', photo_path: 'n1/ana.jpg' };
const sofia = { id: 't1', nursery_id: 'n1', first_name: 'Sofía', last_name: 'Martínez', photo_path: null, status: 'active' };
const carolina = { id: 'd1', nursery_id: 'n1', first_name: 'Carolina', last_name: 'Pérez' };

describe('linkedProfile', () => {
  it('gives a family member the family role, her nursery, full name and photo', () => {
    expect(linkedProfile({ ...NO_ROWS, familyMembers: [ana] })).toEqual({
      roles: ['family'],
      activeRole: 'family',
      nurseryId: 'n1',
      personName: 'Ana Rodríguez',
      photoPath: 'n1/ana.jpg',
    });
  });

  it('gives an active teacher the teacher role', () => {
    expect(linkedProfile({ ...NO_ROWS, teachers: [sofia] })).toMatchObject({ roles: ['teacher'], activeRole: 'teacher', personName: 'Sofía Martínez' });
  });

  it('gives a teacher still invited the teacher role', () => {
    expect(linkedProfile({ ...NO_ROWS, teachers: [{ ...sofia, status: 'invited' }] })).toMatchObject({ roles: ['teacher'] });
  });

  it('gives the direction the director role from her own directors row', () => {
    expect(linkedProfile({ ...NO_ROWS, directors: [carolina] })).toMatchObject({ roles: ['director'], activeRole: 'director', personName: 'Carolina Pérez' });
  });

  it('leaves out an inactive teacher, so an account with only that row is deactivated', () => {
    expect(linkedProfile({ ...NO_ROWS, teachers: [{ ...sofia, status: 'inactive' }] })).toBeNull();
  });

  it('reads an account with no linked rows as deactivated (access removed, or a director not allowlisted)', () => {
    expect(linkedProfile(NO_ROWS)).toBeNull();
  });

  it('keeps the family role of a mother whose teacher row is inactive', () => {
    expect(linkedProfile({ ...NO_ROWS, familyMembers: [ana], teachers: [{ ...sofia, status: 'inactive' }] })).toMatchObject({ roles: ['family'] });
  });

  it('names the person from the row of the role she opens with', () => {
    expect(linkedProfile({ ...NO_ROWS, familyMembers: [ana], teachers: [sofia] })).toMatchObject({
      roles: ['family', 'teacher'],
      activeRole: 'teacher',
      personName: 'Sofía Martínez',
      photoPath: null,
    });
  });
});

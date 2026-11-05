import { getActiveRole, resolveRoles } from '../role';

describe('role', () => {
  it('resolves family from family_members', () => {
    const roles = resolveRoles({ user_id: 'u1', family_members: [{ id: 'f1' }] });
    expect(roles).toContain('family');
  });

  it('resolves teacher from teachers', () => {
    const roles = resolveRoles({ user_id: 'u1', teachers: [{ id: 't1' }] });
    expect(roles).toContain('teacher');
  });

  it('resolves director from directors', () => {
    const roles = resolveRoles({ user_id: 'u1', directors: [{ id: 'd1' }] });
    expect(roles).toContain('director');
  });

  it('resolves director from teacher with role=director', () => {
    const roles = resolveRoles({ user_id: 'u1', teachers: [{ id: 't1', role: 'director' }] });
    expect(roles).toContain('director');
  });

  it('handles multiple roles', () => {
    const roles = resolveRoles({
      user_id: 'u1',
      family_members: [{ id: 'f1' }],
      teachers: [{ id: 't1' }],
    });
    expect(roles).toEqual(expect.arrayContaining(['family', 'teacher']));
  });

  it('returns empty array for null profile', () => {
    expect(resolveRoles(null)).toEqual([]);
  });

  it('defaults to active role if saved role is not in roles', () => {
    const active = getActiveRole(['family'], 'teacher');
    expect(active).toBe('family');
  });

  it('keeps saved role if it is in roles', () => {
    const active = getActiveRole(['family', 'teacher'], 'teacher');
    expect(active).toBe('teacher');
  });

  it('defaults to teacher over family', () => {
    const active = getActiveRole(['family', 'teacher'], null);
    expect(active).toBe('teacher');
  });

  it('defaults to family if no teacher', () => {
    const active = getActiveRole(['family'], null);
    expect(active).toBe('family');
  });

  it('defaults to director if that is the only role', () => {
    const active = getActiveRole(['director'], null);
    expect(active).toBe('director');
  });
});

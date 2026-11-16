import {
  ALL_ROOMS,
  activeChildrenLabel,
  buildChildEntries,
  childStatus,
  childStatusLabel,
  filterChildren,
  roomFilterOptions,
  type ChildEnrollment,
  type DirectorChildrenInput,
} from '../director-children';

const NOW = new Date(2026, 9, 24, 10);

function enrollment(overrides: Partial<ChildEnrollment> = {}): ChildEnrollment {
  return { childId: 'mateo', roomId: 'sala-2', roomName: 'Sala 2', shift: 'morning', endedAt: null, ...overrides };
}

function input(overrides: Partial<DirectorChildrenInput> = {}): DirectorChildrenInput {
  return {
    children: [
      { id: 'mateo', firstName: 'Mateo', lastName: 'Rodríguez', photoPath: null },
      { id: 'bruno', firstName: 'Bruno', lastName: 'García', photoPath: 'n/children/bruno.jpg' },
    ],
    enrollments: [enrollment(), enrollment({ childId: 'bruno' })],
    authorizations: [],
    rooms: [],
    ...overrides,
  };
}

describe('childStatus', () => {
  it('is active with an open enrollment that has no end', () => {
    expect(childStatus([enrollment()], NOW)).toEqual({ kind: 'active' });
  });

  it('is leaving when every open enrollment ends in the future', () => {
    expect(childStatus([enrollment({ endedAt: '2026-12-31T12:00:00Z' })], NOW)).toEqual({ kind: 'leaving', on: '2026-12-31T12:00:00Z' });
  });

  it('is left when every enrollment has ended', () => {
    expect(childStatus([enrollment({ endedAt: '2026-10-01T12:00:00Z' })], NOW)).toEqual({ kind: 'left', on: '2026-10-01T12:00:00Z' });
  });

  it('is active with no enrollment at all', () => {
    expect(childStatus([], NOW)).toEqual({ kind: 'active' });
  });
});

describe('childStatusLabel', () => {
  it('shows the leaving day as day and month', () => {
    expect(childStatusLabel({ kind: 'leaving', on: '2026-12-31T12:00:00Z' })).toBe('Baja el 31/12');
  });

  it('shows since when a child left', () => {
    expect(childStatusLabel({ kind: 'left', on: '2026-10-01T12:00:00Z' })).toBe('De baja desde el 01/10');
  });

  it('has no label for an active child', () => {
    expect(childStatusLabel({ kind: 'active' })).toBeNull();
  });
});

describe('buildChildEntries', () => {
  it('orders children by full name', () => {
    expect(buildChildEntries(input(), NOW).map((entry) => entry.name)).toEqual(['Bruno García', 'Mateo Rodríguez']);
  });

  it('keeps the initials and the photo path', () => {
    const bruno = buildChildEntries(input(), NOW)[0];
    expect(bruno.initials).toBe('BG');
    expect(bruno.photoPath).toBe('n/children/bruno.jpg');
  });

  it('lists the open groups, morning first, and leaves ended ones out', () => {
    const enrollments = [
      enrollment({ shift: 'afternoon' }),
      enrollment(),
      enrollment({ roomId: 'sala-1', roomName: 'Sala 1', endedAt: '2026-03-01T12:00:00Z' }),
    ];
    const mateo = buildChildEntries(input({ children: [input().children[0]], enrollments }), NOW)[0];
    expect(mateo.groups).toEqual([
      { roomId: 'sala-2', label: 'Sala 2 · Matutino' },
      { roomId: 'sala-2', label: 'Sala 2 · Vespertino' },
    ]);
  });

  it('marks each authorization by the latest record, in the panel order', () => {
    const authorizations = [
      { childId: 'mateo', documentType: 'auth_health', accepted: true, createdAt: '2026-03-01T10:00:00Z' },
      { childId: 'mateo', documentType: 'auth_image', accepted: true, createdAt: '2026-03-01T10:00:00Z' },
      { childId: 'mateo', documentType: 'auth_image', accepted: false, createdAt: '2026-05-01T10:00:00Z' },
      { childId: 'bruno', documentType: 'auth_health', accepted: false, createdAt: '2026-03-01T10:00:00Z' },
    ];
    const mateo = buildChildEntries(input({ authorizations }), NOW)[1];
    expect(mateo.authorizations).toEqual([
      { key: 'image', granted: false },
      { key: 'health', granted: true },
    ]);
  });
});

describe('filterChildren', () => {
  const entries = buildChildEntries(
    input({
      children: [
        { id: 'mateo', firstName: 'Mateo', lastName: 'Rodríguez', photoPath: null },
        { id: 'tomas', firstName: 'Tomás', lastName: 'Silva', photoPath: null },
      ],
      enrollments: [enrollment(), enrollment({ childId: 'tomas', roomId: 'sala-4', roomName: 'Sala 4' })],
    }),
    NOW,
  );

  it('finds a child without accents or case', () => {
    expect(filterChildren(entries, '  tomas ', ALL_ROOMS).map((entry) => entry.id)).toEqual(['tomas']);
  });

  it('keeps only the children of the chosen room', () => {
    expect(filterChildren(entries, '', 'sala-2').map((entry) => entry.id)).toEqual(['mateo']);
  });

  it('keeps everyone with no query and every room', () => {
    expect(filterChildren(entries, '', ALL_ROOMS)).toHaveLength(2);
  });
});

describe('activeChildrenLabel', () => {
  it('counts every child that has not left', () => {
    const entries = buildChildEntries(
      input({ enrollments: [enrollment(), enrollment({ childId: 'bruno', endedAt: '2026-01-01T12:00:00Z' })] }),
      NOW,
    );
    expect(activeChildrenLabel(entries)).toBe('1 activo');
  });

  it('uses the plural for several children', () => {
    expect(activeChildrenLabel(buildChildEntries(input(), NOW))).toBe('2 activos');
  });
});

describe('roomFilterOptions', () => {
  it('puts every room first and the rooms in numeric order', () => {
    const rooms = [
      { id: 'sala-10', name: 'Sala 10' },
      { id: 'sala-2', name: 'Sala 2' },
    ];
    expect(roomFilterOptions(rooms, 'Todas').map((option) => option.label)).toEqual(['Todas', 'Sala 2', 'Sala 10']);
  });
});

import {
  emptyGalleryText,
  galleryFooter,
  galleryGroupsOf,
  isFamilyEnrolled,
  joinedToday,
  mediaCountLabel,
  mediaDaySections,
  withdrawnBanner,
  type GalleryChild,
  type GalleryMedia,
} from '../gallery';

const NOW = new Date(2026, 10, 7, 12, 0);

const SALA_2_MORNING = { roomId: 'sala-2', roomName: 'Sala 2', shiftId: 'morning-id', shift: 'morning' as const };
const SALA_1_MORNING = { roomId: 'sala-1', roomName: 'Sala 1', shiftId: 'morning-id', shift: 'morning' as const };
const SALA_1_AFTERNOON = { roomId: 'sala-1', roomName: 'Sala 1', shiftId: 'afternoon-id', shift: 'afternoon' as const };

const MOVED_MATEO: GalleryChild = {
  id: 'mateo',
  firstName: 'Mateo',
  enrollments: [
    { ...SALA_1_MORNING, startedAt: '2025-03-03T12:00:00Z', endedAt: '2025-12-01T12:00:00Z' },
    { ...SALA_2_MORNING, startedAt: '2026-03-02T12:00:00Z', endedAt: null },
  ],
};

const WITHDRAWN_MATEO: GalleryChild = {
  id: 'mateo',
  firstName: 'Mateo',
  enrollments: [
    { ...SALA_1_MORNING, startedAt: '2025-03-03T12:00:00Z', endedAt: '2025-12-01T12:00:00Z' },
    { ...SALA_2_MORNING, startedAt: '2026-03-02T12:00:00Z', endedAt: '2026-11-14T12:00:00Z' },
  ],
};

const WITHDRAWN_LUCIA: GalleryChild = {
  id: 'lucia',
  firstName: 'Lucía',
  enrollments: [{ ...SALA_1_AFTERNOON, startedAt: '2026-03-02T12:00:00Z', endedAt: '2026-11-14T12:00:00Z' }],
};

const ENROLLED_MATEO: GalleryChild = {
  id: 'mateo',
  firstName: 'Mateo',
  enrollments: [{ ...SALA_2_MORNING, startedAt: '2026-03-02T12:00:00Z', endedAt: null }],
};

function media(id: string, type: GalleryMedia['type'], createdAt: Date): GalleryMedia {
  return { id, type, createdAt: createdAt.toISOString(), url: `https://example.test/${id}`, filePath: `room/${id}.jpg`, uploader: null };
}

describe('galleryGroupsOf', () => {
  it('puts the current group first and the old one after it, labelled "antes"', () => {
    const groups = galleryGroupsOf([MOVED_MATEO]);

    expect(groups.map((group) => [group.label, group.kind])).toEqual([
      ['Sala 2 · Matutino', 'current'],
      ['Sala 1 · antes', 'before'],
    ]);
  });

  it('names a withdrawn child\'s room after the child when a sibling is still enrolled', () => {
    const groups = galleryGroupsOf([ENROLLED_MATEO, WITHDRAWN_LUCIA]);

    expect(groups.map((group) => [group.label, group.locked])).toEqual([
      ['Sala 2 · Matutino', false],
      ['Sala 1 · Lucía', true],
    ]);
  });

  it('gives the last room of a withdrawn family its full name and the older ones the room alone', () => {
    const groups = galleryGroupsOf([WITHDRAWN_MATEO]);

    expect(groups.map((group) => [group.label, group.kind, group.locked])).toEqual([
      ['Sala 2 · Matutino', 'withdrawn', false],
      ['Sala 1', 'withdrawn', false],
    ]);
  });

  it('gives siblings in the same group one entry, from the first child to join', () => {
    const lucia: GalleryChild = {
      id: 'lucia',
      firstName: 'Lucía',
      enrollments: [{ ...SALA_2_MORNING, startedAt: '2026-05-10T12:00:00Z', endedAt: null }],
    };

    const groups = galleryGroupsOf([lucia, ENROLLED_MATEO]);

    expect(groups.map((group) => [group.key, group.childName])).toEqual([['sala-2:morning-id', 'Mateo']]);
  });

  it('keeps a group current when one sibling left it and another is still there', () => {
    const groups = galleryGroupsOf([
      { id: 'lucia', firstName: 'Lucía', enrollments: [{ ...SALA_2_MORNING, startedAt: '2025-03-03T12:00:00Z', endedAt: '2025-12-01T12:00:00Z' }] },
      ENROLLED_MATEO,
    ]);

    expect(groups.map((group) => [group.label, group.kind])).toEqual([['Sala 2 · Matutino', 'current']]);
  });

  it('has no group for a family with no enrollments', () => {
    expect(galleryGroupsOf([{ id: 'mateo', firstName: 'Mateo', enrollments: [] }])).toEqual([]);
  });
});

describe('isFamilyEnrolled', () => {
  it('is true while any child has a current group', () => {
    expect(isFamilyEnrolled(galleryGroupsOf([ENROLLED_MATEO, WITHDRAWN_LUCIA]))).toBe(true);
  });

  it('is false after every child left', () => {
    expect(isFamilyEnrolled(galleryGroupsOf([WITHDRAWN_MATEO]))).toBe(false);
  });
});

describe('galleryFooter', () => {
  it('says since when a current group shows media', () => {
    const [current] = galleryGroupsOf([MOVED_MATEO]);

    expect(galleryFooter(current, [current], NOW)).toBe('Ves las fotos y videos desde que Mateo está en esta sala (2 de marzo).');
  });

  it('gives the dates of an old room and says it stays', () => {
    const groups = galleryGroupsOf([MOVED_MATEO]);

    expect(galleryFooter(groups[1], groups, NOW)).toBe(
      'Lo que recibiste mientras Mateo estuvo en Sala 1 · Matutino (3 de marzo al 1 de diciembre de 2025). Sigue acá aunque cambió de sala.',
    );
  });

  it('gives the withdrawal day when the family has no child enrolled', () => {
    const groups = galleryGroupsOf([WITHDRAWN_MATEO]);

    expect(galleryFooter(groups[0], groups, NOW)).toBe('Lo último que recibiste: el día de la baja (14 de noviembre).');
  });

  it('points to the sibling\'s room when only one child left', () => {
    const groups = galleryGroupsOf([ENROLLED_MATEO, WITHDRAWN_LUCIA]);

    expect(galleryFooter(groups[1], groups, NOW)).toBe('En Sala 2 · Matutino, la de Mateo, todo sigue igual.');
  });
});

describe('withdrawnBanner', () => {
  it('has no banner for a current group', () => {
    const [current] = galleryGroupsOf([ENROLLED_MATEO]);

    expect(withdrawnBanner(current, true)).toBeNull();
  });

  it('speaks of everything received when the family has no child enrolled', () => {
    const [last] = galleryGroupsOf([WITHDRAWN_MATEO]);

    expect(withdrawnBanner(last, false)).toBe(
      'Mateo ya no está en el jardín. Lo que recibiste sigue acá para ver y guardar, hasta que elimines tu cuenta.',
    );
  });

  it('speaks of that child\'s room when a sibling is still enrolled', () => {
    const groups = galleryGroupsOf([ENROLLED_MATEO, WITHDRAWN_LUCIA]);

    expect(withdrawnBanner(groups[1], true)).toBe(
      'Lucía ya no está en el jardín. Lo que recibiste de su sala sigue acá para ver y guardar, hasta que elimines tu cuenta.',
    );
  });
});

describe('joinedToday', () => {
  it('is false for a child who joined on an earlier day', () => {
    const [group] = galleryGroupsOf([ENROLLED_MATEO]);

    expect(joinedToday(group, NOW)).toBe(false);
  });
});

describe('emptyGalleryText', () => {
  it('tells a family whose child joined today that media starts from today', () => {
    const tomas: GalleryChild = {
      id: 'tomas',
      firstName: 'Tomás',
      enrollments: [{ ...SALA_2_MORNING, startedAt: new Date(2026, 10, 7, 8, 0).toISOString(), endedAt: null }],
    };
    const [group] = galleryGroupsOf([tomas]);

    expect(emptyGalleryText(group, NOW)).toBe('Tomás entró a Sala 2 · Matutino hoy. Vas a ver las fotos y videos que se suban desde hoy.');
  });

  it('says the teacher\'s uploads will show here otherwise', () => {
    const [group] = galleryGroupsOf([ENROLLED_MATEO]);

    expect(emptyGalleryText(group, NOW)).toBe('Cuando la maestra suba fotos o videos de la sala, los vas a ver acá.');
  });
});

describe('mediaCountLabel', () => {
  it('counts photos and videos', () => {
    const items = [
      media('a', 'photo', NOW),
      media('b', 'photo', NOW),
      media('c', 'video', NOW),
      media('d', 'video', NOW),
    ];

    expect(mediaCountLabel(items)).toBe('2 fotos · 2 videos');
  });

  it('uses the singular for one item and drops a missing kind', () => {
    expect(mediaCountLabel([media('a', 'photo', NOW)])).toBe('1 foto');
    expect(mediaCountLabel([media('a', 'video', NOW)])).toBe('1 video');
  });
});

describe('mediaDaySections', () => {
  it('groups media by day, newest first, as Hoy, Ayer and the long date', () => {
    const items = [
      media('older', 'photo', new Date(2026, 10, 3, 10, 0)),
      media('today-early', 'photo', new Date(2026, 10, 7, 9, 0)),
      media('yesterday', 'photo', new Date(2026, 10, 6, 15, 0)),
      media('today-late', 'video', new Date(2026, 10, 7, 11, 0)),
    ];

    const sections = mediaDaySections(items, NOW);

    expect(sections.map((section) => [section.title, section.items.map((item) => item.id)])).toEqual([
      ['Hoy', ['today-late', 'today-early']],
      ['Ayer', ['yesterday']],
      ['Martes 3 de noviembre', ['older']],
    ]);
  });

  it('adds the year to a day from another year', () => {
    const sections = mediaDaySections([media('a', 'photo', new Date(2025, 11, 19, 10, 0))], NOW);

    expect(sections[0].title).toBe('Viernes 19 de diciembre de 2025');
  });

  it('counts the items only on the first day', () => {
    const items = [media('a', 'photo', new Date(2026, 10, 7, 9, 0)), media('b', 'photo', new Date(2026, 10, 6, 9, 0))];

    const sections = mediaDaySections(items, NOW);

    expect(sections.map((section) => section.countLabel)).toEqual(['1 foto', null]);
  });
});

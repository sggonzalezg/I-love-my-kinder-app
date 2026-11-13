import type { FamilyChild } from '@/lib/room-groups';
import {
  bodyParagraphs,
  cancelledPreview,
  cancelledWhatLine,
  cancelledWhenLine,
  childrenInAudience,
  guardianLine,
  mergeNotices,
  noticeAudience,
  noticeMetaLine,
  noticeSender,
  noticeTimeLabel,
  seenByLabel,
  seenShare,
  seenSummary,
  sortViewers,
  viewerSeenLabel,
  voidPermissionTitle,
  withdrawnBannerText,
  type CancelledEvent,
  type Notice,
} from '@/lib/notices';

const NOW = new Date(2026, 9, 24, 15, 0);

function notice(overrides: Partial<Notice> = {}): Notice {
  return {
    id: 'notice-1',
    title: 'Salida al parque el jueves',
    body: 'Vamos al Parque Rodó.',
    imagePath: null,
    createdAt: new Date(2026, 9, 24, 9, 12).toISOString(),
    createdBy: 'teacher-user',
    roomId: 'room-2',
    roomName: 'Sala 2',
    shift: 'morning',
    cancelledEvent: null,
    unread: false,
    seen: null,
    ...overrides,
  };
}

const OUTING: CancelledEvent = {
  title: 'Salida al Parque Rodó',
  eventType: 'outing',
  startsAt: new Date(2026, 9, 29, 10, 0).toISOString(),
  endsAt: new Date(2026, 9, 29, 12, 0).toISOString(),
  allDay: false,
  location: 'Parque Rodó',
  reason: 'pronóstico de lluvia',
};

describe('noticeTimeLabel', () => {
  it('shows the time for a notice of today', () => {
    expect(noticeTimeLabel(new Date(2026, 9, 24, 10, 5), NOW)).toBe('10:05');
  });

  it('says Ayer for a notice of yesterday', () => {
    expect(noticeTimeLabel(new Date(2026, 9, 23, 18, 0), NOW)).toBe('Ayer');
  });

  it('shows the short weekday and day within the last week', () => {
    expect(noticeTimeLabel(new Date(2026, 9, 19, 8, 0), NOW)).toBe('Lun 19');
  });

  it('shows the day and short month earlier in the year', () => {
    expect(noticeTimeLabel(new Date(2026, 9, 4, 8, 0), NOW)).toBe('4 oct');
  });

  it('adds the year for a notice of another year', () => {
    expect(noticeTimeLabel(new Date(2025, 11, 19, 8, 0), NOW)).toBe('19 dic 2025');
  });
});

describe('noticeSender', () => {
  it('says Vos for the user own notice', () => {
    expect(noticeSender(notice({ createdBy: 'me' }), 'me')).toBe('Vos');
  });

  it('says Dirección for a nursery-wide notice', () => {
    expect(noticeSender(notice({ roomId: null, roomName: null, shift: null }), 'me')).toBe('Dirección');
  });

  it('says La maestra for a room notice', () => {
    expect(noticeSender(notice(), 'me')).toBe('La maestra');
  });

  it('uses the known name of the sender for the direction', () => {
    const senderLabels = new Map([['teacher-user', 'Maestra Sofía']]);
    expect(noticeSender(notice(), 'me', senderLabels)).toBe('Maestra Sofía');
  });

  it('still says Vos when the user is among the known senders', () => {
    const senderLabels = new Map([['me', 'Dirección']]);
    expect(noticeSender(notice({ createdBy: 'me' }), 'me', senderLabels)).toBe('Vos');
  });
});

describe('seenSummary', () => {
  it('counts the recipients who saw the notice', () => {
    expect(seenSummary([{ seenAt: '2026-10-24T12:14:00Z' }, { seenAt: null }, { seenAt: '2026-10-24T12:40:00Z' }])).toEqual({ seen: 2, total: 3 });
  });

  it('is null when the user cannot see the recipients', () => {
    expect(seenSummary([])).toBeNull();
  });
});

describe('seenByLabel', () => {
  it('reads as Visto por N de M', () => {
    expect(seenByLabel({ seen: 18, total: 26 })).toBe('Visto por 18 de 26');
  });
});

describe('seenShare', () => {
  it('is the part of the recipients who saw it', () => {
    expect(seenShare({ seen: 13, total: 26 })).toBe(0.5);
  });
});

describe('guardianLine', () => {
  it('names the relationship and the child', () => {
    expect(guardianLine([{ relationship: 'mother', childFirstName: 'Mateo' }])).toBe('Mamá de Mateo');
  });

  it('names every child of the guardian', () => {
    const links = [
      { relationship: 'father', childFirstName: 'Bruno' },
      { relationship: 'father', childFirstName: 'Lucía' },
    ];
    expect(guardianLine(links)).toBe('Papá de Bruno y Lucía');
  });

  it('keeps an unknown relationship as written', () => {
    expect(guardianLine([{ relationship: 'Tía', childFirstName: 'Mateo' }])).toBe('Tía de Mateo');
  });

  it('says Familia when no child is linked', () => {
    expect(guardianLine([])).toBe('Familia');
  });
});

describe('viewerSeenLabel', () => {
  it('shows the time for a notice seen today', () => {
    expect(viewerSeenLabel(new Date(2026, 9, 24, 9, 14).toISOString(), NOW)).toBe('Visto 9:14');
  });

  it('says Sin ver when it was not seen', () => {
    expect(viewerSeenLabel(null, NOW)).toBe('Sin ver');
  });
});

describe('sortViewers', () => {
  it('lists who saw it first, in the order they saw it, then the rest by name', () => {
    const viewers = [
      { id: 'pablo', name: 'Pablo García', relation: 'Papá de Bruno', seenAt: null },
      { id: 'laura', name: 'Laura Méndez', relation: 'Mamá de Valentina', seenAt: '2026-10-24T12:40:00Z' },
      { id: 'marina', name: 'Marina Rossi', relation: 'Mamá de Valentín', seenAt: null },
      { id: 'ana', name: 'Ana Rodríguez', relation: 'Mamá de Mateo', seenAt: '2026-10-24T12:14:00Z' },
      { id: 'alicia', name: 'Alicia Pérez', relation: 'Mamá de Juan', seenAt: null },
    ];
    expect(sortViewers(viewers).map((viewer) => viewer.id)).toEqual(['ana', 'laura', 'alicia', 'marina', 'pablo']);
  });
});

describe('noticeAudience', () => {
  it('names the room and shift', () => {
    expect(noticeAudience(notice())).toBe('Sala 2 · Matutino');
  });

  it('names only the room when the notice went to both shifts', () => {
    expect(noticeAudience(notice({ shift: null }))).toBe('Sala 2');
  });

  it('says Todo el jardín for a nursery-wide notice', () => {
    expect(noticeAudience(notice({ roomId: null, roomName: null, shift: null }))).toBe('Todo el jardín');
  });

  it('has no audience when the room can no longer be read', () => {
    expect(noticeAudience(notice({ roomName: null }))).toBeNull();
  });
});

describe('noticeMetaLine', () => {
  it('joins the day, the time and the audience', () => {
    expect(noticeMetaLine(notice(), NOW)).toBe('Hoy · 9:12 · Para Sala 2 · Matutino');
  });

  it('leaves out the audience when it is unknown', () => {
    expect(noticeMetaLine(notice({ roomName: null, createdAt: new Date(2026, 9, 23, 9, 12).toISOString() }), NOW)).toBe('Ayer · 9:12');
  });
});

describe('cancelled event lines', () => {
  it('previews what the event was and the reason', () => {
    expect(cancelledPreview(OUTING)).toBe('Era el jueves 29, de 10:00 a 12:00. Motivo: pronóstico de lluvia.');
  });

  it('previews an all-day event without a reason', () => {
    expect(cancelledPreview({ ...OUTING, allDay: true, reason: null })).toBe('Era el jueves 29, todo el día.');
  });

  it('gives the long date and the hours of the event', () => {
    expect(cancelledWhenLine(OUTING)).toBe('Jueves 29 de octubre · 10:00 a 12:00');
  });

  it('gives Todo el día for an all-day event', () => {
    expect(cancelledWhenLine({ ...OUTING, allDay: true })).toBe('Jueves 29 de octubre · Todo el día');
  });

  it('gives the type and the place', () => {
    expect(cancelledWhatLine(OUTING)).toBe('Salida · Parque Rodó');
  });

  it('gives only the type when there is no place', () => {
    expect(cancelledWhatLine({ ...OUTING, location: null })).toBe('Salida');
  });
});

describe('voidPermissionTitle', () => {
  it('names one child', () => {
    expect(voidPermissionTitle(['Mateo'])).toBe('El permiso de Mateo quedó sin efecto');
  });

  it('names several children', () => {
    expect(voidPermissionTitle(['Mateo', 'Lucía'])).toBe('Los permisos de Mateo y Lucía quedaron sin efecto');
  });

  it('names nobody when no child of the family was in the audience', () => {
    expect(voidPermissionTitle([])).toBe('El permiso quedó sin efecto');
  });
});

describe('withdrawnBannerText', () => {
  it('speaks of one child', () => {
    expect(withdrawnBannerText(['Mateo'])).toBe(
      'Mateo ya no está en el jardín. Los avisos que recibiste siguen acá hasta que elimines tu cuenta. No llegan avisos nuevos.',
    );
  });

  it('speaks of several children', () => {
    expect(withdrawnBannerText(['Mateo', 'Lucía', 'Bruno'])).toBe(
      'Mateo, Lucía y Bruno ya no están en el jardín. Los avisos que recibiste siguen acá hasta que elimines tu cuenta. No llegan avisos nuevos.',
    );
  });
});

describe('bodyParagraphs', () => {
  it('splits the body on blank lines and drops empty ones', () => {
    expect(bodyParagraphs('Primero.\n\n\nSegundo.\n')).toEqual(['Primero.', 'Segundo.']);
  });

  it('has no paragraphs without a body', () => {
    expect(bodyParagraphs(null)).toEqual([]);
  });
});

describe('mergeNotices', () => {
  it('orders the notices newest first', () => {
    const older = notice({ id: 'older', createdAt: new Date(2026, 9, 20).toISOString() });
    const newer = notice({ id: 'newer', createdAt: new Date(2026, 9, 22).toISOString() });
    expect(mergeNotices([older, newer]).map((item) => item.id)).toEqual(['newer', 'older']);
  });

  it('keeps one row per notice, unread when any copy is unread', () => {
    const merged = mergeNotices([notice({ unread: false }), notice({ unread: true })]);
    expect(merged).toHaveLength(1);
    expect(merged[0].unread).toBe(true);
  });
});

describe('childrenInAudience', () => {
  const children: FamilyChild[] = [
    { id: 'mateo', firstName: 'Mateo', photoPath: null, groups: [{ roomId: 'room-2', roomName: 'Sala 2', shiftId: 'am', shift: 'morning' }] },
    { id: 'lucia', firstName: 'Lucía', photoPath: null, groups: [{ roomId: 'room-1', roomName: 'Sala 1', shiftId: 'pm', shift: 'afternoon' }] },
  ];

  it('names the children of the notice room and shift', () => {
    expect(childrenInAudience(children, notice())).toEqual(['Mateo']);
  });

  it('names every child for a nursery-wide notice', () => {
    expect(childrenInAudience(children, notice({ roomId: null, roomName: null, shift: null }))).toEqual(['Mateo', 'Lucía']);
  });

  it('ignores the shift when the notice went to the whole room', () => {
    expect(childrenInAudience(children, notice({ roomId: 'room-1', shift: null }))).toEqual(['Lucía']);
  });
});

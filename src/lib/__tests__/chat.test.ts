import {
  chatListItems,
  isOffWorkHours,
  membersLine,
  messagePreview,
  seenByCount,
  senderLine,
  threadListMeta,
  threadTimeLabel,
  type ChatMessage,
} from '../chat';

const ME = 'user-me';
const NOW = new Date(2026, 10, 7, 12, 0);

function message(overrides: Partial<ChatMessage>): ChatMessage {
  return {
    id: 'm1',
    clientId: null,
    threadId: 't1',
    senderId: 'user-other',
    senderRole: 'family',
    senderLabel: 'Laura Gómez, mamá de Valentina',
    body: 'Hola',
    imagePath: null,
    createdAt: new Date(2026, 10, 7, 10, 0).toISOString(),
    ...overrides,
  };
}

describe('senderLine', () => {
  it('names the direction "Dirección" whatever label it has', () => {
    expect(senderLine('director', 'Ana')).toBe('Dirección');
  });

  it('adds the role to a teacher label', () => {
    expect(senderLine('teacher', 'Sofía Martínez')).toBe('Sofía Martínez · Maestra');
  });

  it('adds the role to an assistant label', () => {
    expect(senderLine('assistant', 'Carolina Díaz')).toBe('Carolina Díaz · Asistente');
  });

  it('keeps a staff label that already carries its role', () => {
    expect(senderLine('teacher', 'Sofía Martínez · Maestra')).toBe('Sofía Martínez · Maestra');
  });

  it('shows a family label as the server stored it', () => {
    expect(senderLine('family', 'Diego Suárez, familia')).toBe('Diego Suárez, familia');
  });
});

describe('messagePreview', () => {
  it('says there are no messages for a new chat', () => {
    expect(messagePreview(null, ME)).toBe('Todavía no hay mensajes');
  });

  it('starts with "Vos" for my own message', () => {
    expect(messagePreview(message({ senderId: ME, body: 'Gracias' }), ME)).toBe('Vos: Gracias');
  });

  it('starts with the sender label without the role for others', () => {
    expect(messagePreview(message({ senderRole: 'teacher', senderLabel: 'Sofía Martínez', body: 'Traigan ropa' }), ME)).toBe(
      'Sofía Martínez: Traigan ropa',
    );
  });

  it('says "Foto" for a message with only a photo', () => {
    expect(messagePreview(message({ body: null, imagePath: 'n/t/p.jpg', senderRole: 'director' }), ME)).toBe('Dirección: Foto');
  });
});

describe('seenByCount', () => {
  const sent = message({ senderId: ME, createdAt: '2026-11-07T10:00:00.000Z' });

  it('counts other people who read at or after the message', () => {
    const reads = [
      { userId: 'a', lastReadAt: '2026-11-07T10:00:00.000Z' },
      { userId: 'b', lastReadAt: '2026-11-07T11:00:00.000Z' },
      { userId: 'c', lastReadAt: '2026-11-07T09:00:00.000Z' },
    ];

    expect(seenByCount(sent, reads)).toBe(2);
  });

  it('does not count the sender', () => {
    expect(seenByCount(sent, [{ userId: ME, lastReadAt: '2026-11-07T12:00:00.000Z' }])).toBe(0);
  });
});

describe('chatListItems', () => {
  it('puts a day separator before the first message of each day, newest last', () => {
    const items = chatListItems(
      [
        message({ id: 'today-2', createdAt: new Date(2026, 10, 7, 10, 12).toISOString() }),
        message({ id: 'yesterday', createdAt: new Date(2026, 10, 6, 16, 40).toISOString() }),
        message({ id: 'today-1', createdAt: new Date(2026, 10, 7, 8, 15).toISOString() }),
      ],
      NOW,
    );

    expect(items.map((item) => (item.kind === 'day' ? item.title : item.message.id))).toEqual(['Ayer', 'yesterday', 'Hoy', 'today-1', 'today-2']);
  });

  it('writes older days as a long date', () => {
    const [separator] = chatListItems([message({ createdAt: new Date(2026, 9, 14, 9, 3).toISOString() })], NOW);

    expect(separator).toEqual({ kind: 'day', key: 'day-2026-9-14', title: 'Miércoles 14 de octubre' });
  });
});

describe('membersLine', () => {
  it('counts families and teachers with the direction for families and teachers', () => {
    expect(membersLine({ familyCount: 27, teacherNames: ['Sofía Martínez', 'Carolina Díaz'], viewer: 'family' })).toBe(
      '27 familias, 2 maestras y Dirección',
    );
  });

  it('leaves the teachers out when the room has none', () => {
    expect(membersLine({ familyCount: 16, teacherNames: [], viewer: 'teacher' })).toBe('16 familias y Dirección');
  });

  it('uses the singular for one family and one teacher', () => {
    expect(membersLine({ familyCount: 1, teacherNames: ['Sofía Martínez'], viewer: 'family' })).toBe('1 familia, 1 maestra y Dirección');
  });

  it('names the teachers for the direction', () => {
    expect(membersLine({ familyCount: 27, teacherNames: ['Sofía Martínez', 'Carolina Díaz'], viewer: 'director' })).toBe(
      '27 familias, Sofía Martínez y Carolina Díaz',
    );
  });

  it('says "Sin maestra" to the direction for a room without teachers', () => {
    expect(membersLine({ familyCount: 16, teacherNames: [], viewer: 'director' })).toBe('Sin maestra · 16 familias');
  });
});

describe('threadListMeta', () => {
  it('names the family children in the group', () => {
    expect(threadListMeta({ familyCount: 27, teacherFirstNames: [], childNames: ['Mateo'], viewer: 'family' })).toBe('Con Mateo · 27 familias');
  });

  it('shows only the families to a teacher', () => {
    expect(threadListMeta({ familyCount: 22, teacherFirstNames: ['Nati'], childNames: [], viewer: 'teacher' })).toBe('22 familias');
  });

  it('names the teachers to the direction', () => {
    expect(threadListMeta({ familyCount: 27, teacherFirstNames: ['Sofía', 'Carolina'], childNames: [], viewer: 'director' })).toBe(
      '27 familias · Sofía y Carolina',
    );
  });

  it('flags a room without teachers to the direction', () => {
    expect(threadListMeta({ familyCount: 16, teacherFirstNames: [], childNames: [], viewer: 'director' })).toBe('16 familias · Sin maestra');
  });
});

describe('isOffWorkHours', () => {
  const hours = { start: '08:00:00', end: '17:00:00' };

  it('is within hours on a weekday between start and end', () => {
    expect(isOffWorkHours(new Date(2026, 10, 6, 9, 30), hours)).toBe(false);
  });

  it('is off hours after the end time', () => {
    expect(isOffWorkHours(new Date(2026, 10, 6, 19, 42), hours)).toBe(true);
  });

  it('is off hours before the start time', () => {
    expect(isOffWorkHours(new Date(2026, 10, 6, 7, 59), hours)).toBe(true);
  });

  it('is off hours on a weekend', () => {
    expect(isOffWorkHours(new Date(2026, 10, 7, 10, 0), hours)).toBe(true);
  });

  it('is never off hours when the direction loaded no hours', () => {
    expect(isOffWorkHours(new Date(2026, 10, 7, 23, 0), null)).toBe(false);
  });
});

describe('threadTimeLabel', () => {
  it('shows the time for a message from today', () => {
    expect(threadTimeLabel(new Date(2026, 10, 7, 10, 12).toISOString(), NOW)).toBe('10:12');
  });

  it('says "Ayer" for a message from yesterday', () => {
    expect(threadTimeLabel(new Date(2026, 10, 6, 18, 0).toISOString(), NOW)).toBe('Ayer');
  });

  it('shows the short day for older messages', () => {
    expect(threadTimeLabel(new Date(2026, 10, 2, 9, 0).toISOString(), NOW)).toBe('Lun 2');
  });
});

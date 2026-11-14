import { emptyEventForm, type EventFormValues } from '@/lib/event-form';
import { isOutingComplete, transportFieldsFromStored, transportValue, typeChangeValues } from '@/lib/outing-fields';
import {
  askPermissionCaption,
  outingAnswerCounts,
  outingBannerText,
  permissionChangeLine,
  permissionVersionAfterEdit,
  resignLine,
  savedOutingToast,
} from '@/lib/outing-form';

function outingForm(overrides: Partial<EventFormValues> = {}): EventFormValues {
  return {
    ...emptyEventForm('room-2:shift-am'),
    type: 'outing',
    title: 'Salida al Parque Rodó',
    date: '2025-10-30',
    startTime: '10:00',
    endTime: '12:00',
    place: 'Parque Rodó',
    transportChoice: 'walking',
    ...overrides,
  };
}

describe('transportValue', () => {
  it('stores the word of a preset choice', () => {
    expect(transportValue(outingForm({ transportChoice: 'hiredBus' }))).toBe('Ómnibus contratado');
  });

  it('stores the typed text for Otro', () => {
    expect(transportValue(outingForm({ transportChoice: 'other', otherTransport: '  En camioneta del jardín ' }))).toBe('En camioneta del jardín');
  });

  it('has no value for Otro without text', () => {
    expect(transportValue(outingForm({ transportChoice: 'other', otherTransport: '  ' }))).toBeNull();
  });

  it('has no value without a choice', () => {
    expect(transportValue(outingForm({ transportChoice: null }))).toBeNull();
  });
});

describe('transportFieldsFromStored', () => {
  it('picks the preset chip of a stored word', () => {
    expect(transportFieldsFromStored('Caminando')).toEqual({ transportChoice: 'walking', otherTransport: '' });
  });

  it('reads any other text as Otro', () => {
    expect(transportFieldsFromStored('A pie')).toEqual({ transportChoice: 'other', otherTransport: 'A pie' });
  });

  it('leaves the choice empty without a stored value', () => {
    expect(transportFieldsFromStored(null)).toEqual({ transportChoice: null, otherTransport: '' });
  });
});

describe('typeChangeValues', () => {
  it('turns all day off for an outing', () => {
    expect(typeChangeValues('outing')).toEqual({ type: 'outing', allDay: false, untilDate: null });
  });

  it('only changes the type for other events', () => {
    expect(typeChangeValues('workshop')).toEqual({ type: 'workshop' });
  });
});

describe('isOutingComplete', () => {
  it('accepts an outing with place and transport', () => {
    expect(isOutingComplete(outingForm())).toBe(true);
  });

  it('needs where they go', () => {
    expect(isOutingComplete(outingForm({ place: ' ' }))).toBe(false);
  });

  it('needs how they go', () => {
    expect(isOutingComplete(outingForm({ transportChoice: null }))).toBe(false);
  });

  it('needs the text of Otro', () => {
    expect(isOutingComplete(outingForm({ transportChoice: 'other', otherTransport: '' }))).toBe(false);
  });

  it('asks nothing extra of other event types', () => {
    expect(isOutingComplete(outingForm({ type: 'workshop', place: '', transportChoice: null }))).toBe(true);
  });
});

describe('permissionChangeLine', () => {
  it('names a new departure time', () => {
    expect(permissionChangeLine(outingForm(), outingForm({ startTime: '10:30' }))).toBe('Cambiaste la hora de salida (10:00 → 10:30).');
  });

  it('names a new return time', () => {
    expect(permissionChangeLine(outingForm(), outingForm({ endTime: '12:30' }))).toBe('Cambiaste la hora de vuelta (12:00 → 12:30).');
  });

  it('names a new day', () => {
    expect(permissionChangeLine(outingForm(), outingForm({ date: '2025-10-31' }))).toBe('Cambiaste el día (Jueves 30 oct → Viernes 31 oct).');
  });

  it('names a new place', () => {
    expect(permissionChangeLine(outingForm(), outingForm({ place: 'Parque Batlle' }))).toBe('Cambiaste a dónde van (Parque Rodó → Parque Batlle).');
  });

  it('names a new transport', () => {
    expect(permissionChangeLine(outingForm(), outingForm({ transportChoice: 'hiredBus' }))).toBe('Cambiaste cómo van (Caminando → Ómnibus contratado).');
  });

  it('keeps the answers after a notes-only change', () => {
    expect(permissionChangeLine(outingForm(), outingForm({ description: 'Llevar gorro', title: 'Paseo' }))).toBeNull();
  });

  it('never asks again for an event that is not an outing', () => {
    expect(permissionChangeLine(outingForm({ type: 'workshop' }), outingForm({ type: 'workshop', startTime: '10:30' }))).toBeNull();
  });
});

describe('permissionVersionAfterEdit', () => {
  it('raises the version when a permission field changed', () => {
    expect(permissionVersionAfterEdit(2, outingForm(), outingForm({ place: 'Parque Batlle' }))).toBe(3);
  });

  it('keeps the version after a notes-only change', () => {
    expect(permissionVersionAfterEdit(2, outingForm(), outingForm({ description: 'Llevar gorro' }))).toBe(2);
  });
});

describe('outingAnswerCounts', () => {
  function answer(childId: string, decision: 'pending' | 'authorized' | 'declined', version: number, createdAt = '2025-10-24T12:00:00Z') {
    return { child_id: childId, decision, created_at: createdAt, permission_version: version, signer_name: 'Ana', signer_relationship: 'madre', signed_by: 'user-1' };
  }

  it('counts each child of the request once and the authorizations of the current version', () => {
    const rows = [
      answer('mateo', 'pending', 1),
      answer('mateo', 'authorized', 2),
      answer('sofia', 'pending', 1),
      answer('sofia', 'authorized', 1),
      answer('lucas', 'pending', 1),
    ];

    expect(outingAnswerCounts(rows, 2)).toEqual({ authorizedCount: 1, childCount: 3 });
  });
});

describe('resignLine', () => {
  it('counts the authorizations that stop counting and the children asked again', () => {
    expect(resignLine(18, 26)).toBe('Las 18 autorizaciones de ahora quedan sin efecto y pedimos permiso de nuevo por los 26 niños.');
  });

  it('uses the singular for one authorization and one child', () => {
    expect(resignLine(1, 1)).toBe('La autorización de ahora queda sin efecto y pedimos permiso de nuevo por 1 niño.');
  });
});

describe('outing copy', () => {
  it('counts the children on the info banner', () => {
    expect(outingBannerText(26)).toBe(
      'Al guardar, pedimos permiso por cada uno de los 26 niños (con la firma de un adulto a cargo alcanza). Sin permiso firmado, el niño no sale.',
    );
  });

  it('speaks of each child when there is no single roster', () => {
    expect(outingBannerText(null)).toBe('Al guardar, pedimos permiso por cada niño (con la firma de un adulto a cargo alcanza). Sin permiso firmado, el niño no sale.');
  });

  it('counts the children under Pedir permiso ahora', () => {
    expect(askPermissionCaption(26)).toBe('26 niños · siempre en las salidas');
  });

  it('says it is always on without a count', () => {
    expect(askPermissionCaption(null)).toBe('Siempre en las salidas');
  });

  it('counts the children on the saved toast', () => {
    expect(savedOutingToast(26)).toBe('Salida guardada. Pedimos permiso por 26 niños.');
  });

  it('speaks of each child on the toast without a count', () => {
    expect(savedOutingToast(null)).toBe('Salida guardada. Pedimos permiso por cada niño.');
  });
});

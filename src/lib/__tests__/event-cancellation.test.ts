import { deletedEventToast, eventStaffAction, factsAuthorLine, notifiedLines } from '../event-cancellation';

const ROOM_EVENT = { audience: 'Sala 2 · Matutino', room_id: 'room-2' };

describe('eventStaffAction (T10)', () => {
  it('lets a teacher delete her own event', () => {
    expect(eventStaffAction('teacher', true)).toBe('delete');
  });

  it('sends a teacher to the direction for an event she did not make', () => {
    expect(eventStaffAction('teacher', false)).toBe('askDirection');
  });

  it('lets the director delete any event', () => {
    expect(eventStaffAction('director', false)).toBe('delete');
  });

  it('gives a family nothing', () => {
    expect(eventStaffAction('family', true)).toBe('none');
  });
});

describe('notifiedLines (delete sheet)', () => {
  it('counts the families of the group and names the other teacher', () => {
    expect(notifiedLines(ROOM_EVENT, { familyCount: 26, otherTeachers: ['Maestra Ana'] })).toEqual([
      '26 familias de Sala 2 · Matutino',
      'Maestra Ana, que también es de la sala',
    ]);
  });

  it('says one family in singular', () => {
    expect(notifiedLines(ROOM_EVENT, { familyCount: 1, otherTeachers: [] })).toEqual(['1 familia de Sala 2 · Matutino']);
  });

  it('joins several teachers', () => {
    expect(notifiedLines(ROOM_EVENT, { familyCount: 26, otherTeachers: ['Maestra Ana', 'Maestra Laura', 'Maestra Eva'] })[1]).toBe(
      'Maestra Ana, Maestra Laura y Maestra Eva, que también son de la sala',
    );
  });

  it('speaks of the whole nursery when the event has no room', () => {
    expect(notifiedLines({ audience: 'Todo el jardín', room_id: undefined }, null)).toEqual([
      'Las familias de todo el jardín',
      'Las maestras de todo el jardín',
    ]);
  });

  it('speaks of the room when there is no roster to count', () => {
    expect(notifiedLines({ audience: 'Sala 2', room_id: 'room-2' }, null)).toEqual(['Las familias de Sala 2', 'Las maestras de Sala 2']);
  });
});

describe('deletedEventToast', () => {
  it('says who was told', () => {
    expect(deletedEventToast(false, { familyCount: 26, otherTeachers: ['Maestra Ana'] })).toBe(
      'Evento borrado. Les avisamos a 26 familias y a Maestra Ana.',
    );
  });

  it('names only the families when no other teacher is told', () => {
    expect(deletedEventToast(false, { familyCount: 26, otherTeachers: [] })).toBe('Evento borrado. Les avisamos a 26 familias.');
  });

  it('speaks in general without a roster', () => {
    expect(deletedEventToast(false, null)).toBe('Evento borrado. Les avisamos a las familias y a las maestras.');
  });

  it('tells nobody about a past event', () => {
    expect(deletedEventToast(true, { familyCount: 26, otherTeachers: ['Maestra Ana'] })).toBe('Evento borrado.');
  });
});

describe('factsAuthorLine', () => {
  it('adds the families count to the author', () => {
    expect(factsAuthorLine('Lo agendaste vos', 26)).toBe('Lo agendaste vos · 26 familias');
  });

  it('keeps the author alone without a count', () => {
    expect(factsAuthorLine('Lo agendaste vos', null)).toBe('Lo agendaste vos');
  });

  it('is left out with neither', () => {
    expect(factsAuthorLine(undefined, null)).toBeUndefined();
  });
});

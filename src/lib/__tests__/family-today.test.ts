import { eventAudienceLabel, familyGreeting, kidDayStatus, loadWithSavedFallback, nextEventLine, nextEventWindowEnd } from '../family-today';
import type { FamilyChild } from '../room-groups';

const SALA_2_MORNING = { roomId: 'r2', roomName: 'Sala 2', shiftId: 's-am', shift: 'morning' as const };
const SALA_2_AFTERNOON = { roomId: 'r2', roomName: 'Sala 2', shiftId: 's-pm', shift: 'afternoon' as const };

function child(groups: FamilyChild['groups']): FamilyChild {
  return { id: 'mateo', firstName: 'Mateo', lastName: 'Rodríguez', photoPath: null, groups };
}

describe('kidDayStatus', () => {
  it('is ready when every open group of the child has a routine today', () => {
    const routines = [
      { childId: 'mateo', roomId: 'r2', shiftId: 's-am' },
      { childId: 'mateo', roomId: 'r2', shiftId: 's-pm' },
    ];
    expect(kidDayStatus(child([SALA_2_MORNING, SALA_2_AFTERNOON]), routines)).toBe('ready');
  });

  it('is not yet while one of the child groups has no routine today', () => {
    const routines = [{ childId: 'mateo', roomId: 'r2', shiftId: 's-am' }];
    expect(kidDayStatus(child([SALA_2_MORNING, SALA_2_AFTERNOON]), routines)).toBe('notYet');
  });

  it('ignores the routines of other children', () => {
    const routines = [{ childId: 'lucia', roomId: 'r2', shiftId: 's-am' }];
    expect(kidDayStatus(child([SALA_2_MORNING]), routines)).toBe('notYet');
  });

  it('is read only for a child with no open group', () => {
    expect(kidDayStatus(child([]), [])).toBe('readOnly');
  });
});

describe('familyGreeting', () => {
  it('greets the family member by first name', () => {
    expect(familyGreeting('Ana')).toBe('Hola, Ana');
  });

  it('says only hello when the name is unknown', () => {
    expect(familyGreeting('')).toBe('Hola');
  });
});

describe('eventAudienceLabel', () => {
  it('names the room and shift of a group event', () => {
    expect(eventAudienceLabel('Sala 2', 'morning')).toBe('Sala 2 · Matutino');
  });

  it('names only the room when the event is for both shifts', () => {
    expect(eventAudienceLabel('Sala 2', null)).toBe('Sala 2');
  });

  it('says the whole nursery when the event has no room', () => {
    expect(eventAudienceLabel(null, null)).toBe('Todo el jardín');
  });
});

describe('nextEventLine', () => {
  it('joins the weekday, the time range and the audience', () => {
    const event = { startsAt: new Date(2026, 9, 27, 9, 30).toISOString(), endsAt: new Date(2026, 9, 27, 11, 0).toISOString(), allDay: false, roomName: 'Sala 2', shift: 'morning' as const };
    expect(nextEventLine(event)).toBe('Martes · 9:30 a 11:00 · Sala 2 · Matutino');
  });

  it('says all day instead of the times', () => {
    const event = { startsAt: new Date(2026, 9, 30).toISOString(), endsAt: new Date(2026, 9, 30, 23, 59).toISOString(), allDay: true, roomName: null, shift: null };
    expect(nextEventLine(event)).toBe('Viernes · Todo el día · Todo el jardín');
  });
});

describe('nextEventWindowEnd', () => {
  it('is seven days after now', () => {
    expect(nextEventWindowEnd(new Date(2026, 9, 24, 10, 0))).toEqual(new Date(2026, 9, 31, 10, 0));
  });
});

describe('loadWithSavedFallback', () => {
  const networkFailure = () => Promise.reject(new Error('Network request failed'));

  it('saves and returns a fresh load', async () => {
    const save = jest.fn(() => Promise.resolve());
    const result = await loadWithSavedFallback(() => Promise.resolve('fresh'), () => Promise.resolve('saved'), save);
    expect(result).toEqual({ value: 'fresh', offline: false });
    expect(save).toHaveBeenCalledWith('fresh');
  });

  it('returns the saved value as offline when the network fails', async () => {
    const result = await loadWithSavedFallback(networkFailure, () => Promise.resolve('saved'), () => Promise.resolve());
    expect(result).toEqual({ value: 'saved', offline: true });
  });

  it('returns no value as offline when the network fails and nothing was saved', async () => {
    const result = await loadWithSavedFallback(networkFailure, () => Promise.resolve(null), () => Promise.resolve());
    expect(result).toEqual({ value: null, offline: true });
  });

  it('rethrows a failure that is not a network failure', async () => {
    const serverFailure = () => Promise.reject(Object.assign(new Error('permission denied'), { status: 403 }));
    await expect(loadWithSavedFallback(serverFailure, () => Promise.resolve('saved'), () => Promise.resolve())).rejects.toThrow('permission denied');
  });
});

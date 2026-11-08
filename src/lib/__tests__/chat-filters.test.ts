import { ALL_CHATS_FILTER, chatFilterChips, matchesChatFilter } from '../chat-filters';
import type { ChildGroup } from '../room-groups';

function group(roomId: string, roomName: string, shift: ChildGroup['shift']): ChildGroup {
  return { roomId, roomName, shiftId: `${roomId}-${shift}`, shift };
}

const SALA_2_AM = group('room-2', 'Sala 2', 'morning');
const SALA_2_PM = group('room-2', 'Sala 2', 'afternoon');
const SALA_10_AM = group('room-10', 'Sala 10', 'morning');
const SALA_1_PM = group('room-1', 'Sala 1', 'afternoon');

describe('chatFilterChips', () => {
  it('lists all, each room once in natural order, the shifts and "Sin maestra"', () => {
    const labels = chatFilterChips([SALA_2_AM, SALA_10_AM, SALA_2_PM, SALA_1_PM]).map((chip) => chip.label);

    expect(labels).toEqual(['Todas', 'Sala 1', 'Sala 2', 'Sala 10', 'Matutino', 'Vespertino', 'Sin maestra']);
  });

  it('leaves out a shift no group runs', () => {
    const labels = chatFilterChips([SALA_2_AM, SALA_10_AM]).map((chip) => chip.label);

    expect(labels).toEqual(['Todas', 'Sala 2', 'Sala 10', 'Matutino', 'Sin maestra']);
  });

  it('gives each chip its own key', () => {
    const keys = chatFilterChips([SALA_2_AM, SALA_2_PM]).map((chip) => chip.key);

    expect(new Set(keys).size).toBe(keys.length);
  });
});

describe('matchesChatFilter', () => {
  it('keeps every thread with "Todas"', () => {
    expect(matchesChatFilter(SALA_2_AM, 2, ALL_CHATS_FILTER)).toBe(true);
  });

  it('keeps both shifts of the chosen room', () => {
    const filter = { kind: 'room', roomId: 'room-2' } as const;

    expect([SALA_2_AM, SALA_2_PM, SALA_1_PM].map((thread) => matchesChatFilter(thread, 1, filter))).toEqual([true, true, false]);
  });

  it('keeps the groups of the chosen shift', () => {
    const filter = { kind: 'shift', shift: 'afternoon' } as const;

    expect([SALA_2_AM, SALA_2_PM].map((thread) => matchesChatFilter(thread, 1, filter))).toEqual([false, true]);
  });

  it('keeps a group with no teacher with "Sin maestra"', () => {
    expect(matchesChatFilter(SALA_2_AM, 0, { kind: 'noTeacher' })).toBe(true);
  });

  it('drops a group with a teacher, or whose teachers are still loading, with "Sin maestra"', () => {
    expect([matchesChatFilter(SALA_2_AM, 1, { kind: 'noTeacher' }), matchesChatFilter(SALA_2_AM, null, { kind: 'noTeacher' })]).toEqual([false, false]);
  });
});

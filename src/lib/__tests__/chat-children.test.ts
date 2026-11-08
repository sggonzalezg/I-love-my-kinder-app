import { childNamesInGroup } from '../chat';

describe('childNamesInGroup', () => {
  const children = [
    { id: 'c1', firstName: 'Mateo', photoPath: null, groups: [{ roomId: 'r2', roomName: 'Sala 2', shiftId: 'morning', shift: 'morning' as const }] },
    { id: 'c2', firstName: 'Lucía', photoPath: null, groups: [{ roomId: 'r1', roomName: 'Sala 1', shiftId: 'afternoon', shift: 'afternoon' as const }] },
  ];

  it('names only the children enrolled in that room and shift', () => {
    expect(childNamesInGroup(children, { roomId: 'r2', shiftId: 'morning' })).toEqual(['Mateo']);
  });

  it('is empty for a group with none of the children', () => {
    expect(childNamesInGroup(children, { roomId: 'r3', shiftId: 'morning' })).toEqual([]);
  });
});

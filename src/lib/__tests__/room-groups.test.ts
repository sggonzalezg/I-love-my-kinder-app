import { roomGroupsOf } from '../room-groups';

const SALA_2_MORNING = { roomId: 'sala-2', roomName: 'Sala 2', shiftId: 'morning-id', shift: 'morning' as const };
const SALA_2_AFTERNOON = { roomId: 'sala-2', roomName: 'Sala 2', shiftId: 'afternoon-id', shift: 'afternoon' as const };
const SALA_1_MORNING = { roomId: 'sala-1', roomName: 'Sala 1', shiftId: 'morning-id', shift: 'morning' as const };

describe('roomGroupsOf', () => {
  it('gives siblings in the same room and shift one group', () => {
    const children = [
      { id: 'mateo', firstName: 'Mateo', photoPath: null, groups: [SALA_2_MORNING] },
      { id: 'lucia', firstName: 'Lucía', photoPath: null, groups: [SALA_2_MORNING] },
    ];

    expect(roomGroupsOf(children)).toHaveLength(1);
  });

  it('lists each room and shift a child attends', () => {
    const children = [
      { id: 'mateo', firstName: 'Mateo', photoPath: null, groups: [SALA_2_MORNING, SALA_2_AFTERNOON] },
      { id: 'lucia', firstName: 'Lucía', photoPath: null, groups: [SALA_1_MORNING] },
    ];

    expect(roomGroupsOf(children).map((group) => group.key)).toEqual([
      'sala-2:morning-id',
      'sala-2:afternoon-id',
      'sala-1:morning-id',
    ]);
  });

  it('has no group for a child with no current enrollment', () => {
    const children = [{ id: 'mateo', firstName: 'Mateo', photoPath: null, groups: [] }];

    expect(roomGroupsOf(children)).toEqual([]);
  });
});

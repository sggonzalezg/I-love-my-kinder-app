import {
  audienceCaptionLabel,
  audienceReach,
  audienceReachLine,
  audienceScope,
  directorAudienceOptions,
  firstAudienceKeyOf,
  optionsInScope,
  type NurseryAudience,
} from '@/lib/director-event-audience';

const SALA_2_MORNING = { roomId: 'room-2', roomName: 'Sala 2', shiftId: 'morning-id', shift: 'morning' as const };
const SALA_2_AFTERNOON = { roomId: 'room-2', roomName: 'Sala 2', shiftId: 'afternoon-id', shift: 'afternoon' as const };
const SALA_10_MORNING = { roomId: 'room-10', roomName: 'Sala 10', shiftId: 'morning-id', shift: 'morning' as const };

const AUDIENCE: NurseryAudience = {
  children: [
    { memberId: 'mateo', ...SALA_2_MORNING },
    { memberId: 'mateo', ...SALA_2_AFTERNOON },
    { memberId: 'lucia', ...SALA_2_AFTERNOON },
    { memberId: 'tomas', ...SALA_10_MORNING },
  ],
  teachers: [
    { memberId: 'sofia', ...SALA_2_MORNING },
    { memberId: 'sofia', ...SALA_2_AFTERNOON },
    { memberId: 'ana', ...SALA_10_MORNING },
  ],
};

describe('directorAudienceOptions', () => {
  it('lists the whole nursery, then each room, then each group by room and shift', () => {
    const labels = directorAudienceOptions(AUDIENCE).map((option) => option.label);

    expect(labels).toEqual(['Todo el jardín', 'Sala 2', 'Sala 10', 'Sala 2 · Matutino', 'Sala 2 · Vespertino', 'Sala 10 · Matutino']);
  });

  it('includes a group that only has a teacher', () => {
    const options = directorAudienceOptions({ children: [], teachers: [{ memberId: 'ana', ...SALA_10_MORNING }] });

    expect(options.map((option) => option.label)).toEqual(['Todo el jardín', 'Sala 10', 'Sala 10 · Matutino']);
  });

  it('gives the whole nursery no room and no shift', () => {
    const [nursery] = directorAudienceOptions(AUDIENCE);

    expect(nursery).toEqual({ key: ':', roomId: null, shiftId: null, label: 'Todo el jardín' });
  });
});

describe('audienceScope', () => {
  it('reads an option without a room as the whole nursery', () => {
    expect(audienceScope({ roomId: null, shiftId: null })).toBe('nursery');
  });

  it('reads an option without a shift as one room', () => {
    expect(audienceScope({ roomId: 'room-2', shiftId: null })).toBe('room');
  });

  it('reads an option with a room and a shift as a group', () => {
    expect(audienceScope({ roomId: 'room-2', shiftId: 'morning-id' })).toBe('group');
  });
});

describe('optionsInScope', () => {
  it('keeps only the rooms for the room scope', () => {
    const labels = optionsInScope(directorAudienceOptions(AUDIENCE), 'room').map((option) => option.label);

    expect(labels).toEqual(['Sala 2', 'Sala 10']);
  });
});

describe('firstAudienceKeyOf', () => {
  it('picks the first group for the group scope', () => {
    expect(firstAudienceKeyOf(directorAudienceOptions(AUDIENCE), 'group')).toBe('room-2:morning-id');
  });

  it('gives no key when the nursery has no rooms yet', () => {
    expect(firstAudienceKeyOf(directorAudienceOptions({ children: [], teachers: [] }), 'room')).toBeNull();
  });
});

describe('audienceReach', () => {
  it('counts every child and teacher of the nursery once', () => {
    expect(audienceReach(AUDIENCE, { roomId: null, shiftId: null })).toEqual({ familyCount: 3, teacherCount: 2 });
  });

  it('counts a child in both shifts of a room once', () => {
    expect(audienceReach(AUDIENCE, { roomId: 'room-2', shiftId: null })).toEqual({ familyCount: 2, teacherCount: 1 });
  });

  it('counts only the group for a room and shift', () => {
    expect(audienceReach(AUDIENCE, { roomId: 'room-2', shiftId: 'afternoon-id' })).toEqual({ familyCount: 2, teacherCount: 1 });
  });
});

describe('audienceReachLine', () => {
  it('names the families and the teachers who see it', () => {
    expect(audienceReachLine({ familyCount: 142, teacherCount: 14 })).toBe('Lo ven 142 familias y 14 maestras');
  });

  it('uses the singular for one family and one teacher', () => {
    expect(audienceReachLine({ familyCount: 1, teacherCount: 1 })).toBe('Lo ven 1 familia y 1 maestra');
  });
});

describe('audienceCaptionLabel', () => {
  it('says todo el jardín for the whole nursery', () => {
    expect(audienceCaptionLabel({ roomId: null, label: 'Todo el jardín' })).toBe('todo el jardín');
  });

  it('keeps the label of a room or a group', () => {
    expect(audienceCaptionLabel({ roomId: 'room-2', label: 'Sala 2 · Matutino' })).toBe('Sala 2 · Matutino');
  });
});

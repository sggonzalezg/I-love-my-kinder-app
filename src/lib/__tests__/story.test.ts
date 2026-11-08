import {
  nextDayPosition,
  nextStoryPosition,
  previousDayPosition,
  previousStoryPosition,
  saveFileName,
  storyPositionOf,
  storyTimeLabel,
  uploaderLabel,
} from '../story';

const DAY_LENGTHS = [2, 3];

describe('nextStoryPosition', () => {
  it('moves to the next item of the same day', () => {
    expect(nextStoryPosition({ dayIndex: 0, itemIndex: 0 }, DAY_LENGTHS)).toEqual({ dayIndex: 0, itemIndex: 1 });
  });

  it('moves to the first item of the next day after the last item of a day', () => {
    expect(nextStoryPosition({ dayIndex: 0, itemIndex: 1 }, DAY_LENGTHS)).toEqual({ dayIndex: 1, itemIndex: 0 });
  });

  it('ends after the last item of the last day', () => {
    expect(nextStoryPosition({ dayIndex: 1, itemIndex: 2 }, DAY_LENGTHS)).toBeNull();
  });
});

describe('previousStoryPosition', () => {
  it('moves to the previous item of the same day', () => {
    expect(previousStoryPosition({ dayIndex: 1, itemIndex: 2 }, DAY_LENGTHS)).toEqual({ dayIndex: 1, itemIndex: 1 });
  });

  it('moves to the last item of the previous day from the first item of a day', () => {
    expect(previousStoryPosition({ dayIndex: 1, itemIndex: 0 }, DAY_LENGTHS)).toEqual({ dayIndex: 0, itemIndex: 1 });
  });

  it('stays on the very first item', () => {
    expect(previousStoryPosition({ dayIndex: 0, itemIndex: 0 }, DAY_LENGTHS)).toEqual({ dayIndex: 0, itemIndex: 0 });
  });
});

describe('day jumps', () => {
  it('jumps to the first item of the next day', () => {
    expect(nextDayPosition({ dayIndex: 0, itemIndex: 1 }, DAY_LENGTHS)).toEqual({ dayIndex: 1, itemIndex: 0 });
  });

  it('has no next day on the last day', () => {
    expect(nextDayPosition({ dayIndex: 1, itemIndex: 0 }, DAY_LENGTHS)).toBeNull();
  });

  it('jumps to the first item of the previous day', () => {
    expect(previousDayPosition({ dayIndex: 1, itemIndex: 2 })).toEqual({ dayIndex: 0, itemIndex: 0 });
  });

  it('has no previous day on the first day', () => {
    expect(previousDayPosition({ dayIndex: 0, itemIndex: 1 })).toBeNull();
  });
});

describe('storyPositionOf', () => {
  const sections = [{ items: [{ id: 'a' }, { id: 'b' }] }, { items: [{ id: 'c' }] }];

  it('finds the day and item of the opened tile', () => {
    expect(storyPositionOf(sections, 'c')).toEqual({ dayIndex: 1, itemIndex: 0 });
  });

  it('starts at the first item when the tile is gone', () => {
    expect(storyPositionOf(sections, 'missing')).toEqual({ dayIndex: 0, itemIndex: 0 });
  });
});

describe('uploaderLabel', () => {
  it('names a teacher as "Maestra" and her first name', () => {
    expect(uploaderLabel({ role: 'teacher', firstName: 'Sofía' })).toBe('Maestra Sofía');
  });

  it('names the director as "Dirección"', () => {
    expect(uploaderLabel({ role: 'director', firstName: 'Laura' })).toBe('Dirección');
  });
});

describe('storyTimeLabel', () => {
  const now = new Date(2026, 10, 7, 15, 0);

  it('shows the day and time of a photo', () => {
    expect(storyTimeLabel(new Date(2026, 10, 7, 10, 24).toISOString(), now, null)).toBe('Hoy · 10:24');
  });

  it('adds the length of a video', () => {
    expect(storyTimeLabel(new Date(2026, 10, 6, 11, 2).toISOString(), now, 42.4)).toBe('Ayer · 11:02 · 0:42');
  });
});

describe('saveFileName', () => {
  it('keeps the extension of the stored file', () => {
    expect(saveFileName({ id: 'm1', type: 'video', filePath: 'nursery/room/2026/clip.MP4' })).toBe('m1.mp4');
  });

  it('falls back to jpg for a photo path without extension', () => {
    expect(saveFileName({ id: 'm2', type: 'photo', filePath: 'nursery/room/photo' })).toBe('m2.jpg');
  });

  it('falls back to mp4 for a video path without extension', () => {
    expect(saveFileName({ id: 'm3', type: 'video', filePath: 'nursery/room.v2/clip' })).toBe('m3.mp4');
  });
});

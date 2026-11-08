import { chatImagePath, chatPhotoVisibility, isPhotoVisibleToFamily, resizeToLongSide, uploadFraction } from '../chat-photo';
import type { GalleryEnrollment } from '../gallery';

const GROUP = { roomId: 'room-2', shiftId: 'shift-am' };

function enrollment(overrides: Partial<GalleryEnrollment>): GalleryEnrollment {
  return {
    roomId: 'room-2',
    roomName: 'Sala 2',
    shiftId: 'shift-am',
    shift: 'morning',
    startedAt: '2026-11-03T12:00:00.000Z',
    endedAt: null,
    ...overrides,
  };
}

describe('resizeToLongSide', () => {
  it('shrinks a landscape photo by its width', () => {
    expect(resizeToLongSide({ width: 4032, height: 3024 }, 1600)).toEqual({ width: 1600 });
  });

  it('shrinks a portrait photo by its height', () => {
    expect(resizeToLongSide({ width: 3024, height: 4032 }, 1600)).toEqual({ height: 1600 });
  });

  it('leaves a photo that already fits as it is', () => {
    expect(resizeToLongSide({ width: 1200, height: 900 }, 1600)).toBeNull();
  });
});

describe('chatImagePath', () => {
  it('puts the photo under the nursery and the thread, as the storage policy reads it', () => {
    expect(chatImagePath('nursery-1', 'thread-1', 'file-1')).toBe('nursery-1/thread-1/file-1.jpg');
  });
});

describe('isPhotoVisibleToFamily', () => {
  it('shows a photo sent while the child is in the group', () => {
    expect(isPhotoVisibleToFamily('2026-11-05T10:00:00.000Z', GROUP, [enrollment({})])).toBe(true);
  });

  it('hides a photo sent before the child joined the group', () => {
    expect(isPhotoVisibleToFamily('2026-10-20T10:00:00.000Z', GROUP, [enrollment({})])).toBe(false);
  });

  it('shows it when a sibling was already in the group', () => {
    const sibling = enrollment({ startedAt: '2026-03-02T12:00:00.000Z' });

    expect(isPhotoVisibleToFamily('2026-10-20T10:00:00.000Z', GROUP, [enrollment({}), sibling])).toBe(true);
  });

  it('ignores the child’s enrollments in other groups', () => {
    const otherRoom = enrollment({ roomId: 'room-1', startedAt: '2026-03-02T12:00:00.000Z' });

    expect(isPhotoVisibleToFamily('2026-10-20T10:00:00.000Z', GROUP, [enrollment({}), otherRoom])).toBe(false);
  });

  it('hides a photo sent while the child was away from the group', () => {
    const earlier = enrollment({ startedAt: '2026-03-02T12:00:00.000Z', endedAt: '2026-06-30T12:00:00.000Z' });

    expect(isPhotoVisibleToFamily('2026-08-10T10:00:00.000Z', GROUP, [earlier, enrollment({})])).toBe(false);
  });
});

describe('chatPhotoVisibility', () => {
  const beforeJoining = '2026-10-20T10:00:00.000Z';

  it('shows every photo to teachers and the direction', () => {
    expect([chatPhotoVisibility('teacher', beforeJoining, GROUP, null), chatPhotoVisibility('director', beforeJoining, GROUP, null)]).toEqual([
      'visible',
      'visible',
    ]);
  });

  it('waits for the family’s enrollments before deciding', () => {
    expect(chatPhotoVisibility('family', beforeJoining, GROUP, null)).toBe('checking');
  });

  it('hides from a family a photo sent before its child joined', () => {
    expect(chatPhotoVisibility('family', beforeJoining, GROUP, [enrollment({})])).toBe('hidden');
  });
});

describe('uploadFraction', () => {
  it('is the share of bytes already sent', () => {
    expect(uploadFraction(300, 1200)).toBe(0.25);
  });

  it('is zero before the size is known', () => {
    expect(uploadFraction(0, 0)).toBe(0);
  });

  it('never passes one', () => {
    expect(uploadFraction(1300, 1200)).toBe(1);
  });
});

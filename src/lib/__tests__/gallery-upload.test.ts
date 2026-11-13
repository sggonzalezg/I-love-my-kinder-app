import {
  coverFileName,
  durationSecondsOf,
  enqueueUploads,
  galleryFilePath,
  hasUnfinishedUploads,
  isTooLong,
  mediaFileName,
  nextToUpload,
  queueGroups,
  remainingUploadCount,
  resumeInterrupted,
  tooLongCount,
  updateUpload,
  uploadablePicks,
  uploadFailureStatus,
  uploadGroupsHeading,
  withoutUploaded,
  type PickedMedia,
  type UploadItem,
  type UploadStatus,
} from '../gallery-upload';
import type { ChildGroup } from '../room-groups';

const room2Morning: ChildGroup = { roomId: 'room-2', roomName: 'Sala 2', shiftId: 'am', shift: 'morning' };
const room2Afternoon: ChildGroup = { roomId: 'room-2', roomName: 'Sala 2', shiftId: 'pm', shift: 'afternoon' };
const room3Afternoon: ChildGroup = { roomId: 'room-3', roomName: 'Sala 3', shiftId: 'pm', shift: 'afternoon' };

function pick(id: string, kind: PickedMedia['kind'] = 'photo', durationSeconds: number | null = null): PickedMedia {
  return { id, kind, uri: `file:///${id}`, width: 100, height: 100, durationSeconds, thumbnailUri: null };
}

function item(id: string, status: UploadStatus, groups: ChildGroup[] = [room2Morning]): UploadItem {
  return { ...pick(id), nurseryId: 'nursery', uploaderId: 'teacher', groups, preparedUri: null, coverUri: null, status, progress: 0.5 };
}

describe('picked media (T5)', () => {
  it('turns the picker duration in milliseconds into whole seconds', () => {
    expect(durationSecondsOf(42_400)).toBe(42);
  });

  it('has no duration for a photo', () => {
    expect(durationSecondsOf(null)).toBeNull();
  });

  it('marks a video longer than 1:30 as too long', () => {
    expect(isTooLong(pick('nap', 'video', 130))).toBe(true);
  });

  it('accepts a video of exactly 1:30', () => {
    expect(isTooLong(pick('blocks', 'video', 90))).toBe(false);
  });

  it('never marks a photo as too long', () => {
    expect(isTooLong(pick('bubbles'))).toBe(false);
  });

  it('leaves the too-long videos out of the upload and counts them', () => {
    const picks = [pick('bubbles'), pick('blocks', 'video', 42), pick('nap', 'video', 130)];
    expect(uploadablePicks(picks).map((media) => media.id)).toEqual(['bubbles', 'blocks']);
    expect(tooLongCount(picks)).toBe(1);
  });
});

describe('gallery paths', () => {
  it('puts the file in the group folder the storage policy reads', () => {
    expect(galleryFilePath('nursery', room2Morning, 'abc.jpg')).toBe('nursery/room-2/am/abc.jpg');
  });

  it('names a photo as JPEG and a video as MP4', () => {
    expect(mediaFileName('abc', 'photo')).toBe('abc.jpg');
    expect(mediaFileName('abc', 'video')).toBe('abc.mp4');
  });

  it('names the video cover after the video', () => {
    expect(coverFileName('abc')).toBe('abc-cover.jpg');
  });
});

describe('uploadGroupsHeading', () => {
  it('joins the two shifts of one room', () => {
    expect(uploadGroupsHeading([room2Morning, room2Afternoon])).toBe('Sala 2 · Matutino y Vespertino');
  });

  it('names a single group', () => {
    expect(uploadGroupsHeading([room2Afternoon])).toBe('Sala 2 · Vespertino');
  });

  it('joins different rooms', () => {
    expect(uploadGroupsHeading([room2Morning, room3Afternoon])).toBe('Sala 2 · Matutino y Sala 3 · Vespertino');
  });
});

describe('upload queue', () => {
  it('adds new files at the end', () => {
    const queue = enqueueUploads([item('a', 'queued')], [item('b', 'queued')]);
    expect(queue.map((upload) => upload.id)).toEqual(['a', 'b']);
  });

  it('changes only the named item', () => {
    const queue = updateUpload([item('a', 'queued'), item('b', 'queued')], 'b', { status: 'uploading' });
    expect(queue.map((upload) => upload.status)).toEqual(['queued', 'uploading']);
  });

  it('takes the oldest waiting item, skipping failed ones', () => {
    expect(nextToUpload([item('a', 'uploaded'), item('b', 'failed'), item('c', 'offline'), item('d', 'queued')])?.id).toBe('c');
  });

  it('has nothing to upload when only failed and uploaded items are left', () => {
    expect(nextToUpload([item('a', 'uploaded'), item('b', 'failed')])).toBeNull();
  });

  it('counts every file not uploaded for the tab badge', () => {
    expect(remainingUploadCount([item('a', 'uploaded'), item('b', 'failed'), item('c', 'uploading'), item('d', 'preparing')])).toBe(3);
  });

  it('sees no unfinished upload when only failed and uploaded items are left', () => {
    expect(hasUnfinishedUploads([item('a', 'uploaded'), item('b', 'failed')])).toBe(false);
  });

  it('sees an item waiting for the connection as unfinished', () => {
    expect(hasUnfinishedUploads([item('a', 'offline')])).toBe(true);
  });

  it('drops the uploaded items', () => {
    expect(withoutUploaded([item('a', 'uploaded'), item('b', 'failed')]).map((upload) => upload.id)).toEqual(['b']);
  });

  it('restarts an item that was preparing or uploading when the app closed', () => {
    const queue = resumeInterrupted([item('a', 'uploading'), item('b', 'preparing'), item('c', 'failed')]);
    expect(queue.map((upload) => [upload.status, upload.progress])).toEqual([
      ['queued', 0],
      ['queued', 0],
      ['failed', 0.5],
    ]);
  });

  it('lists each group of the queue once', () => {
    const queue = [item('a', 'queued', [room2Morning, room2Afternoon]), item('b', 'queued', [room2Morning])];
    expect(queueGroups(queue)).toEqual([room2Morning, room2Afternoon]);
  });
});

describe('uploadFailureStatus', () => {
  it('waits for the connection after a network failure', () => {
    expect(uploadFailureStatus(new Error('Network request failed'))).toBe('offline');
  });

  it('fails an item the server refused', () => {
    expect(uploadFailureStatus(Object.assign(new Error('Forbidden'), { status: 403 }))).toBe('failed');
  });
});

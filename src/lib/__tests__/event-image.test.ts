import { eventImageChange, eventImagePath, isEventImageChanged } from '@/lib/event-image';

const STORED = { uri: 'https://storage/signed/poster.jpg', storedPath: 'nursery-1/event-1/poster.jpg' };
const PICKED = { uri: 'file:///cache/picked.jpg', storedPath: null };

describe('eventImagePath', () => {
  it('puts the event id in the second folder, as the storage policy reads it', () => {
    expect(eventImagePath('nursery-1', 'event-1', 'abc')).toBe('nursery-1/event-1/abc.jpg');
  });
});

describe('isEventImageChanged', () => {
  it('is false when the stored image is kept', () => {
    expect(isEventImageChanged(STORED, STORED)).toBe(false);
  });

  it('is true when an image is picked on a form without one', () => {
    expect(isEventImageChanged(null, PICKED)).toBe(true);
  });
});

describe('eventImageChange', () => {
  it('does nothing when nothing changed', () => {
    expect(eventImageChange(null, null)).toEqual({ kind: 'none' });
  });

  it('uploads a picked image on a new event', () => {
    expect(eventImageChange(null, PICKED)).toEqual({ kind: 'upload', localUri: PICKED.uri, replacedPath: null });
  });

  it('uploads a replacement and names the stored file it replaces', () => {
    expect(eventImageChange(STORED, PICKED)).toEqual({ kind: 'upload', localUri: PICKED.uri, replacedPath: STORED.storedPath });
  });

  it('removes the stored image when it is taken out', () => {
    expect(eventImageChange(STORED, null)).toEqual({ kind: 'remove', removedPath: STORED.storedPath });
  });
});

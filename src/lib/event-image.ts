const EVENT_IMAGE_EXTENSION = 'jpg';

/** `uri` is what the preview shows: a signed URL for the stored image, a local file for a picked one. */
export interface EventImage {
  uri: string;
  storedPath: string | null;
}

export type EventImageChange =
  | { kind: 'none' }
  | { kind: 'upload'; localUri: string; replacedPath: string | null }
  | { kind: 'remove'; removedPath: string };

/** The `event_images_upload` policy reads the event id from the second folder of the path. */
export function eventImagePath(nurseryId: string, eventId: string, imageId: string): string {
  return `${nurseryId}/${eventId}/${imageId}.${EVENT_IMAGE_EXTENSION}`;
}

export function isEventImageChanged(initial: EventImage | null, current: EventImage | null): boolean {
  return (initial?.uri ?? null) !== (current?.uri ?? null);
}

export function eventImageChange(initial: EventImage | null, current: EventImage | null): EventImageChange {
  if (!isEventImageChanged(initial, current)) return { kind: 'none' };
  const initialPath = initial?.storedPath ?? null;
  if (current) return { kind: 'upload', localUri: current.uri, replacedPath: initialPath };
  return initialPath ? { kind: 'remove', removedPath: initialPath } : { kind: 'none' };
}

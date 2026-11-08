import type { GalleryEnrollment } from './gallery';
import type { Role } from './role';
import type { ChildGroup } from './room-groups';

export interface ImageSize {
  width: number;
  height: number;
}

const CHAT_PHOTO_EXTENSION = 'jpg';

/** The resize that brings the long side down to maxSide, or null when the photo already fits. */
export function resizeToLongSide({ width, height }: ImageSize, maxSide: number): { width: number } | { height: number } | null {
  if (Math.max(width, height) <= maxSide) return null;
  return width >= height ? { width: maxSide } : { height: maxSide };
}

// The storage policy reads the thread from the second path segment.
export function chatImagePath(nurseryId: string, threadId: string, fileId: string): string {
  return `${nurseryId}/${threadId}/${fileId}.${CHAT_PHOTO_EXTENSION}`;
}

/** A family sees a chat photo only if one of its children was in that group when it was sent (design round 22). */
export function isPhotoVisibleToFamily(sentAt: string, group: Pick<ChildGroup, 'roomId' | 'shiftId'>, enrollments: GalleryEnrollment[]): boolean {
  const sent = Date.parse(sentAt);
  return enrollments.some(
    (enrollment) =>
      enrollment.roomId === group.roomId &&
      enrollment.shiftId === group.shiftId &&
      Date.parse(enrollment.startedAt) <= sent &&
      (enrollment.endedAt === null || sent <= Date.parse(enrollment.endedAt)),
  );
}

export type ChatPhotoVisibility = 'visible' | 'hidden' | 'checking';

/** Staff see every photo; a family's photos wait for its children's enrollments before any URL is asked for. */
export function chatPhotoVisibility(
  viewer: Role,
  sentAt: string,
  group: Pick<ChildGroup, 'roomId' | 'shiftId'>,
  familyEnrollments: GalleryEnrollment[] | null,
): ChatPhotoVisibility {
  if (viewer !== 'family') return 'visible';
  if (!familyEnrollments) return 'checking';
  return isPhotoVisibleToFamily(sentAt, group, familyEnrollments) ? 'visible' : 'hidden';
}

export function uploadFraction(bytesSent: number, totalBytes: number): number {
  if (totalBytes <= 0) return 0;
  return Math.min(bytesSent / totalBytes, 1);
}

import {
  GALLERY_COVER_SUFFIX,
  GALLERY_PHOTO_EXTENSION,
  GALLERY_VIDEO_EXTENSION,
  MAX_VIDEO_SECONDS,
  MILLISECONDS_PER_SECOND,
} from '@/constants/gallery-upload';

import { isNetworkFailure } from './network';
import type { ChildGroup } from './room-groups';
import { shiftLabel } from './shift';

export type UploadMediaKind = 'photo' | 'video';

export interface PickedMedia {
  id: string;
  kind: UploadMediaKind;
  uri: string;
  width: number;
  height: number;
  durationSeconds: number | null;
  /** A video's first frame for the grid and the queue; a photo shows itself. */
  thumbnailUri: string | null;
}

export type UploadStatus = 'queued' | 'preparing' | 'uploading' | 'offline' | 'failed' | 'uploaded';

export interface UploadItem extends PickedMedia {
  nurseryId: string;
  uploaderId: string;
  groups: ChildGroup[];
  /** The compressed file and the video cover, kept in the app's documents until the upload ends. */
  preparedUri: string | null;
  coverUri: string | null;
  status: UploadStatus;
  progress: number;
}

const WAITING_STATUSES: UploadStatus[] = ['queued', 'offline'];
const UNFINISHED_STATUSES: UploadStatus[] = ['queued', 'preparing', 'uploading', 'offline'];
const INTERRUPTED_STATUSES: UploadStatus[] = ['preparing', 'uploading'];

export function durationSecondsOf(durationMs: number | null | undefined): number | null {
  return durationMs ? Math.round(durationMs / MILLISECONDS_PER_SECOND) : null;
}

export function isTooLong(media: Pick<PickedMedia, 'kind' | 'durationSeconds'>): boolean {
  return media.kind === 'video' && (media.durationSeconds ?? 0) > MAX_VIDEO_SECONDS;
}

export function uploadablePicks(picks: PickedMedia[]): PickedMedia[] {
  return picks.filter((pick) => !isTooLong(pick));
}

export function tooLongCount(picks: PickedMedia[]): number {
  return picks.length - uploadablePicks(picks).length;
}

// The storage policies read the nursery, room and shift from the first three path segments.
export function galleryFilePath(nurseryId: string, group: Pick<ChildGroup, 'roomId' | 'shiftId'>, fileName: string): string {
  return `${nurseryId}/${group.roomId}/${group.shiftId}/${fileName}`;
}

export function mediaFileName(id: string, kind: UploadMediaKind): string {
  return `${id}.${kind === 'video' ? GALLERY_VIDEO_EXTENSION : GALLERY_PHOTO_EXTENSION}`;
}

export function coverFileName(id: string): string {
  return `${id}${GALLERY_COVER_SUFFIX}.${GALLERY_PHOTO_EXTENSION}`;
}

/** "Sala 2 · Matutino y Vespertino": the shifts of one room go together, then the rooms in order. */
export function uploadGroupsHeading(groups: ChildGroup[]): string {
  const shiftsByRoom = new Map<string, string[]>();
  for (const group of groups) {
    const shifts = shiftsByRoom.get(group.roomName) ?? [];
    const shift = shiftLabel(group.shift);
    if (!shifts.includes(shift)) shiftsByRoom.set(group.roomName, [...shifts, shift]);
  }
  return [...shiftsByRoom].map(([roomName, shifts]) => `${roomName} · ${shifts.join(' y ')}`).join(' y ');
}

export function enqueueUploads(queue: UploadItem[], items: UploadItem[]): UploadItem[] {
  return [...queue, ...items];
}

export function updateUpload(queue: UploadItem[], id: string, change: Partial<UploadItem>): UploadItem[] {
  return queue.map((item) => (item.id === id ? { ...item, ...change } : item));
}

/** Failed items wait for "Reintentar"; the rest go oldest first. */
export function nextToUpload(queue: UploadItem[]): UploadItem | null {
  return queue.find((item) => WAITING_STATUSES.includes(item.status)) ?? null;
}

/** What the Galería tab badge counts: every file not uploaded yet, failed ones included. */
export function remainingUploadCount(queue: UploadItem[]): number {
  return queue.filter((item) => item.status !== 'uploaded').length;
}

export function hasUnfinishedUploads(queue: UploadItem[]): boolean {
  return queue.some((item) => UNFINISHED_STATUSES.includes(item.status));
}

export function withoutUploaded(queue: UploadItem[]): UploadItem[] {
  return queue.filter((item) => item.status !== 'uploaded');
}

/** A file that was preparing or uploading when the app closed starts that step again. */
export function resumeInterrupted(queue: UploadItem[]): UploadItem[] {
  return queue.map((item) => (INTERRUPTED_STATUSES.includes(item.status) ? { ...item, status: 'queued', progress: 0 } : item));
}

export function uploadFailureStatus(error: unknown): Extract<UploadStatus, 'offline' | 'failed'> {
  return isNetworkFailure(error) ? 'offline' : 'failed';
}

export function queueGroups(queue: UploadItem[]): ChildGroup[] {
  const seen = new Set<string>();
  return queue
    .flatMap((item) => item.groups)
    .filter((group) => {
      const key = `${group.roomId}:${group.shiftId}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

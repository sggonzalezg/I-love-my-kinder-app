import { dayChipLabel, formatCountdown, formatTime } from './dates';
import type { GalleryMedia } from './gallery';

export interface StoryPosition {
  dayIndex: number;
  itemIndex: number;
}

const FIRST_POSITION: StoryPosition = { dayIndex: 0, itemIndex: 0 };

/** Null means the last story ended and the viewer closes. */
export function nextStoryPosition(position: StoryPosition, dayLengths: number[]): StoryPosition | null {
  if (position.itemIndex + 1 < dayLengths[position.dayIndex]) {
    return { dayIndex: position.dayIndex, itemIndex: position.itemIndex + 1 };
  }
  return nextDayPosition(position, dayLengths);
}

export function previousStoryPosition(position: StoryPosition, dayLengths: number[]): StoryPosition {
  if (position.itemIndex > 0) return { dayIndex: position.dayIndex, itemIndex: position.itemIndex - 1 };
  if (position.dayIndex === 0) return position;
  const previousDay = position.dayIndex - 1;
  return { dayIndex: previousDay, itemIndex: dayLengths[previousDay] - 1 };
}

export function nextDayPosition(position: StoryPosition, dayLengths: number[]): StoryPosition | null {
  return position.dayIndex + 1 < dayLengths.length ? { dayIndex: position.dayIndex + 1, itemIndex: 0 } : null;
}

export function previousDayPosition(position: StoryPosition): StoryPosition | null {
  return position.dayIndex > 0 ? { dayIndex: position.dayIndex - 1, itemIndex: 0 } : null;
}

export function storyPositionOf(sections: { items: { id: string }[] }[], mediaId: string): StoryPosition {
  for (const [dayIndex, section] of sections.entries()) {
    const itemIndex = section.items.findIndex((item) => item.id === mediaId);
    if (itemIndex >= 0) return { dayIndex, itemIndex };
  }
  return FIRST_POSITION;
}

export function uploaderLabel({ role, firstName }: { role: string; firstName: string }): string {
  return role === 'director' ? 'Dirección' : `Maestra ${firstName}`;
}

export function storyTimeLabel(createdAt: string, now: Date, videoSeconds: number | null): string {
  const created = new Date(createdAt);
  const parts = [dayChipLabel(created, now), formatTime(created)];
  if (videoSeconds !== null) parts.push(formatCountdown(Math.round(videoSeconds)));
  return parts.join(' · ');
}

export interface NoticeRecord {
  document_version: string;
  accepted: boolean;
}

// record-consent stores the version as a number ("1" for "1.0"), so versions are compared as numbers.
/** `records` come newest first; the latest one decides. */
export function saveNoticeNeeded(records: NoticeRecord[], currentVersion: string): boolean {
  const latest = records[0];
  return !latest || !latest.accepted || Number(latest.document_version) !== Number(currentVersion);
}

const FALLBACK_EXTENSION: Record<GalleryMedia['type'], string> = { photo: 'jpg', video: 'mp4' };

export function saveFileName({ id, type, filePath }: Pick<GalleryMedia, 'id' | 'type' | 'filePath'>): string {
  const fileName = filePath.split('/').pop() ?? '';
  const dot = fileName.lastIndexOf('.');
  const extension = dot > 0 ? fileName.slice(dot + 1).toLowerCase() : FALLBACK_EXTENSION[type];
  return `${id}.${extension}`;
}

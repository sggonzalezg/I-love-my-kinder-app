import { dayChipLabel, formatTime, sameDay } from './dates';
import type { GalleryMedia, GalleryMediaType } from './gallery';

export const ALL_ROOMS_KEY = 'all';
const ALL_ROOMS_LABEL = 'Todas';

export interface DirectorGalleryMedia extends GalleryMedia {
  groupLabel: string;
  coverPath: string | null;
}

export interface NurseryRoom {
  id: string;
  name: string;
}

export interface RoomChip {
  key: string;
  label: string;
}

export function roomChipsOf(rooms: NurseryRoom[]): RoomChip[] {
  const byName = [...rooms].sort((first, second) => first.name.localeCompare(second.name, 'es', { numeric: true }));
  return [{ key: ALL_ROOMS_KEY, label: ALL_ROOMS_LABEL }, ...byName.map((room) => ({ key: room.id, label: room.name }))];
}

export function mediaDeletePaths(media: DirectorGalleryMedia): string[] {
  return media.coverPath ? [media.filePath, media.coverPath] : [media.filePath];
}

const TYPE_WORDS: Record<GalleryMediaType, { noun: string; title: string; confirm: string; toast: string }> = {
  photo: { noun: 'Foto', title: '¿Borrar esta foto?', confirm: 'Borrar foto', toast: 'Foto borrada' },
  video: { noun: 'Video', title: '¿Borrar este video?', confirm: 'Borrar video', toast: 'Video borrado' },
};

export function mediaName(media: DirectorGalleryMedia): string {
  return `${TYPE_WORDS[media.type].noun} de ${media.groupLabel}`;
}

export function uploadedLine(media: DirectorGalleryMedia, now: Date): string {
  const created = new Date(media.createdAt);
  const time = formatTime(created);
  const when = sameDay(created, now) ? time : `${dayChipLabel(created, now)} · ${time}`;
  return media.uploader ? `Subida por ${media.uploader.label} · ${when}` : `Subida a las ${when}`;
}

export function deleteMediaCopy(type: GalleryMediaType): { title: string; confirm: string } {
  const { title, confirm } = TYPE_WORDS[type];
  return { title, confirm };
}

export function deletedToast(type: GalleryMediaType): string {
  return TYPE_WORDS[type].toast;
}

export function directorEmptyTitle(roomName: string | null): string {
  return roomName ? `${roomName} todavía no tiene fotos` : 'Todavía no hay fotos';
}

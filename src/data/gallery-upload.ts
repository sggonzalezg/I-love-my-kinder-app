import { Directory, File, Paths } from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

import {
  GALLERY_JPEG_QUALITY,
  GALLERY_PHOTO_MAX_SIDE,
  GALLERY_PHOTO_MIME_TYPE,
  GALLERY_VIDEO_MIME_TYPE,
  MAX_VIDEO_SECONDS,
  UPLOAD_FILES_FOLDER,
  VIDEO_BITRATE,
  VIDEO_MAX_SIDE,
} from '@/constants/gallery-upload';
import { GALLERY_BUCKET } from '@/constants/storage';
import { coverFileName, durationSecondsOf, galleryFilePath, mediaFileName, type PickedMedia, type UploadItem } from '@/lib/gallery-upload';

import { newChatPhotoId as newFileId, type ChatPhotoSource } from './chat-photos';
import { reencodeAsJpeg } from './image-encoding';
import { uploadWithProgress } from './storage-upload';
import { supabase } from './supabase';
import { throwOnError } from './throw-on-error';

export type PickedGalleryMedia = PickedMedia[] | 'cancelled' | 'cameraDenied';

const PICKER_OPTIONS: ImagePicker.ImagePickerOptions = { mediaTypes: ['images', 'videos'], exif: false, quality: 1, videoMaxDuration: MAX_VIDEO_SECONDS };
const ALREADY_EXISTS = 'already exists';

// react-native-compressor is a native module that Expo Go and the web do not have; loading it lazily keeps the rest of the app working there.
async function loadCompressor() {
  return import('react-native-compressor');
}

async function videoThumbnail(uri: string): Promise<{ uri: string; width: number; height: number } | null> {
  try {
    const { createVideoThumbnail } = await loadCompressor();
    const thumbnail = await createVideoThumbnail(uri);
    return { uri: thumbnail.path, width: thumbnail.width, height: thumbnail.height };
  } catch (error) {
    console.warn('Could not make the video thumbnail:', error);
    return null;
  }
}

async function toPickedMedia(asset: ImagePicker.ImagePickerAsset): Promise<PickedMedia> {
  const kind = asset.type === 'video' ? 'video' : 'photo';
  const thumbnail = kind === 'video' ? await videoThumbnail(asset.uri) : null;
  return {
    id: newFileId(),
    kind,
    uri: asset.uri,
    width: asset.width,
    height: asset.height,
    durationSeconds: kind === 'video' ? durationSecondsOf(asset.duration) : null,
    thumbnailUri: thumbnail?.uri ?? null,
  };
}

/** The library uses the system photo picker, which needs no permission to read the photos. */
export async function pickGalleryMedia(source: ChatPhotoSource): Promise<PickedGalleryMedia> {
  if (source === 'camera') {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return 'cameraDenied';
  }
  const result =
    source === 'camera'
      ? await ImagePicker.launchCameraAsync(PICKER_OPTIONS)
      : await ImagePicker.launchImageLibraryAsync({ ...PICKER_OPTIONS, allowsMultipleSelection: true });
  if (result.canceled) return 'cancelled';
  return Promise.all(result.assets.map(toPickedMedia));
}

// The picker's files live in the cache, which the system may clear before a paused upload resumes.
async function keepUntilUploaded(uri: string, fileName: string): Promise<string> {
  const folder = new Directory(Paths.document, UPLOAD_FILES_FOLDER);
  folder.create({ idempotent: true, intermediates: true });
  const kept = new File(folder, fileName);
  if (kept.exists) kept.delete();
  await new File(uri).move(kept);
  return kept.uri;
}

async function compressVideo(uri: string): Promise<string> {
  const { Video } = await loadCompressor();
  // preserveMetadata false leaves the location and the camera data out of the uploaded video.
  return Video.compress(uri, { compressionMethod: 'manual', maxSize: VIDEO_MAX_SIDE, bitrate: VIDEO_BITRATE, preserveMetadata: false });
}

/** Photos at 1600 px, JPEG 0.8 and no EXIF; videos at 720p with a JPEG cover (SDD risk 4). */
export async function prepareGalleryMedia(item: UploadItem): Promise<Pick<UploadItem, 'preparedUri' | 'coverUri'>> {
  if (item.kind === 'photo') {
    const photo = await reencodeAsJpeg(item.uri, item, GALLERY_PHOTO_MAX_SIDE, GALLERY_JPEG_QUALITY);
    return { preparedUri: await keepUntilUploaded(photo, mediaFileName(item.id, 'photo')), coverUri: null };
  }
  const video = await compressVideo(item.uri);
  const frame = await videoThumbnail(video);
  const cover = frame ? await reencodeAsJpeg(frame.uri, frame, GALLERY_PHOTO_MAX_SIDE, GALLERY_JPEG_QUALITY) : null;
  return {
    preparedUri: await keepUntilUploaded(video, mediaFileName(item.id, 'video')),
    coverUri: cover ? await keepUntilUploaded(cover, coverFileName(item.id)) : null,
  };
}

export function isPreparedFileMissing(item: UploadItem): boolean {
  return item.preparedUri !== null && !new File(item.preparedUri).exists;
}

async function copyInGallery(fromPath: string, toPath: string): Promise<void> {
  const { error } = await supabase.storage.from(GALLERY_BUCKET).copy(fromPath, toPath);
  if (error && !error.message.includes(ALREADY_EXISTS)) throw new Error(`Gallery copy failed: ${error.message}`);
}

interface MediaRow {
  nursery_id: string;
  uploaded_by: string;
  room_id: string;
  shift_id: string;
  file_path: string;
  file_type: UploadItem['kind'];
  cover_path: string | null;
  duration_seconds: number | null;
}

function mediaRowsOf(item: UploadItem): MediaRow[] {
  return item.groups.map((group) => ({
    nursery_id: item.nurseryId,
    uploaded_by: item.uploaderId,
    room_id: group.roomId,
    shift_id: group.shiftId,
    file_path: galleryFilePath(item.nurseryId, group, mediaFileName(item.id, item.kind)),
    file_type: item.kind,
    cover_path: item.coverUri ? galleryFilePath(item.nurseryId, group, coverFileName(item.id)) : null,
    duration_seconds: item.kind === 'video' ? item.durationSeconds : null,
  }));
}

/** A retry after a lost response must not show the same file twice, so rows already saved are skipped. */
async function insertMissingMediaRows(rows: MediaRow[]): Promise<void> {
  const existing = throwOnError<{ file_path: string }[]>(
    await supabase
      .from('media')
      .select('file_path')
      .in(
        'file_path',
        rows.map((row) => row.file_path),
      ),
  );
  const saved = new Set(existing.map((row) => row.file_path));
  const missing = rows.filter((row) => !saved.has(row.file_path));
  if (missing.length) throwOnError(await supabase.from('media').insert(missing));
}

/**
 * The phone sends the file once, to the first group; every other group gets a copy made by Storage,
 * because each media row must point at a file in its own group folder (backend migration 053).
 * Storage copies only a file the teacher can read, which needs the first group's row to exist.
 */
export async function uploadGalleryItem(item: UploadItem, onProgress: (fraction: number) => void): Promise<void> {
  if (!item.preparedUri) throw new Error('The gallery file is not prepared');
  const [firstRow, ...otherRows] = mediaRowsOf(item);
  const mimeType = item.kind === 'video' ? GALLERY_VIDEO_MIME_TYPE : GALLERY_PHOTO_MIME_TYPE;

  await uploadWithProgress({ bucket: GALLERY_BUCKET, path: firstRow.file_path, localUri: item.preparedUri, mimeType, sessionType: 'background', onProgress });
  if (item.coverUri && firstRow.cover_path) {
    await uploadWithProgress({ bucket: GALLERY_BUCKET, path: firstRow.cover_path, localUri: item.coverUri, mimeType: GALLERY_PHOTO_MIME_TYPE, sessionType: 'background' });
  }
  await insertMissingMediaRows([firstRow]);
  for (const row of otherRows) {
    await copyInGallery(firstRow.file_path, row.file_path);
    if (firstRow.cover_path && row.cover_path) await copyInGallery(firstRow.cover_path, row.cover_path);
  }
  if (otherRows.length) await insertMissingMediaRows(otherRows);
}

export function deleteKeptFiles(item: UploadItem): void {
  for (const uri of [item.preparedUri, item.coverUri]) {
    if (!uri) continue;
    const file = new File(uri);
    if (file.exists) file.delete();
  }
}

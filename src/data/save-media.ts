import { File, Paths } from 'expo-file-system';
import { Asset, requestPermissionsAsync } from 'expo-media-library';

import type { GalleryMedia } from '@/lib/gallery';
import { saveFileName } from '@/lib/story';

export type SaveMediaResult = 'saved' | 'permissionDenied';

const WRITE_ONLY = true;

// Add-only access: the app never asks to read the family's photo library (design F7b).
export async function saveMediaToDevice(media: GalleryMedia): Promise<SaveMediaResult> {
  if (!media.url) throw new Error(`Media ${media.id} has no signed URL`);
  const permission = await requestPermissionsAsync(WRITE_ONLY);
  if (!permission.granted) return 'permissionDenied';

  const destination = new File(Paths.cache, saveFileName(media));
  if (destination.exists) destination.delete();
  const downloaded = await File.downloadFileAsync(media.url, destination);
  try {
    await Asset.create(downloaded.uri);
  } finally {
    downloaded.delete();
  }
  return 'saved';
}

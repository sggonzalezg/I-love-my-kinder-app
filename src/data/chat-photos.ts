import { File, UploadTask, UploadType } from 'expo-file-system';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

import { SIGNED_URL_EXPIRY_SECONDS } from '@/constants/cache';
import { CHAT_PHOTO_JPEG_QUALITY, CHAT_PHOTO_MAX_SIDE, CHAT_PHOTO_MIME_TYPE } from '@/constants/chat';
import { CHAT_IMAGES_BUCKET } from '@/constants/storage';
import { resizeToLongSide, uploadFraction, type ImageSize } from '@/lib/chat-photo';

import { SUPABASE_ANON_KEY, SUPABASE_URL, supabase } from './supabase';

export type ChatPhotoSource = 'camera' | 'library';
export type PickedChatPhoto = { uri: string } | 'cancelled' | 'cameraDenied';

const PICKER_OPTIONS: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], exif: false, quality: 1 };
const HTTP_MULTIPLE_CHOICES = 300;
const DUPLICATE_OBJECT = 'Duplicate';

// Re-encoding as JPEG drops the EXIF data, so the photo's location never leaves the phone.
async function toChatJpeg(uri: string, size: ImageSize): Promise<string> {
  const context = ImageManipulator.manipulate(uri);
  const resize = resizeToLongSide(size, CHAT_PHOTO_MAX_SIDE);
  if (resize) context.resize(resize);
  const image = await context.renderAsync();
  const saved = await image.saveAsync({ format: SaveFormat.JPEG, compress: CHAT_PHOTO_JPEG_QUALITY });
  return saved.uri;
}

/** The library uses the system photo picker, which needs no permission to read the photos. */
export async function pickChatPhoto(source: ChatPhotoSource): Promise<PickedChatPhoto> {
  if (source === 'camera') {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return 'cameraDenied';
  }
  const result = source === 'camera' ? await ImagePicker.launchCameraAsync(PICKER_OPTIONS) : await ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS);
  if (result.canceled) return 'cancelled';
  const [asset] = result.assets;
  return { uri: await toChatJpeg(asset.uri, asset) };
}

/** Uploads through the Storage REST endpoint because the SDK upload reports no progress for the bar. */
export async function uploadChatPhoto(localUri: string, path: string, onProgress: (fraction: number) => void): Promise<void> {
  const { data } = await supabase.auth.getSession();
  const accessToken = data.session?.access_token;
  if (!accessToken) throw new Error('No session to upload the chat photo');

  const task = new UploadTask(new File(localUri), `${SUPABASE_URL}/storage/v1/object/${CHAT_IMAGES_BUCKET}/${path}`, {
    httpMethod: 'POST',
    uploadType: UploadType.BINARY_CONTENT,
    mimeType: CHAT_PHOTO_MIME_TYPE,
    headers: { Authorization: `Bearer ${accessToken}`, apikey: SUPABASE_ANON_KEY, 'Content-Type': CHAT_PHOTO_MIME_TYPE },
    sessionType: 'foreground',
    onProgress: ({ bytesSent, totalBytes }) => onProgress(uploadFraction(bytesSent, totalBytes)),
  });
  try {
    const result = await task.uploadAsync();
    // A retry after a lost response finds the file already stored under the same path.
    const alreadyStored = result.body.includes(DUPLICATE_OBJECT);
    if (result.status >= HTTP_MULTIPLE_CHOICES && !alreadyStored) throw new Error(`Chat photo upload failed (${result.status}): ${result.body}`);
  } finally {
    task.release();
  }
}

export async function fetchChatPhotoUrl(path: string): Promise<string> {
  const { data, error } = await supabase.storage.from(CHAT_IMAGES_BUCKET).createSignedUrl(path, SIGNED_URL_EXPIRY_SECONDS);
  if (error) throw new Error(error.message);
  return data.signedUrl;
}

export function newChatPhotoId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
}

import * as ImagePicker from 'expo-image-picker';

import { SIGNED_URL_EXPIRY_SECONDS } from '@/constants/cache';
import { CHAT_PHOTO_JPEG_QUALITY, CHAT_PHOTO_MAX_SIDE, CHAT_PHOTO_MIME_TYPE } from '@/constants/chat';
import { CHAT_IMAGES_BUCKET } from '@/constants/storage';

import { reencodeAsJpeg } from './image-encoding';
import { uploadWithProgress } from './storage-upload';
import { supabase } from './supabase';

export type ChatPhotoSource = 'camera' | 'library';
export type PickedChatPhoto = { uri: string } | 'cancelled' | 'cameraDenied';

const PICKER_OPTIONS: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], exif: false, quality: 1 };

/** The library uses the system photo picker, which needs no permission to read the photos. */
export async function pickChatPhoto(source: ChatPhotoSource): Promise<PickedChatPhoto> {
  if (source === 'camera') {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return 'cameraDenied';
  }
  const result = source === 'camera' ? await ImagePicker.launchCameraAsync(PICKER_OPTIONS) : await ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS);
  if (result.canceled) return 'cancelled';
  const [asset] = result.assets;
  return { uri: await reencodeAsJpeg(asset.uri, asset, CHAT_PHOTO_MAX_SIDE, CHAT_PHOTO_JPEG_QUALITY) };
}

export async function uploadChatPhoto(localUri: string, path: string, onProgress: (fraction: number) => void): Promise<void> {
  await uploadWithProgress({ bucket: CHAT_IMAGES_BUCKET, path, localUri, mimeType: CHAT_PHOTO_MIME_TYPE, onProgress });
}

export async function fetchChatPhotoUrl(path: string): Promise<string> {
  const { data, error } = await supabase.storage.from(CHAT_IMAGES_BUCKET).createSignedUrl(path, SIGNED_URL_EXPIRY_SECONDS);
  if (error) throw new Error(error.message);
  return data.signedUrl;
}

export function newChatPhotoId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
}

import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

import { resizeToLongSide, type ImageSize } from '@/lib/chat-photo';

// Re-encoding as JPEG drops the EXIF data, so the photo's location never leaves the phone.
export async function reencodeAsJpeg(uri: string, size: ImageSize, maxSide: number, quality: number): Promise<string> {
  const context = ImageManipulator.manipulate(uri);
  const resize = resizeToLongSide(size, maxSide);
  if (resize) context.resize(resize);
  const image = await context.renderAsync();
  const saved = await image.saveAsync({ format: SaveFormat.JPEG, compress: quality });
  return saved.uri;
}

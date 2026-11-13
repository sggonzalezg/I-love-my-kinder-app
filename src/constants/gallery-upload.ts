export const MAX_VIDEO_SECONDS = 90;

export const GALLERY_PHOTO_MAX_SIDE = 1600;
export const GALLERY_JPEG_QUALITY = 0.8;
export const GALLERY_PHOTO_MIME_TYPE = 'image/jpeg';
export const GALLERY_VIDEO_MIME_TYPE = 'video/mp4';
export const GALLERY_PHOTO_EXTENSION = 'jpg';
export const GALLERY_VIDEO_EXTENSION = 'mp4';
export const GALLERY_COVER_SUFFIX = '-cover';

// 720p: the long side of a 16:9 video at 1280 px, at about 2.5 Mbps (SDD risk 4).
export const VIDEO_MAX_SIDE = 1280;
export const VIDEO_BITRATE = 2_500_000;

export const MILLISECONDS_PER_SECOND = 1000;

export const UPLOAD_QUEUE_STORAGE_KEY = 'gallery-upload-queue';
export const UPLOAD_FILES_FOLDER = 'gallery-uploads';
export const UPLOAD_RETRY_MS = 30_000;
// "Subida" stays on screen a moment after the last file finishes, then the queue empties.
export const UPLOADED_LINGER_MS = 4_000;

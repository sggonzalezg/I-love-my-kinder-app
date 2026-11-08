import type { Href } from 'expo-router';

export const CHAT_LIST_ROUTE = '/chat' as Href;

export const CHAT_BODY_MAX_LENGTH = 2000;

// shortcut: only the newest messages load, with no "load older"; add paging when a room chat outgrows it.
export const CHAT_MESSAGE_LIMIT = 200;

export const POSTGRES_UNIQUE_VIOLATION = '23505';

export const CHAT_PHOTO_MAX_SIDE = 1600;
export const CHAT_PHOTO_JPEG_QUALITY = 0.8;
export const CHAT_PHOTO_MIME_TYPE = 'image/jpeg';

export const PHOTO_MAX_ZOOM = 4;

import type { Href } from 'expo-router';

export const NOTICES_ROUTE = '/notices' as Href;

export function childFileHref(childId: string): Href {
  return `/child/${encodeURIComponent(childId)}` as Href;
}

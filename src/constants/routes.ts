import type { Href } from 'expo-router';

export const LOGIN_ROUTE = '/phone' as Href;
export const NOTICES_ROUTE = '/notices' as Href;
export const DELETE_ACCOUNT_ROUTE = '/delete-account' as Href;

export function childFileHref(childId: string): Href {
  return `/child/${encodeURIComponent(childId)}` as Href;
}

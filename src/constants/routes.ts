import type { Href } from 'expo-router';

export const NOTICES_ROUTE = '/notices' as Href;
export const DELETE_ACCOUNT_ROUTE = '/delete-account' as Href;

export function childFileHref(childId: string): Href {
  return `/child/${encodeURIComponent(childId)}` as Href;
}
export const CALENDAR_TAB_ROUTE = '/calendar' as Href;
export const GALLERY_TAB_ROUTE = '/gallery' as Href;

export function childDayHref(childId: string): Href {
  return `/day/${encodeURIComponent(childId)}` as Href;
}

export function eventHref(eventId: string): Href {
  return `/event/${encodeURIComponent(eventId)}` as Href;
}

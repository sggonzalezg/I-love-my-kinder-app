import type { Href } from 'expo-router';

import { chatThreadHref } from '@/constants/chat';
import { ROOM_TAB_ROUTE, childDayHref, eventHref, noticeHref, outingPermissionHref } from '@/constants/routes';

type PushData = Record<string, unknown>;

function stringField(pushData: PushData, field: string): string | null {
  const value = pushData[field];
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function hrefFromField(pushData: PushData, field: string, toHref: (id: string) => Href): Href | null {
  const id = stringField(pushData, field);
  return id ? toHref(id) : null;
}

/** The `screen` values and id keys are the ones backend writes in `push_notifications.data`. */
const HREF_BY_PUSH_SCREEN: Record<string, (pushData: PushData) => Href | null> = {
  announcements: (pushData) => hrefFromField(pushData, 'id', noticeHref),
  events: (pushData) => hrefFromField(pushData, 'id', eventHref),
  today: (pushData) => hrefFromField(pushData, 'child_id', childDayHref),
  chat: (pushData) => hrefFromField(pushData, 'thread_id', chatThreadHref),
  child: () => ROOM_TAB_ROUTE,
  outing: (pushData) => hrefFromField(pushData, 'eventId', outingPermissionHref),
};

export function pushDataToHref(pushData: unknown): Href | null {
  if (!pushData || typeof pushData !== 'object') return null;
  const screen = stringField(pushData as PushData, 'screen');
  const toHref = screen ? HREF_BY_PUSH_SCREEN[screen] : undefined;
  return toHref ? toHref(pushData as PushData) : null;
}

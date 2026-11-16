import type { Href } from 'expo-router';

import type { PersonKind } from '@/lib/child-people';

export const LOGIN_ROUTE = '/sign-in' as Href;
export const LOGIN_CONSENT_ROUTE = '/consent' as Href;
export const ACCOUNT_DEACTIVATED_ROUTE = '/inactive' as Href;

/** `waiting` opens the code screen on "Esperá un momento" when Supabase refused the send for its rate limits. */
export function emailCodeHref(email: string, waiting = false): Href {
  return { pathname: '/code', params: waiting ? { email, waiting: '1' } : { email } } as Href;
}

export function accountNotEnabledHref(email: string): Href {
  return { pathname: '/not-enabled', params: { email } } as Href;
}
export const PUSH_PRIMER_ROUTE = '/push' as Href;
export const FIRST_SIGN_IN_AUTHORIZATIONS_ROUTE = '/first-authorizations' as Href;
export const NOTICES_ROUTE = '/notices' as Href;
export const DELETE_ACCOUNT_ROUTE = '/delete-account' as Href;
export const CALENDAR_ROUTE = '/calendar' as Href;
export const SETTINGS_ROUTE = '/settings' as Href;

export function noticeHref(noticeId: string): Href {
  return `/notices/${encodeURIComponent(noticeId)}` as Href;
}

export function childFileHref(childId: string): Href {
  return `/child/${encodeURIComponent(childId)}` as Href;
}
export function directorChildHref(childId: string): Href {
  return `/director-child/${encodeURIComponent(childId)}` as Href;
}

export function roomGroupHref(roomId: string, shiftId: string): Href {
  return `/room-group/${encodeURIComponent(roomId)}/${encodeURIComponent(shiftId)}` as Href;
}

export const NEW_ROOM_ROUTE = '/room-form' as Href;
export const NEW_CHILD_ROUTE = '/child-form' as Href;

export function editRoomHref(roomId: string, name: string, age: string | null): Href {
  return { pathname: '/room-form', params: { id: roomId, name, age: age ?? '' } } as Href;
}

/** Without `personId` the form adds a new person; the cédula is read by id, never passed here. */
export function childPersonFormHref(childId: string, kind: PersonKind, personId?: string): Href {
  return { pathname: '/child-person-form', params: personId ? { childId, kind, personId } : { childId, kind } } as Href;
}

/** Without `enrollmentId` the form enrolls the child in another group; with it, it changes that group. */
export function childGroupFormHref(childId: string, enrollmentId?: string): Href {
  return { pathname: '/child-group-form', params: enrollmentId ? { childId, enrollmentId } : { childId } } as Href;
}

export const CALENDAR_TAB_ROUTE = '/calendar' as Href;
export const GALLERY_TAB_ROUTE = '/gallery' as Href;

export const AUTHORIZATIONS_FROM_TODAY = 'today';

/** From Hoy's reminder card, F3 opens on the first unanswered authorization and its back button says "Volver a Hoy". */
export function childAuthorizationsHref(childId: string, childFirstName: string, reminderFocus?: string): Href {
  const params = { childId, name: childFirstName };
  return { pathname: '/authorizations/[childId]', params: reminderFocus ? { ...params, focus: reminderFocus, from: AUTHORIZATIONS_FROM_TODAY } : params } as Href;
}

export function childDayHref(childId: string): Href {
  return `/day/${encodeURIComponent(childId)}` as Href;
}

export function eventHref(eventId: string): Href {
  return `/event/${encodeURIComponent(eventId)}` as Href;
}

export const ROOM_TAB_ROUTE = '/room' as Href;

export function outingPermissionHref(eventId: string): Href {
  return `/permission/${encodeURIComponent(eventId)}` as Href;
}

export function outingPermissionsHref(eventId: string): Href {
  return `/outing-permissions/${encodeURIComponent(eventId)}` as Href;
}

/** `newDay` (YYYY-MM-DD) makes that day's dot pop after a save. */
export function calendarWithToastHref(toast: string, newDay?: string): Href {
  return { pathname: '/calendar', params: newDay ? { toast, newDay } : { toast } } as Href;
}

export const NEW_EVENT_ROUTE = '/event/form' as Href;

export function editEventHref(eventId: string): Href {
  return { pathname: '/event/form', params: { id: eventId } } as Href;
}

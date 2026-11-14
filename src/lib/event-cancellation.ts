import type { Event } from './calendar';
import type { Role } from './role';

export type EventStaffAction = 'delete' | 'askDirection' | 'none';

/** Who hears about a cancelled event, from the group's roster (families counted as its children, as the chat). */
export interface EventReach {
  familyCount: number;
  otherTeachers: string[];
}

/** cancel_event refuses a longer reason. */
export const CANCELLATION_REASON_MAX_LENGTH = 500;

const DELETED = 'Evento borrado.';
const SEPARATOR = ' · ';

/** Mirrors the events_delete policy: the creator or the direction. */
export function eventStaffAction(role: Role, isOwnEvent: boolean): EventStaffAction {
  if (role === 'director' || (role === 'teacher' && isOwnEvent)) return 'delete';
  return role === 'teacher' ? 'askDirection' : 'none';
}

function familiesLabel(count: number): string {
  return count === 1 ? '1 familia' : `${count} familias`;
}

function joinNames(names: string[]): string {
  return names.length > 1 ? `${names.slice(0, -1).join(', ')} y ${names[names.length - 1]}` : names.join('');
}

function audienceScope({ audience, room_id }: Pick<Event, 'audience' | 'room_id'>): string {
  return room_id ? audience : 'todo el jardín';
}

export function notifiedLines(event: Pick<Event, 'audience' | 'room_id'>, reach: EventReach | null): string[] {
  if (!reach) {
    const scope = audienceScope(event);
    return [`Las familias de ${scope}`, `Las maestras de ${scope}`];
  }
  const lines = [`${familiesLabel(reach.familyCount)} de ${event.audience}`];
  if (reach.otherTeachers.length === 1) lines.push(`${reach.otherTeachers[0]}, que también es de la sala`);
  if (reach.otherTeachers.length > 1) lines.push(`${joinNames(reach.otherTeachers)}, que también son de la sala`);
  return lines;
}

/** A past event is deleted quietly (the backend trigger notifies only events not over). */
export function deletedEventToast(hasEnded: boolean, reach: EventReach | null): string {
  if (hasEnded) return DELETED;
  if (!reach) return `${DELETED} Les avisamos a las familias y a las maestras.`;
  const teachers = reach.otherTeachers.length > 0 ? ` y a ${joinNames(reach.otherTeachers)}` : '';
  return `${DELETED} Les avisamos a ${familiesLabel(reach.familyCount)}${teachers}.`;
}

export function factsAuthorLine(authorLine: string | undefined, familyCount: number | null): string | undefined {
  const parts = [authorLine, familyCount === null ? undefined : familiesLabel(familyCount)].filter(Boolean);
  return parts.length > 0 ? parts.join(SEPARATOR) : undefined;
}

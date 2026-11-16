import type { AuthorizationKey } from './authorizations';
import { signedAuthorizations, type AuthorizationAnswer, type ChildConsentRecord, type Guardian } from './child-authorizations';
import { countLabel, initials } from './format';
import { foldForSearch } from './search';
import { groupLabel, type ShiftName } from './shift';

export const ALL_ROOMS = 'all';

const SHIFT_ORDER: ShiftName[] = ['morning', 'afternoon'];
const NAME_COLLATOR = new Intl.Collator('es', { numeric: true });

export interface DirectorChildRow {
  id: string;
  firstName: string;
  lastName: string | null;
  photoPath: string | null;
}

export interface ChildEnrollment {
  childId: string;
  roomId: string;
  roomName: string;
  shift: ShiftName;
  endedAt: string | null;
}

export interface ChildAuthorizationRecord extends ChildConsentRecord {
  childId: string;
}

export interface ChildGuardian extends Guardian {
  childId: string;
}

export interface DirectorRoomOption {
  id: string;
  name: string;
}

export interface DirectorChildrenInput {
  children: DirectorChildRow[];
  enrollments: ChildEnrollment[];
  authorizations: ChildAuthorizationRecord[];
  guardians: ChildGuardian[];
  rooms: DirectorRoomOption[];
}

export type ChildStatus = { kind: 'active' } | { kind: 'leaving'; on: string } | { kind: 'left'; on: string };

export interface ChildAuthorizationMark {
  key: AuthorizationKey;
  state: AuthorizationAnswer;
}

export interface DirectorChildEntry {
  id: string;
  name: string;
  initials: string;
  photoPath: string | null;
  groups: { roomId: string; label: string }[];
  authorizations: ChildAuthorizationMark[];
  status: ChildStatus;
}

function isOpen(enrollment: ChildEnrollment, now: Date): boolean {
  return !enrollment.endedAt || new Date(enrollment.endedAt) > now;
}

/** Same rule as the panel W3: an open enrollment with an end date means the child is leaving on that day. */
export function childStatus(enrollments: ChildEnrollment[], now: Date): ChildStatus {
  const open = enrollments.filter((enrollment) => isOpen(enrollment, now));
  if (open.some((enrollment) => !enrollment.endedAt)) return { kind: 'active' };
  const lastEnd = enrollments
    .flatMap((enrollment) => (enrollment.endedAt ? [enrollment.endedAt] : []))
    .sort()
    .at(-1);
  if (!lastEnd) return { kind: 'active' };
  return open.length > 0 ? { kind: 'leaving', on: lastEnd } : { kind: 'left', on: lastEnd };
}

function dayMonth(iso: string): string {
  const date = new Date(iso);
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function childStatusLabel(status: ChildStatus): string | null {
  if (status.kind === 'leaving') return `Baja el ${dayMonth(status.on)}`;
  if (status.kind === 'left') return `De baja desde el ${dayMonth(status.on)}`;
  return null;
}

function openGroups(enrollments: ChildEnrollment[], now: Date): DirectorChildEntry['groups'] {
  return enrollments
    .filter((enrollment) => isOpen(enrollment, now))
    .sort((first, second) => NAME_COLLATOR.compare(first.roomName, second.roomName) || SHIFT_ORDER.indexOf(first.shift) - SHIFT_ORDER.indexOf(second.shift))
    .map((enrollment) => ({ roomId: enrollment.roomId, label: groupLabel(enrollment.roomName, enrollment.shift) }));
}

function authorizationMarks(records: ChildAuthorizationRecord[], guardians: ChildGuardian[]): ChildAuthorizationMark[] {
  return signedAuthorizations(records, guardians).map(({ key, state }) => ({ key, state }));
}

export function buildChildEntries({ children, enrollments, authorizations, guardians }: DirectorChildrenInput, now: Date): DirectorChildEntry[] {
  return children
    .map((child) => {
      const childEnrollments = enrollments.filter((enrollment) => enrollment.childId === child.id);
      return {
        id: child.id,
        name: [child.firstName, child.lastName].filter(Boolean).join(' '),
        initials: initials(child.firstName, child.lastName ?? ''),
        photoPath: child.photoPath,
        groups: openGroups(childEnrollments, now),
        authorizations: authorizationMarks(
          authorizations.filter((record) => record.childId === child.id),
          guardians.filter((guardian) => guardian.childId === child.id),
        ),
        status: childStatus(childEnrollments, now),
      };
    })
    .sort((first, second) => NAME_COLLATOR.compare(first.name, second.name));
}

export function filterChildren(entries: DirectorChildEntry[], query: string, roomId: string): DirectorChildEntry[] {
  const needle = foldForSearch(query.trim());
  return entries.filter(
    (entry) => (roomId === ALL_ROOMS || entry.groups.some((group) => group.roomId === roomId)) && foldForSearch(entry.name).includes(needle),
  );
}

export function activeChildrenLabel(entries: DirectorChildEntry[]): string {
  return countLabel(entries.filter((entry) => entry.status.kind !== 'left').length, 'activo', 'activos');
}

/** "Todas" first, then the rooms in numeric order (Sala 2 before Sala 10). */
export function roomFilterOptions(rooms: DirectorRoomOption[], allLabel: string): { value: string; label: string }[] {
  const byName = [...rooms].sort((first, second) => NAME_COLLATOR.compare(first.name, second.name));
  return [{ value: ALL_ROOMS, label: allLabel }, ...byName.map((room) => ({ value: room.id, label: room.name }))];
}

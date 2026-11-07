import { NURSERY_REQUEST_LINE, WALKING_CLAUSE, WALKING_TRANSPORTS } from '@/constants/outing';
import { formatTime, MONTHS, WEEKDAYS } from './dates';
import { permissionStatus, type OutingAnswer, type OutingDecision, type PermissionStatus } from './outing';

export type Answerer = 'me' | 'other' | null;

export interface OutingSchedule {
  startsAt: string;
  permissionVersion: number;
}

export interface ChildPermission {
  status: PermissionStatus;
  answer: OutingAnswer | null;
  answeredBy: Answerer;
  locked: boolean;
  askedAgain: boolean;
}

export interface HistoryEntry {
  at: string;
  text: string;
}

export interface AudienceGroup {
  roomId: string;
  shiftId: string;
}

export interface OutingAudience {
  roomId: string | null;
  shiftId: string | null;
}

export interface FamilyOuting extends OutingSchedule {
  childIds: string[];
}

export function hasStarted(startsAt: string, now: Date): boolean {
  return now.getTime() >= new Date(startsAt).getTime();
}

/** The permission belongs to the child: any guardian's latest answer to the current version settles it for all of them. */
export function childPermission(rows: OutingAnswer[], childId: string, outing: OutingSchedule, userId: string, now: Date): ChildPermission {
  const { status, answer } = permissionStatus(rows, childId, outing.permissionVersion);
  const answeredBy: Answerer = answer ? (answer.signed_by === userId ? 'me' : 'other') : null;
  const answeredOlderVersion = rows.some(
    (candidate) => candidate.child_id === childId && candidate.decision !== 'pending' && candidate.permission_version < outing.permissionVersion,
  );
  return { status, answer, answeredBy, locked: hasStarted(outing.startsAt, now), askedAgain: !answer && answeredOlderVersion };
}

const DECISION_VERBS: Record<Exclude<OutingDecision, 'pending'>, string> = {
  authorized: 'autorizó',
  declined: 'no autorizó',
  withdrawn: 'retiró la autorización',
};

export function permissionHistory(rows: OutingAnswer[], childId: string): HistoryEntry[] {
  return rows
    .filter((candidate) => candidate.child_id === childId)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .map((entry) => ({
      at: entry.created_at,
      text: entry.decision === 'pending' ? NURSERY_REQUEST_LINE : `${entry.signer_name} ${DECISION_VERBS[entry.decision]}`,
    }));
}

export function transportClause(transport: string): string {
  const normalized = transport.trim().toLowerCase();
  return WALKING_TRANSPORTS.includes(normalized) ? WALKING_CLAUSE : `en ${normalized}`;
}

const dayAndMonth = (date: Date) => `${date.getDate()}/${date.getMonth() + 1}`;
const weekday = (date: Date) => WEEKDAYS[date.getDay()].toLowerCase();

export function formatOutingDay(iso: string): string {
  const date = new Date(iso);
  return `${weekday(date)} ${date.getDate()} de ${MONTHS[date.getMonth()]}`;
}

export function formatOutingShortDay(iso: string): string {
  const date = new Date(iso);
  return `${weekday(date)} ${date.getDate()}`;
}

export function formatAnswerDay(iso: string): string {
  const date = new Date(iso);
  return `${weekday(date)} ${dayAndMonth(date)}`;
}

export function formatHistoryMoment(iso: string): string {
  const date = new Date(iso);
  return `${dayAndMonth(date)} ${formatTime(date)}`;
}

export function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? fullName;
}

function joinNames(names: string[]): string {
  if (names.length <= 1) return names.join('');
  return `${names.slice(0, -1).join(', ')} y ${names[names.length - 1]}`;
}

export function pendingRequestLine(title: string, startsAt: string, childNames: string[]): string {
  return `${title} · ${formatOutingShortDay(startsAt)} · ${joinNames(childNames)}`;
}

export function isInOutingAudience(child: { groups: AudienceGroup[] }, outing: OutingAudience): boolean {
  return child.groups.some(
    (group) => (outing.roomId === null || group.roomId === outing.roomId) && (outing.shiftId === null || group.shiftId === outing.shiftId),
  );
}

export function familyOutingStatus(outing: FamilyOuting, rows: OutingAnswer[]): PermissionStatus {
  const statuses = outing.childIds.map((childId) => permissionStatus(rows, childId, outing.permissionVersion).status);
  if (statuses.includes('pending')) return 'pending';
  return statuses.every((status) => status === 'authorized') ? 'authorized' : 'declined';
}

export interface OutingSummary extends OutingSchedule, OutingAudience {
  id: string;
  title: string;
}

export interface AudienceChild {
  id: string;
  firstName: string;
  groups: AudienceGroup[];
}

export interface FamilyOutingRequest {
  eventId: string;
  title: string;
  startsAt: string;
  status: PermissionStatus;
  pendingChildNames: string[];
}

/** One entry per upcoming outing that includes at least one of the family's children. */
export function familyOutingRequests(
  outings: OutingSummary[],
  children: AudienceChild[],
  rowsByEvent: Record<string, OutingAnswer[]>,
): FamilyOutingRequest[] {
  return outings.flatMap((outing) => {
    const invited = children.filter((child) => isInOutingAudience(child, outing));
    if (invited.length === 0) return [];
    const outingRows = rowsByEvent[outing.id] ?? [];
    const pendingChildNames = invited
      .filter((child) => permissionStatus(outingRows, child.id, outing.permissionVersion).status === 'pending')
      .map((child) => child.firstName);
    const childIds = invited.map((child) => child.id);
    return [
      {
        eventId: outing.id,
        title: outing.title,
        startsAt: outing.startsAt,
        status: familyOutingStatus({ ...outing, childIds }, outingRows),
        pendingChildNames,
      },
    ];
  });
}

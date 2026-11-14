import { OUTING_DAY_START_HOUR } from '@/constants/outing';

import { formatTime, sameDay, WEEKDAYS_SHORT } from './dates';
import { relationshipWord } from './format';
import { permissionStatus, type OutingAnswer, type OutingDecision } from './outing';
import { firstName } from './outing-permission';

export type PermissionRowStatus = Exclude<OutingDecision, 'pending'> | 'pending';
export type PermissionFilter = 'all' | 'pending' | 'declined' | 'authorized';

export interface PermissionChild {
  id: string;
  firstName: string;
  lastName: string;
  photoPath: string | null;
}

export interface ChildPermissionRow {
  child: PermissionChild;
  status: PermissionRowStatus;
  meta: string | null;
  answeredAt: string | null;
}

const SEPARATOR = ' · ';

const STATUS_ORDER: Record<PermissionRowStatus, number> = { declined: 0, withdrawn: 0, authorized: 1, pending: 2 };

const FILTER_STATUSES: Record<Exclude<PermissionFilter, 'all'>, PermissionRowStatus[]> = {
  pending: ['pending'],
  declined: ['declined', 'withdrawn'],
  authorized: ['authorized'],
};

const FILTER_LABELS: Record<PermissionFilter, string> = {
  all: 'Todos',
  pending: 'Sin responder',
  declined: 'No autorizan',
  authorized: 'Autorizaron',
};

const FILTER_ORDER: PermissionFilter[] = ['all', 'pending', 'declined', 'authorized'];

const shortWeekday = (date: Date) => WEEKDAYS_SHORT[date.getDay()].toLowerCase();
const dayAndMonth = (date: Date) => `${date.getDate()}/${date.getMonth() + 1}`;

function answerMoment(iso: string, withWeekday: boolean): string {
  const date = new Date(iso);
  const day = withWeekday ? `${shortWeekday(date)} ${dayAndMonth(date)}` : dayAndMonth(date);
  return `${day} ${formatTime(date)}`;
}

function answerMeta(answer: OutingAnswer, withWeekday: boolean): string {
  const signer = `${firstName(answer.signer_name)} (${relationshipWord(answer.signer_relationship)})`;
  const who = answer.decision === 'withdrawn' ? `Retiró ${signer}` : signer;
  return `${who}${SEPARATOR}${answerMoment(answer.created_at, withWeekday)}`;
}

function requestMeta(answers: OutingAnswer[], childId: string): string | null {
  const latestRequest = answers
    .filter((row) => row.child_id === childId && row.decision === 'pending')
    .sort((a, b) => b.created_at.localeCompare(a.created_at))[0];
  return latestRequest ? `Pedido el ${dayAndMonth(new Date(latestRequest.created_at))}` : null;
}

function compareRows(a: ChildPermissionRow, b: ChildPermissionRow): number {
  const byStatus = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
  if (byStatus !== 0) return byStatus;
  if (a.answeredAt && b.answeredAt) return a.answeredAt.localeCompare(b.answeredAt);
  return `${a.child.firstName} ${a.child.lastName}`.localeCompare(`${b.child.firstName} ${b.child.lastName}`, 'es');
}

/** One row per child: the permission belongs to the child, so any guardian's latest answer to the current version settles it. */
export function childPermissionRows(
  answers: OutingAnswer[],
  children: PermissionChild[],
  version: number,
  { withWeekday = true }: { withWeekday?: boolean } = {},
): ChildPermissionRow[] {
  return children
    .map((child) => {
      const { answer } = permissionStatus(answers, child.id, version);
      if (!answer) return { child, status: 'pending' as const, meta: requestMeta(answers, child.id), answeredAt: null };
      return { child, status: answer.decision as PermissionRowStatus, meta: answerMeta(answer, withWeekday), answeredAt: answer.created_at };
    })
    .sort(compareRows);
}

export function rowsForFilter(rows: ChildPermissionRow[], filter: PermissionFilter): ChildPermissionRow[] {
  if (filter === 'all') return rows;
  return rows.filter((row) => FILTER_STATUSES[filter].includes(row.status));
}

export function permissionTally(rows: ChildPermissionRow[]) {
  return {
    authorized: rowsForFilter(rows, 'authorized').length,
    declined: rowsForFilter(rows, 'declined').length,
    pending: rowsForFilter(rows, 'pending').length,
  };
}

export function permissionFilterChips(rows: ChildPermissionRow[]): { key: PermissionFilter; label: string }[] {
  return FILTER_ORDER.map((key) => ({ key, label: `${FILTER_LABELS[key]} ${rowsForFilter(rows, key).length}` }));
}

export function initialPermissionFilter(rows: ChildPermissionRow[]): PermissionFilter {
  return rows.some((row) => row.status === 'pending') ? 'pending' : 'all';
}

export function permissionsSubtitle(title: string, startsAt: string): string {
  const start = new Date(startsAt);
  return [title, `${shortWeekday(start)} ${start.getDate()}`, formatTime(start)].join(SEPARATOR);
}

/** From 7:00 of the outing's day the screen leads with who cannot go, because that morning the teacher sorts the children. */
export function isOutingDay(startsAt: string, now: Date): boolean {
  return sameDay(new Date(startsAt), now) && now.getHours() >= OUTING_DAY_START_HOUR;
}

export function outingDaySubtitle(startsAt: string, endsAt: string): string {
  return ['Hoy', `salen ${formatTime(new Date(startsAt))}`, `vuelven ${formatTime(new Date(endsAt))}`].join(SEPARATOR);
}

export function stayingNames(rows: ChildPermissionRow[]): string[] {
  return rows.filter((row) => row.status !== 'authorized').map((row) => `${row.child.firstName} ${row.child.lastName}`.trim());
}

export function noGoTitle(count: number): string {
  return count === 1 ? '1 niño no sale' : `${count} niños no salen`;
}

export function goingHeading(count: number): string {
  return `Salen (${count})`;
}

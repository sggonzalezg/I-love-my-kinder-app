import { formatDbTime } from './dates';
import { formDayLabel, type EventFormValues } from './event-form';
import { summarizePermissions, type OutingAnswer } from './outing';
import { isOuting, transportValue, type TransportFields } from './outing-fields';

function transportLabel(values: TransportFields): string {
  return transportValue(values) ?? '';
}

const PERMISSION_FIELDS: { describe: (values: EventFormValues) => string; what: string }[] = [
  { what: 'el día', describe: (values) => (values.date ? formDayLabel(values.date) : '') },
  { what: 'la hora de salida', describe: (values) => formatDbTime(values.startTime) },
  { what: 'la hora de vuelta', describe: (values) => formatDbTime(values.endTime) },
  { what: 'a dónde van', describe: (values) => values.place.trim() },
  { what: 'cómo van', describe: transportLabel },
];

/** Families signed for a day, times, place and transport; changing any of them voids the answers (design.md flow 11). */
export function permissionChangeLine(initial: EventFormValues, current: EventFormValues): string | null {
  if (!isOuting(initial) || !isOuting(current)) return null;
  const changed = PERMISSION_FIELDS.find((field) => field.describe(initial) !== field.describe(current));
  return changed ? `Cambiaste ${changed.what} (${changed.describe(initial)} → ${changed.describe(current)}).` : null;
}

export function permissionVersionAfterEdit(currentVersion: number, initial: EventFormValues, current: EventFormValues): number {
  return permissionChangeLine(initial, current) === null ? currentVersion : currentVersion + 1;
}

export interface OutingAnswerCounts {
  authorizedCount: number;
  childCount: number;
}

/** The trigger records one pending row per child of the audience, so the rows name every child asked. */
export function outingAnswerCounts(rows: OutingAnswer[], version: number): OutingAnswerCounts {
  const childIds = [...new Set(rows.map((row) => row.child_id))];
  return { authorizedCount: summarizePermissions(rows, childIds, version).authorized, childCount: childIds.length };
}

function childrenLabel(count: number): string {
  return count === 1 ? '1 niño' : `${count} niños`;
}

export function resignLine(authorizedCount: number, childCount: number): string {
  const voided =
    authorizedCount === 1 ? 'La autorización de ahora queda sin efecto' : `Las ${authorizedCount} autorizaciones de ahora quedan sin efecto`;
  const children = childCount === 1 ? childrenLabel(childCount) : `los ${childrenLabel(childCount)}`;
  return `${voided} y pedimos permiso de nuevo por ${children}.`;
}

const ONE_SIGNATURE_IS_ENOUGH = '(con la firma de un adulto a cargo alcanza). Sin permiso firmado, el niño no sale.';

export function outingBannerText(childCount: number | null): string {
  const whom = childCount === null ? 'cada niño' : `cada uno de los ${childrenLabel(childCount)}`;
  return `Al guardar, pedimos permiso por ${whom} ${ONE_SIGNATURE_IS_ENOUGH}`;
}

export function askPermissionCaption(childCount: number | null): string {
  return childCount === null ? 'Siempre en las salidas' : `${childrenLabel(childCount)} · siempre en las salidas`;
}

export function savedOutingToast(childCount: number | null): string {
  return `Salida guardada. Pedimos permiso por ${childCount === null ? 'cada niño' : childrenLabel(childCount)}.`;
}

import { dayChipLabel, formatLongDate, MONTHS, sameDay } from './dates';
import type { ChildGroup } from './room-groups';
import { groupLabel } from './shift';

export interface GalleryEnrollment extends ChildGroup {
  startedAt: string;
  endedAt: string | null;
}

export interface GalleryChild {
  id: string;
  firstName: string;
  enrollments: GalleryEnrollment[];
}

/** current: a child is in the group now; before: the child moved to another group; withdrawn: the child left the nursery. */
export type GalleryGroupKind = 'current' | 'before' | 'withdrawn';

export interface GalleryGroup extends ChildGroup {
  key: string;
  kind: GalleryGroupKind;
  label: string;
  childId: string;
  childName: string;
  startedAt: string;
  endedAt: string | null;
  locked: boolean;
}

export type GalleryMediaType = 'photo' | 'video';

export interface GalleryMedia {
  id: string;
  type: GalleryMediaType;
  createdAt: string;
  url: string | null;
}

export interface MediaDaySection {
  key: string;
  title: string;
  countLabel: string | null;
  items: GalleryMedia[];
}

const KIND_ORDER: Record<GalleryGroupKind, number> = { current: 0, before: 1, withdrawn: 2 };

type GroupCandidate = Omit<GalleryGroup, 'label' | 'locked'>;

function candidatesOf(child: GalleryChild): GroupCandidate[] {
  const isEnrolled = child.enrollments.some((enrollment) => !enrollment.endedAt);
  return child.enrollments.map(({ startedAt, endedAt, ...group }) => ({
    ...group,
    key: `${group.roomId}:${group.shiftId}`,
    kind: !endedAt ? 'current' : isEnrolled ? 'before' : 'withdrawn',
    childId: child.id,
    childName: child.firstName,
    startedAt,
    endedAt,
  }));
}

// A current group keeps the first child to join (the "desde que" line); an old one keeps the last to leave.
function preferred(existing: GroupCandidate, candidate: GroupCandidate): GroupCandidate {
  if (KIND_ORDER[candidate.kind] !== KIND_ORDER[existing.kind]) {
    return KIND_ORDER[candidate.kind] < KIND_ORDER[existing.kind] ? candidate : existing;
  }
  if (candidate.kind === 'current') return candidate.startedAt < existing.startedAt ? candidate : existing;
  return (candidate.endedAt ?? '') > (existing.endedAt ?? '') ? candidate : existing;
}

function compareGroups(first: GroupCandidate, second: GroupCandidate): number {
  const byKind = KIND_ORDER[first.kind] - KIND_ORDER[second.kind];
  if (byKind !== 0 || first.kind === 'current') return byKind;
  return (second.endedAt ?? '').localeCompare(first.endedAt ?? '');
}

function labelOf(group: GroupCandidate, familyEnrolled: boolean, isChildLastGroup: boolean): string {
  if (group.kind === 'current') return groupLabel(group.roomName, group.shift);
  if (group.kind === 'before') return `${group.roomName} · antes`;
  if (familyEnrolled) return `${group.roomName} · ${group.childName}`;
  return isChildLastGroup ? groupLabel(group.roomName, group.shift) : group.roomName;
}

/** The family's Galería switch: current groups first, then what a moved or withdrawn child received. */
export function galleryGroupsOf(children: GalleryChild[]): GalleryGroup[] {
  const byKey = new Map<string, GroupCandidate>();
  for (const candidate of children.flatMap(candidatesOf)) {
    const existing = byKey.get(candidate.key);
    byKey.set(candidate.key, existing ? preferred(existing, candidate) : candidate);
  }
  const ordered = [...byKey.values()].sort(compareGroups);
  const familyEnrolled = ordered.some((group) => group.kind === 'current');
  const labelledChildren = new Set<string>();

  return ordered.map((group) => {
    const isChildLastGroup = !labelledChildren.has(group.childId);
    labelledChildren.add(group.childId);
    return {
      ...group,
      label: labelOf(group, familyEnrolled, isChildLastGroup),
      locked: group.kind === 'withdrawn' && familyEnrolled,
    };
  });
}

export function isFamilyEnrolled(groups: GalleryGroup[]): boolean {
  return groups.some((group) => group.kind === 'current');
}

function dayMonth(date: Date, withYear: boolean): string {
  const base = `${date.getDate()} de ${MONTHS[date.getMonth()]}`;
  return withYear ? `${base} de ${date.getFullYear()}` : base;
}

function dayMonthFor(iso: string, now: Date): string {
  const date = new Date(iso);
  return dayMonth(date, date.getFullYear() !== now.getFullYear());
}

function dateRange(startIso: string, endIso: string, now: Date): string {
  const start = new Date(startIso);
  const end = new Date(endIso);
  return `${dayMonth(start, start.getFullYear() !== end.getFullYear())} al ${dayMonthFor(endIso, now)}`;
}

export function galleryFooter(group: GalleryGroup, groups: GalleryGroup[], now: Date): string {
  const fullLabel = groupLabel(group.roomName, group.shift);
  if (group.kind === 'current') {
    return `Ves las fotos y videos desde que ${group.childName} está en esta sala (${dayMonthFor(group.startedAt, now)}).`;
  }
  if (group.kind === 'before') {
    return `Lo que recibiste mientras ${group.childName} estuvo en ${fullLabel} (${dateRange(group.startedAt, group.endedAt!, now)}). Sigue acá aunque cambió de sala.`;
  }
  const siblingGroup = groups.find((candidate) => candidate.kind === 'current');
  if (siblingGroup) return `En ${siblingGroup.label}, la de ${siblingGroup.childName}, todo sigue igual.`;
  return `Lo último que recibiste: el día de la baja (${dayMonthFor(group.endedAt!, now)}).`;
}

export function withdrawnBanner(group: GalleryGroup, familyEnrolled: boolean): string | null {
  if (group.kind !== 'withdrawn') return null;
  const what = familyEnrolled ? 'Lo que recibiste de su sala' : 'Lo que recibiste';
  return `${group.childName} ya no está en el jardín. ${what} sigue acá para ver y guardar, hasta que elimines tu cuenta.`;
}

export function joinedToday(group: GalleryGroup, now: Date): boolean {
  return group.kind === 'current' && sameDay(new Date(group.startedAt), now);
}

export function emptyGalleryText(group: GalleryGroup, now: Date): string {
  if (joinedToday(group, now)) {
    return `${group.childName} entró a ${group.label} hoy. Vas a ver las fotos y videos que se suban desde hoy.`;
  }
  return 'Cuando la maestra suba fotos o videos de la sala, los vas a ver acá.';
}

function countOf(count: number, singular: string, plural: string): string | null {
  if (count === 0) return null;
  return `${count} ${count === 1 ? singular : plural}`;
}

export function mediaCountLabel(items: GalleryMedia[]): string {
  const photos = items.filter((item) => item.type === 'photo').length;
  return [countOf(photos, 'foto', 'fotos'), countOf(items.length - photos, 'video', 'videos')]
    .filter((part): part is string => part !== null)
    .join(' · ');
}

function dayTitle(day: Date, now: Date): string {
  const relative = dayChipLabel(day, now);
  if (relative === 'Hoy' || relative === 'Ayer') return relative;
  const long = formatLongDate(day);
  return day.getFullYear() === now.getFullYear() ? long : `${long} de ${day.getFullYear()}`;
}

/** Days as sections, newest first; only the first one carries the photo and video count (design F7a). */
export function mediaDaySections(items: GalleryMedia[], now: Date): MediaDaySection[] {
  const sorted = [...items].sort((first, second) => second.createdAt.localeCompare(first.createdAt));
  const sections: MediaDaySection[] = [];
  for (const item of sorted) {
    const day = new Date(item.createdAt);
    const key = `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`;
    const last = sections[sections.length - 1];
    if (last?.key === key) last.items.push(item);
    else sections.push({ key, title: dayTitle(day, now), countLabel: null, items: [item] });
  }
  return sections.map((section, index) => ({ ...section, countLabel: index === 0 ? mediaCountLabel(section.items) : null }));
}

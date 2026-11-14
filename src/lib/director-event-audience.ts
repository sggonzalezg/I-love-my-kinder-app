import { familiesLabel } from './event-cancellation';
import { audienceKey, type EventAudienceOption } from './event-form';
import type { ChildGroup } from './room-groups';
import { groupLabel, type ShiftName } from './shift';

export type AudienceScope = 'nursery' | 'room' | 'group';

/** A child or a teacher in one open group; the same member repeats once per group. */
export interface AudienceMember extends ChildGroup {
  memberId: string;
}

export interface NurseryAudience {
  children: AudienceMember[];
  teachers: AudienceMember[];
}

export interface AudienceReach {
  familyCount: number;
  teacherCount: number;
}

type AudienceTarget = Pick<EventAudienceOption, 'roomId' | 'shiftId'>;

export const NURSERY_AUDIENCE_LABEL = 'Todo el jardín';
const NURSERY_CAPTION_LABEL = 'todo el jardín';
const REACH_PREFIX = 'Lo ven';
const REACH_JOINER = 'y';
const SHIFT_ORDER: ShiftName[] = ['morning', 'afternoon'];
const ROOM_NAME_COLLATOR = new Intl.Collator('es', { numeric: true });

export const AUDIENCE_SCOPE_OPTIONS: { key: AudienceScope; label: string }[] = [
  { key: 'nursery', label: NURSERY_AUDIENCE_LABEL },
  { key: 'room', label: 'Una sala' },
  { key: 'group', label: 'Sala y turno' },
];

function byRoomThenShift(first: ChildGroup, second: ChildGroup): number {
  return ROOM_NAME_COLLATOR.compare(first.roomName, second.roomName) || SHIFT_ORDER.indexOf(first.shift) - SHIFT_ORDER.indexOf(second.shift);
}

export function directorAudienceOptions(audience: NurseryAudience): EventAudienceOption[] {
  const groupsByKey = new Map<string, ChildGroup>();
  for (const member of [...audience.children, ...audience.teachers]) groupsByKey.set(audienceKey(member.roomId, member.shiftId), member);
  const groups = [...groupsByKey.values()].sort(byRoomThenShift);
  const rooms = new Map(groups.map((group) => [group.roomId, group.roomName]));
  return [
    { key: audienceKey(null, null), roomId: null, shiftId: null, label: NURSERY_AUDIENCE_LABEL },
    ...[...rooms].map(([roomId, roomName]) => ({ key: audienceKey(roomId, null), roomId, shiftId: null, label: roomName })),
    ...groups.map((group) => ({
      key: audienceKey(group.roomId, group.shiftId),
      roomId: group.roomId,
      shiftId: group.shiftId as string | null,
      label: groupLabel(group.roomName, group.shift),
    })),
  ];
}

export function audienceScope(target: AudienceTarget): AudienceScope {
  if (!target.roomId) return 'nursery';
  return target.shiftId ? 'group' : 'room';
}

export function optionsInScope(options: EventAudienceOption[], scope: AudienceScope): EventAudienceOption[] {
  return options.filter((option) => audienceScope(option) === scope);
}

export function firstAudienceKeyOf(options: EventAudienceOption[], scope: AudienceScope): string | null {
  return optionsInScope(options, scope)[0]?.key ?? null;
}

function isInAudience(member: AudienceMember, target: AudienceTarget): boolean {
  return (!target.roomId || member.roomId === target.roomId) && (!target.shiftId || member.shiftId === target.shiftId);
}

function distinctMembersIn(members: AudienceMember[], target: AudienceTarget): number {
  return new Set(members.filter((member) => isInAudience(member, target)).map((member) => member.memberId)).size;
}

/** Families are counted as children, as in every other staff count of the app. */
export function audienceReach(audience: NurseryAudience, target: AudienceTarget): AudienceReach {
  return { familyCount: distinctMembersIn(audience.children, target), teacherCount: distinctMembersIn(audience.teachers, target) };
}

export function teachersLabel(count: number): string {
  return count === 1 ? '1 maestra' : `${count} maestras`;
}

export function audienceReachParts(reach: AudienceReach): { prefix: string; families: string; joiner: string; teachers: string } {
  return { prefix: REACH_PREFIX, families: familiesLabel(reach.familyCount), joiner: REACH_JOINER, teachers: teachersLabel(reach.teacherCount) };
}

export function audienceReachLine(reach: AudienceReach): string {
  const parts = audienceReachParts(reach);
  return `${parts.prefix} ${parts.families} ${parts.joiner} ${parts.teachers}`;
}

export function audienceCaptionLabel(option: Pick<EventAudienceOption, 'roomId' | 'label'>): string {
  return option.roomId ? option.label : NURSERY_CAPTION_LABEL;
}

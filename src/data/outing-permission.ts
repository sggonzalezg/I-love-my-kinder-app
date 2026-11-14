import { OUTING_EVENT_TYPE, OUTING_SCREEN_ID } from '@/constants/outing';
import { OUTING } from '@/legal/texts';
import type { OutingAnswer, OutingDecision } from '@/lib/outing';
import { familyOutingRequests, type AudienceChild, type FamilyOutingRequest, type OutingSummary } from '@/lib/outing-permission';
import { invoke, supabase } from './supabase';
import { throwOnError } from './throw-on-error';

export interface OutingDetails extends OutingSummary {
  endsAt: string;
  location: string | null;
  transport: string | null;
  description: string | null;
}

export interface GuardianChild extends AudienceChild {
  lastName: string;
  relationship: string;
}

export interface Guardian {
  userId: string;
  fullName: string;
  children: GuardianChild[];
}

export interface OutingPermissionData {
  outing: OutingDetails;
  guardian: Guardian;
  answers: OutingAnswer[];
}

interface EventRow {
  id: string;
  title: string;
  starts_at: string;
  ends_at: string;
  location: string | null;
  transport: string | null;
  description: string | null;
  permission_version: number | null;
  room_id: string | null;
  shift_id: string | null;
}

interface GuardianLinkRow {
  relationship: string;
  family_members: { user_id: string; first_name: string; last_name: string } | null;
  children: {
    id: string;
    first_name: string;
    last_name: string;
    enrollments: { room_id: string; shift_id: string; ended_at: string | null }[];
  } | null;
}

const EVENT_COLUMNS = 'id, title, starts_at, ends_at, location, transport, description, permission_version, room_id, shift_id';
const ANSWER_COLUMNS = 'event_id, child_id, decision, created_at, permission_version, signer_name, signer_relationship, signed_by';
export const DEFAULT_PERMISSION_VERSION = 1;

function toOutingDetails(row: EventRow): OutingDetails {
  return {
    id: row.id,
    title: row.title,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    location: row.location,
    transport: row.transport,
    description: row.description,
    permissionVersion: row.permission_version ?? DEFAULT_PERMISSION_VERSION,
    roomId: row.room_id,
    shiftId: row.shift_id,
  };
}

async function fetchGuardian(userId: string): Promise<Guardian> {
  const links = throwOnError<GuardianLinkRow[]>(
    await supabase
      .from('family_member_children')
      .select('relationship, family_members!inner(user_id, first_name, last_name), children(id, first_name, last_name, enrollments(room_id, shift_id, ended_at))')
      .eq('family_members.user_id', userId),
  );
  const member = links.find((link) => link.family_members)?.family_members;
  return {
    userId,
    fullName: member ? `${member.first_name} ${member.last_name}` : '',
    children: links.flatMap(({ relationship, children: child }) =>
      child
        ? [
            {
              id: child.id,
              firstName: child.first_name,
              lastName: child.last_name,
              relationship,
              groups: child.enrollments
                .filter((enrollment) => !enrollment.ended_at)
                .map((enrollment) => ({ roomId: enrollment.room_id, shiftId: enrollment.shift_id })),
            },
          ]
        : [],
    ),
  };
}

export async function fetchOutingAnswers(eventIds: string[]): Promise<(OutingAnswer & { event_id: string })[]> {
  if (eventIds.length === 0) return [];
  return throwOnError(await supabase.from('outing_authorizations').select(ANSWER_COLUMNS).in('event_id', eventIds));
}

export async function fetchOutingPermission(eventId: string, userId: string): Promise<OutingPermissionData> {
  const [event, guardian, answers] = await Promise.all([
    supabase.from('events').select(EVENT_COLUMNS).eq('id', eventId).single(),
    fetchGuardian(userId),
    fetchOutingAnswers([eventId]),
  ]);
  return { outing: toOutingDetails(throwOnError<EventRow>(event)), guardian, answers };
}

export async function fetchFamilyOutingRequests(userId: string, now: Date): Promise<FamilyOutingRequest[]> {
  const [events, guardian] = await Promise.all([
    supabase.from('events').select(EVENT_COLUMNS).eq('event_type', OUTING_EVENT_TYPE).gt('starts_at', now.toISOString()).order('starts_at'),
    fetchGuardian(userId),
  ]);
  const outings = throwOnError<EventRow[]>(events).map(toOutingDetails);
  const answers = await fetchOutingAnswers(outings.map((outing) => outing.id));
  const answersByEvent: Record<string, OutingAnswer[]> = {};
  for (const answer of answers) (answersByEvent[answer.event_id] ??= []).push(answer);
  return familyOutingRequests(outings, guardian.children, answersByEvent);
}

export interface OutingAnswerInput {
  eventId: string;
  childId: string;
  decision: Exclude<OutingDecision, 'pending'>;
}

// record-consent writes the outing answer to outing_authorizations and takes the signer, IP and time on the server.
export async function answerOuting({ eventId, childId, decision }: OutingAnswerInput): Promise<void> {
  await invoke('record-consent', {
    documentType: OUTING.id,
    documentVersion: Number(OUTING.version),
    eventId,
    childId,
    decision,
    screen: OUTING_SCREEN_ID,
    source: 'app',
  });
}

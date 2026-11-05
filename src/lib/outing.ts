export type OutingDecision = 'authorized' | 'declined' | 'withdrawn';
export type PermissionStatus = 'pending' | 'authorized' | 'declined';

export type OutingAnswer = {
  child_id: string;
  decision: OutingDecision;
  created_at: string;
  permission_version: number;
  signer_name: string;
  signer_relationship: string;
};

/** One answer per child: the latest record of the current version, from any guardian. */
export function permissionStatus(rows: OutingAnswer[], childId: string, version: number) {
  const latest = rows
    .filter((r) => r.child_id === childId && r.permission_version === version)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))[0];
  if (!latest) return { status: 'pending' as PermissionStatus, answer: null };
  const status: PermissionStatus = latest.decision === 'authorized' ? 'authorized' : 'declined';
  return { status, answer: latest };
}

export function summarizePermissions(rows: OutingAnswer[], childIds: string[], version: number) {
  const totals = { authorized: 0, declined: 0, pending: 0 };
  for (const id of childIds) totals[permissionStatus(rows, id, version).status] += 1;
  return totals;
}

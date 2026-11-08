import { noticeNeeded, type NoticeRecord } from '@/lib/consent';

import { invoke, supabase } from './supabase';
import { throwOnError } from './throw-on-error';

export interface ConsentInput {
  documentId: string;
  version: string;
  accepted: boolean;
  screen: string;
  childId?: string;
}

export interface OneTimeNotice {
  id: string;
  version: string;
}

// record-consent compares documentVersion as a number against its legal_documents version.
export async function recordConsent({ documentId, version, accepted, screen, childId }: ConsentInput): Promise<void> {
  await invoke('record-consent', {
    documentType: documentId,
    documentVersion: Number(version),
    accepted,
    screen,
    childId,
    source: 'app',
  });
}

export async function fetchNoticeNeeded(userId: string, notice: OneTimeNotice): Promise<boolean> {
  const records = throwOnError<NoticeRecord[]>(
    await supabase
      .from('consent_records')
      .select('document_version, accepted')
      .eq('user_id', userId)
      .eq('document_type', notice.id)
      .order('created_at', { ascending: false })
      .limit(1),
  );
  return noticeNeeded(records, notice.version);
}

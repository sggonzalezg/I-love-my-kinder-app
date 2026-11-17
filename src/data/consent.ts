import {
  LOGIN_CONSENT_SCREEN_ID,
  LOGIN_DOCUMENT_IDS,
  LOGIN_DOCUMENTS,
  noticeNeeded,
  pendingLoginDocuments,
  type LoginConsentRecord,
  type LoginDocumentKey,
  type NoticeRecord,
  type PendingLoginDocument,
} from '@/lib/consent';

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

export async function recordConsent({ documentId, version, accepted, screen, childId }: ConsentInput): Promise<void> {
  await invoke('record-consent', {
    documentType: documentId,
    documentVersion: version,
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

export async function fetchPendingLoginDocuments(userId: string): Promise<PendingLoginDocument[]> {
  const records = throwOnError<LoginConsentRecord[]>(
    await supabase.from('consent_records').select('document_type, document_version, accepted').eq('user_id', userId).in('document_type', LOGIN_DOCUMENT_IDS),
  );
  return pendingLoginDocuments(records ?? []);
}

export async function acceptLoginDocument(key: LoginDocumentKey): Promise<void> {
  const document = LOGIN_DOCUMENTS[key];
  await recordConsent({ documentId: document.id, version: document.version, accepted: true, screen: LOGIN_CONSENT_SCREEN_ID });
}

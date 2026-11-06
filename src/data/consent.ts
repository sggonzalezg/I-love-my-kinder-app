import { invoke } from './supabase';

export interface ConsentInput {
  documentId: string;
  version: string;
  accepted: boolean;
  screen: string;
  childId?: string;
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

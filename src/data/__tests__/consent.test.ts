import { recordConsent } from '@/data/consent';
import { invoke } from '@/data/supabase';

jest.mock('@/data/supabase', () => ({ invoke: jest.fn(), supabase: {} }));

describe('recordConsent', () => {
  it('sends the document version as text, so 1.20 is not sent as 1.2', async () => {
    await recordConsent({ documentId: 'privacy_policy', version: '1.20', accepted: true, screen: 'D1' });

    expect(invoke).toHaveBeenCalledWith('record-consent', {
      documentType: 'privacy_policy',
      documentVersion: '1.20',
      accepted: true,
      screen: 'D1',
      childId: undefined,
      source: 'app',
    });
  });
});

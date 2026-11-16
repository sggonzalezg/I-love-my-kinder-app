import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { LOGIN_DOCUMENTS } from '@/lib/consent';
import { LEGAL_DOCUMENTS } from '@/legal/documents.generated';

const REPO_ROOT = resolve(__dirname, '..', '..', '..');
const AGENCY_LEGAL_DIR = join(REPO_ROOT, '..', '..', 'legal');

describe('bundled legal documents', () => {
  it('bundles the terms version the login consent records', () => {
    expect(LEGAL_DOCUMENTS.terms.version).toBe(LOGIN_DOCUMENTS.terms.version);
  });

  it('bundles the privacy policy version the login consent records', () => {
    expect(LEGAL_DOCUMENTS.privacy.version).toBe(LOGIN_DOCUMENTS.privacy.version);
  });

  it('bundles the privacy policy that hosts data in Brazil, not the old Frankfurt text', () => {
    expect(LEGAL_DOCUMENTS.privacy.body).not.toContain('Frankfurt');
  });

  // The agency legal/ folder exists only next to this clone, not in CI.
  const itWithAgencyLegal = existsSync(AGENCY_LEGAL_DIR) ? it : it.skip;

  itWithAgencyLegal('matches every source document in the agency legal/ folder', () => {
    expect(() =>
      execFileSync('node', [join(REPO_ROOT, 'scripts', 'sync-legal.mjs'), '--check'], { stdio: 'pipe' }),
    ).not.toThrow();
  });
});

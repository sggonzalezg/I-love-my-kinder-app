import { SIGNED_URL_EXPIRY_SECONDS } from '@/constants/cache';

describe('cache durations', () => {
  it('signs media URLs for one hour', () => {
    expect(SIGNED_URL_EXPIRY_SECONDS).toBe(3600);
  });
});

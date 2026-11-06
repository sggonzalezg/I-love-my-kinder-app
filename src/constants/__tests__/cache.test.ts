import { EVENTS_CACHE_DURATION_MS, SIGNED_URL_EXPIRY_SECONDS } from '@/constants/cache';

describe('cache durations', () => {
  it('keeps cached events for 24 hours', () => {
    expect(EVENTS_CACHE_DURATION_MS).toBe(86_400_000);
  });

  it('signs media URLs for one hour', () => {
    expect(SIGNED_URL_EXPIRY_SECONDS).toBe(3600);
  });
});

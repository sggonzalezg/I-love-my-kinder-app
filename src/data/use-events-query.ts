import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getEventsForMonth, getUpcomingEvents as getUpcomingEventsLib, type Event } from '@/data/events';

const CACHE_KEY_PREFIX = 'events_';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface CacheEntry {
  data: Event[];
  timestamp: number;
}

async function getCachedEvents(key: string): Promise<Event[] | null> {
  try {
    const cached = await AsyncStorage.getItem(CACHE_KEY_PREFIX + key);
    if (!cached) return null;

    const entry: CacheEntry = JSON.parse(cached);
    const isExpired = Date.now() - entry.timestamp > CACHE_DURATION;

    if (isExpired) {
      await AsyncStorage.removeItem(CACHE_KEY_PREFIX + key);
      return null;
    }

    return entry.data;
  } catch {
    return null;
  }
}

async function setCachedEvents(key: string, data: Event[]): Promise<void> {
  try {
    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(CACHE_KEY_PREFIX + key, JSON.stringify(entry));
  } catch {
    // Silently fail cache writes
  }
}

export function useEventsForMonth(year: number, month: number) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadEvents = async () => {
      try {
        const cacheKey = `month_${year}_${month}`;
        const cached = await getCachedEvents(cacheKey);

        if (cached && isMounted) {
          setEvents(cached);
          setLoading(false);
          return;
        }

        const freshEvents = getEventsForMonth(year, month);

        if (isMounted) {
          setEvents(freshEvents);
          await setCachedEvents(cacheKey, freshEvents);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadEvents();

    return () => {
      isMounted = false;
    };
  }, [year, month]);

  return { events, loading, error };
}

export function useUpcomingEvents(limit = 30) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadEvents = async () => {
      try {
        const cacheKey = `upcoming_${limit}`;
        const cached = await getCachedEvents(cacheKey);

        if (cached && isMounted) {
          setEvents(cached);
          setLoading(false);
          return;
        }

        const today = new Date().toISOString().split('T')[0];
        const freshEvents = getUpcomingEventsLib(today, limit);

        if (isMounted) {
          setEvents(freshEvents);
          await setCachedEvents(cacheKey, freshEvents);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadEvents();

    return () => {
      isMounted = false;
    };
  }, [limit]);

  return { events, loading, error };
}

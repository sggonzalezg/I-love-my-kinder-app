import { useCallback, useEffect, useState } from 'react';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  failed: boolean;
  reload: () => void;
}

interface Settled<T> {
  requestId: string;
  data: T | null;
  failed: boolean;
}

/** Runs `load` whenever `key` changes (null waits); `reload` runs it again, for example after a failure. */
export function useAsync<T>(load: () => Promise<T>, key: string | null): AsyncState<T> {
  const [attempt, setAttempt] = useState(0);
  const [settled, setSettled] = useState<Settled<T> | null>(null);
  const requestId = key === null ? null : `${key}#${attempt}`;

  useEffect(() => {
    if (requestId === null) return;
    let isMounted = true;
    load()
      .then((data) => isMounted && setSettled({ requestId, data, failed: false }))
      .catch((error: unknown) => {
        console.warn(`Load failed for ${requestId}:`, error);
        if (isMounted) setSettled({ requestId, data: null, failed: true });
      });
    return () => {
      isMounted = false;
    };
    // load is recreated each render; requestId identifies what it fetches.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId]);

  const current = settled?.requestId === requestId ? settled : null;
  const reload = useCallback(() => setAttempt((count) => count + 1), []);
  return { data: current?.data ?? null, loading: current === null, failed: current?.failed ?? false, reload };
}

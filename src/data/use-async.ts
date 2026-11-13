import { useCallback, useEffect, useState } from 'react';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  failed: boolean;
  reload: () => void;
}

export interface Settled<T> {
  requestId: string;
  data: T | null;
  failed: boolean;
}

interface AsyncOptions {
  /** A reload of the same key keeps showing the last good data instead of nothing (no skeleton flash on refocus). */
  keepDataOnReload?: boolean;
}

/** What to show for the current request: its own result, or with `keepDataOnReload` the last good result of the same key. */
export function shownResult<T>(settled: Settled<T> | null, requestId: string | null, key: string | null, keepDataOnReload: boolean): Settled<T> | null {
  if (settled === null || requestId === null) return null;
  if (settled.requestId === requestId) return settled;
  const isSameKey = settled.requestId.startsWith(`${key}#`);
  return keepDataOnReload && isSameKey && !settled.failed ? settled : null;
}

/** Runs `load` whenever `key` changes (null waits); `reload` runs it again, for example after a failure. */
export function useAsync<T>(load: () => Promise<T>, key: string | null, { keepDataOnReload = false }: AsyncOptions = {}): AsyncState<T> {
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

  const shown = shownResult(settled, requestId, key, keepDataOnReload);
  const isCurrent = settled !== null && settled.requestId === requestId;
  const reload = useCallback(() => setAttempt((count) => count + 1), []);
  return { data: shown?.data ?? null, loading: !isCurrent, failed: isCurrent && settled.failed, reload };
}

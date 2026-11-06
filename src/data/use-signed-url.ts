import { useEffect, useState } from 'react';

import { signedUrl } from './supabase';

export function useSignedUrl(path: string | null | undefined): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    signedUrl(path)
      .then((resolved) => isMounted && setUrl(resolved))
      .catch(() => isMounted && setUrl(null));
    return () => {
      isMounted = false;
    };
  }, [path]);

  return url;
}

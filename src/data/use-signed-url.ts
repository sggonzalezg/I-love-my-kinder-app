import { useEffect, useState } from 'react';

import { PROFILE_PHOTOS_BUCKET } from '@/constants/storage';

import { signedUrl } from './supabase';

export function useSignedUrl(path: string | null | undefined): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    signedUrl(path, PROFILE_PHOTOS_BUCKET)
      .then((resolved) => isMounted && setUrl(resolved))
      .catch(() => isMounted && setUrl(null));
    return () => {
      isMounted = false;
    };
  }, [path]);

  return url;
}

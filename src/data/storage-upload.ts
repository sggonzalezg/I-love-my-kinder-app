import { File, UploadTask, UploadType } from 'expo-file-system';

import { uploadFraction } from '@/lib/chat-photo';

import { SUPABASE_ANON_KEY, SUPABASE_URL, supabase } from './supabase';

const HTTP_MULTIPLE_CHOICES = 300;
const DUPLICATE_OBJECT = 'Duplicate';

interface StorageUpload {
  bucket: string;
  path: string;
  localUri: string;
  mimeType: string;
  /** 'background' keeps an iOS upload going while the app is in the background. */
  sessionType?: 'foreground' | 'background';
  onProgress?: (fraction: number) => void;
}

/** Uploads through the Storage REST endpoint because the SDK upload reports no progress for the bar. */
export async function uploadWithProgress({ bucket, path, localUri, mimeType, sessionType = 'foreground', onProgress }: StorageUpload): Promise<void> {
  const { data } = await supabase.auth.getSession();
  const accessToken = data.session?.access_token;
  if (!accessToken) throw new Error(`No session to upload to ${bucket}`);

  const task = new UploadTask(new File(localUri), `${SUPABASE_URL}/storage/v1/object/${bucket}/${path}`, {
    httpMethod: 'POST',
    uploadType: UploadType.BINARY_CONTENT,
    mimeType,
    headers: { Authorization: `Bearer ${accessToken}`, apikey: SUPABASE_ANON_KEY, 'Content-Type': mimeType },
    sessionType,
    onProgress: onProgress && (({ bytesSent, totalBytes }) => onProgress(uploadFraction(bytesSent, totalBytes))),
  });
  try {
    let result: Awaited<ReturnType<UploadTask['uploadAsync']>>;
    try {
      result = await task.uploadAsync();
    } catch (error) {
      // The task only throws when no response came back, so the queue waits for the connection.
      throw new Error(`Network request failed: ${error instanceof Error ? error.message : String(error)}`);
    }
    // A retry after a lost response finds the file already stored under the same path.
    const alreadyStored = result.body.includes(DUPLICATE_OBJECT);
    if (result.status >= HTTP_MULTIPLE_CHOICES && !alreadyStored) {
      throw Object.assign(new Error(`Upload to ${bucket} failed (${result.status}): ${result.body}`), { status: result.status });
    }
  } finally {
    task.release();
  }
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useSyncExternalStore } from 'react';
import { AppState } from 'react-native';

import { UPLOAD_QUEUE_STORAGE_KEY, UPLOAD_RETRY_MS, UPLOADED_LINGER_MS } from '@/constants/gallery-upload';
import {
  enqueueUploads,
  hasUnfinishedUploads,
  nextToUpload,
  resumeInterrupted,
  updateUpload,
  uploadFailureStatus,
  withoutUploaded,
  type UploadItem,
} from '@/lib/gallery-upload';

import { deleteKeptFiles, isPreparedFileMissing, prepareGalleryMedia, uploadGalleryItem } from './gallery-upload';

let items: UploadItem[] = [];
const listeners = new Set<() => void>();
let uploading = false;
let clearTimer: ReturnType<typeof setTimeout> | null = null;

function setItems(next: UploadItem[]) {
  items = next;
  listeners.forEach((listener) => listener());
}

function update(id: string, change: Partial<UploadItem>) {
  setItems(updateUpload(items, id, change));
}

function persist() {
  AsyncStorage.setItem(UPLOAD_QUEUE_STORAGE_KEY, JSON.stringify(items)).catch((error: unknown) =>
    console.warn('Could not persist the gallery upload queue:', error),
  );
}

const restored = AsyncStorage.getItem(UPLOAD_QUEUE_STORAGE_KEY)
  .then((stored) => {
    if (stored) setItems(resumeInterrupted(JSON.parse(stored) as UploadItem[]));
  })
  .catch((error: unknown) => console.warn('Could not restore the gallery upload queue:', error));

async function runUpload(item: UploadItem): Promise<void> {
  let current = item;
  if (!current.preparedUri || isPreparedFileMissing(current)) {
    update(current.id, { status: current.kind === 'video' ? 'preparing' : 'uploading', progress: 0 });
    current = { ...current, ...(await prepareGalleryMedia(current)) };
    update(current.id, { preparedUri: current.preparedUri, coverUri: current.coverUri });
    persist();
  }
  update(current.id, { status: 'uploading' });
  await uploadGalleryItem(current, (progress) => update(current.id, { progress }));
  deleteKeptFiles(current);
}

function clearUploadedLater() {
  if (clearTimer) clearTimeout(clearTimer);
  clearTimer = setTimeout(() => {
    clearTimer = null;
    if (hasUnfinishedUploads(items)) return;
    setItems(withoutUploaded(items));
    persist();
  }, UPLOADED_LINGER_MS);
}

export async function processUploads() {
  if (uploading) return;
  uploading = true;
  try {
    await restored;
    for (let next = nextToUpload(items); next; next = nextToUpload(items)) {
      try {
        await runUpload(next);
        update(next.id, { status: 'uploaded', progress: 1 });
      } catch (error) {
        const status = uploadFailureStatus(error);
        console.warn('Gallery upload stopped:', error);
        update(next.id, { status });
        if (status === 'offline') break;
      } finally {
        persist();
      }
    }
    if (!hasUnfinishedUploads(items)) clearUploadedLater();
  } finally {
    uploading = false;
  }
}

export function queueUploads(newItems: UploadItem[]) {
  setItems(enqueueUploads(items, newItems));
  persist();
  void processUploads();
}

export function retryUpload(id: string) {
  update(id, { status: 'queued', progress: 0 });
  persist();
  void processUploads();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** The queue, kept uploading while the tab is mounted: at once, on return to the foreground and every 30 s. */
export function useGalleryUploadQueue(): UploadItem[] {
  useEffect(() => {
    void processUploads();
    const appState = AppState.addEventListener('change', (status) => status === 'active' && void processUploads());
    const timer = setInterval(() => void processUploads(), UPLOAD_RETRY_MS);
    return () => {
      appState.remove();
      clearInterval(timer);
    };
  }, []);
  return useSyncExternalStore(subscribe, () => items);
}

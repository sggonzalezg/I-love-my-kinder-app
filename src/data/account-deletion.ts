import { invoke, supabase } from './supabase';

const DELETE_ACCOUNT_FUNCTION = 'delete-account';

export async function isOnlyDirector(): Promise<boolean> {
  const { onlyDirector } = await invoke<{ onlyDirector: boolean }>(DELETE_ACCOUNT_FUNCTION, { action: 'check' });
  return onlyDirector;
}

export async function sendDeletionCode(): Promise<void> {
  await invoke(DELETE_ACCOUNT_FUNCTION, { action: 'send_code' });
}

/** Deletes the account on the server; returns when it happened (ISO). */
export async function confirmDeletion(code: string): Promise<string> {
  const { deletedAt } = await invoke<{ deletedAt: string }>(DELETE_ACCOUNT_FUNCTION, { action: 'confirm', code });
  return deletedAt;
}

export async function fetchAccountEmail(): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  return data.user?.email ?? null;
}

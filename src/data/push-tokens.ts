import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { PUSH_DEVICE_ID_STORAGE_KEY } from '@/constants/storage';
import { invoke, supabase } from '@/data/supabase';
import { throwOnError } from '@/data/throw-on-error';
import { createPushDeviceId, readEasProjectId } from '@/lib/push-registration';

const REGISTER_PUSH_TOKEN_FUNCTION = 'register-push-token';
const PUSH_TOKENS_TABLE = 'push_tokens';
const GRANTED = 'granted';

async function pushDeviceId(): Promise<string> {
  const stored = await AsyncStorage.getItem(PUSH_DEVICE_ID_STORAGE_KEY);
  if (stored) return stored;
  const created = createPushDeviceId(Math.random, Date.now());
  await AsyncStorage.setItem(PUSH_DEVICE_ID_STORAGE_KEY, created);
  return created;
}

async function registerGrantedDevice(): Promise<void> {
  const projectId = readEasProjectId(Constants);
  if (!projectId) {
    console.warn('Push token not registered: the app is not linked to an EAS project yet.');
    return;
  }
  const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
  await invoke(REGISTER_PUSH_TOKEN_FUNCTION, { token, deviceId: await pushDeviceId() });
}

/** S0d: asks the OS and, when granted, registers this device. A failure never blocks the way to Hoy. */
export async function activatePushNotifications(): Promise<void> {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status === GRANTED) await registerGrantedDevice();
  } catch (error) {
    console.error('Failed to activate push notifications:', error);
  }
}

/** Expo can rotate the token, so a signed-in app with the permission sends it again on every start. */
export function useRefreshPushToken(userId: string | undefined) {
  useEffect(() => {
    if (!userId || Platform.OS === 'web') return;
    Notifications.getPermissionsAsync()
      .then(({ status }) => (status === GRANTED ? registerGrantedDevice() : undefined))
      .catch((error) => console.error('Failed to refresh the push token:', error));
  }, [userId]);
}

/** Runs before sign out so the next person on this phone never gets the previous user's pushes. */
export async function forgetDevicePushToken(): Promise<void> {
  const deviceId = await AsyncStorage.getItem(PUSH_DEVICE_ID_STORAGE_KEY);
  if (!deviceId) return;
  try {
    throwOnError(await supabase.from(PUSH_TOKENS_TABLE).delete().eq('device_id', deviceId));
  } catch (error) {
    console.error('Failed to remove the push token of this device:', error);
  }
}

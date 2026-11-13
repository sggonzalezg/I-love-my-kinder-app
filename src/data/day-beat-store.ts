import AsyncStorage from '@react-native-async-storage/async-storage';

import { DAY_BEAT_STORAGE_KEY_PREFIX } from '@/constants/cache';

/** Design "Día firmado": the seal beats only the first time a child's signed day is opened that day. */
export async function claimDayBeat(childId: string, isoDate: string): Promise<boolean> {
  const key = DAY_BEAT_STORAGE_KEY_PREFIX + childId;
  if ((await AsyncStorage.getItem(key)) === isoDate) return false;
  await AsyncStorage.setItem(key, isoDate);
  return true;
}

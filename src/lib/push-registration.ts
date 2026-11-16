const ID_RADIX = 36;
const RANDOM_ID_SCALE = 1e12;

export interface AppConfigSource {
  expoConfig?: { extra?: { eas?: { projectId?: string } } } | null;
  easConfig?: { projectId?: string } | null;
}

/** Expo push tokens are issued per EAS project; without one linked the app cannot get a token. */
export function readEasProjectId(config: AppConfigSource): string | null {
  return config.expoConfig?.extra?.eas?.projectId ?? config.easConfig?.projectId ?? null;
}

export function createPushDeviceId(random: () => number, now: number): string {
  const randomPart = Math.floor(random() * RANDOM_ID_SCALE).toString(ID_RADIX);
  return `device-${now.toString(ID_RADIX)}-${randomPart}`;
}

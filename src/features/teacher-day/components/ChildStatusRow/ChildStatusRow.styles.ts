import { StyleSheet } from 'react-native';

import type { ChildSyncStatus } from '@/lib/routine-queue';
import { space, type ColorName } from '@/theme/tokens';

export const STATUS_ICON_SIZE = 18;
export const ALLERGY_ICON_SIZE = 16;
const STATUS_WELL_SIZE = 32;
const ROW_MIN_HEIGHT = 64;

export const STATUS_PALETTES: Record<ChildSyncStatus, { background: ColorName; foreground: ColorName }> = {
  none: { background: 'raised', foreground: 'muted' },
  synced: { background: 'ok50', foreground: 'ok' },
  pending: { background: 'wait50', foreground: 'wait' },
  rejected: { background: 'red50', foreground: 'red' },
};

export const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.s3, paddingVertical: space.s3, paddingHorizontal: space.s4, minHeight: ROW_MIN_HEIGHT },
  text: { flex: 1, minWidth: 0 },
  allergy: { flexDirection: 'row', alignItems: 'center', gap: space.s1 },
  statusIcon: { width: STATUS_WELL_SIZE, height: STATUS_WELL_SIZE, borderRadius: STATUS_WELL_SIZE / 2, alignItems: 'center', justifyContent: 'center' },
});

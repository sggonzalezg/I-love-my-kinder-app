import { StyleSheet } from 'react-native';

import { radius, space } from '@/theme/tokens';

const CARD_GAP = 14;
const CHIP_GAP = 6;
export const KID_CARD_PRESSED_SCALE = 0.98;
export const CHEVRON_SIZE = 20;

export const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: CARD_GAP, borderRadius: radius.lg, padding: space.s3 },
  text: { flex: 1, minWidth: 0, gap: CHIP_GAP },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: CHIP_GAP },
});

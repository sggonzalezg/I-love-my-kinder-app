import { StyleSheet } from 'react-native';

import { radius, size, space } from '@/theme/tokens';

export const SKELETON_KID_CARDS = 2;
export const SKELETON_PHOTO_SIZE = 84;
export const SKELETON_NAME_LINE = { width: '60%', height: 20 } as const;
export const SKELETON_CHIPS_LINE = { width: '80%', height: 28 } as const;
const KID_CARD_GAP = 10;
// The screen already puts space.s4 between blocks; the mockup's section heading sits 24 px under the cards.
const SECTION_TOP = 24 - space.s4;
const SECTION_TITLE_GAP = 10;
const SKELETON_CARD_GAP = 14;

export const styles = StyleSheet.create({
  kids: { gap: KID_CARD_GAP },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: SECTION_TOP, marginBottom: SECTION_TITLE_GAP },
  skeletonCard: { flexDirection: 'row', alignItems: 'center', gap: SKELETON_CARD_GAP, borderRadius: radius.lg, padding: space.s3 },
  skeletonLines: { flex: 1, gap: space.s2 },
  seeCalendar: { minHeight: size.touch, justifyContent: 'center' },
  error: { gap: space.s3, alignItems: 'flex-start' },
});

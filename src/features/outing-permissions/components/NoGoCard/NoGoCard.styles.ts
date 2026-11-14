import { StyleSheet } from 'react-native';

import { createThemedStyles } from '@/theme/themed-styles';
import { fonts, radius, space } from '@/theme/tokens';

export const ALERT_ICON_SIZE = 20;
const TITLE_SIZE = 17;
const NAME_PILL_PADDING_VERTICAL = 6;
const NAMES_GAP = 6;
const CARD_PADDING_VERTICAL = 14;
const HEADING_GAP = 10;
const NAMES_MARGIN_TOP = 10;
const TITLE_LINE_HEIGHT = 21;

export const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, paddingVertical: CARD_PADDING_VERTICAL, paddingHorizontal: space.s4, marginTop: space.s2 },
  heading: { flexDirection: 'row', alignItems: 'center', gap: HEADING_GAP },
  title: { fontFamily: fonts.display800, fontSize: TITLE_SIZE, lineHeight: TITLE_LINE_HEIGHT },
  reason: { marginTop: space.s1 },
  names: { flexDirection: 'row', flexWrap: 'wrap', gap: NAMES_GAP, marginTop: NAMES_MARGIN_TOP },
  name: { overflow: 'hidden', borderRadius: radius.full,paddingVertical: NAME_PILL_PADDING_VERTICAL, paddingHorizontal: space.s3 },
});

export const useNoGoCardStyles = createThemedStyles((colors) => ({
  card: { backgroundColor: colors.red50 },
  name: { backgroundColor: colors.surface },
}));

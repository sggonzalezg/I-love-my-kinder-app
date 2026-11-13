import { StyleSheet } from 'react-native';

import { radius, space } from '@/theme/tokens';

export const STATUS_ICON_SIZE = 56;
export const ALERT_GLYPH_SIZE = 26;
const PARAGRAPH_GAP = 10;

export const styles = StyleSheet.create({
  statusIcon: {
    width: STATUS_ICON_SIZE,
    height: STATUS_ICON_SIZE,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space.s3,
  },
  title: { marginBottom: space.s3 },
  paragraph: { marginTop: PARAGRAPH_GAP },
  action: { marginTop: space.s5 },
});

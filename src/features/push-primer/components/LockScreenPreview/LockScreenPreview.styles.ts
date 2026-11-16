import { StyleSheet } from 'react-native';

import { fonts, space } from '@/theme/tokens';

// A phone's lock screen looks the same in light and dark mode, so these colors are fixed.
const LOCK_SCRIM = 'rgba(8,14,30,0.38)';
const NOTIFICATION_BACKGROUND = 'rgba(250,251,255,0.95)';
const NOTIFICATION_INK = '#14213D';
const NOTIFICATION_MUTED = '#5B6478';
const LOCK_TEXT = '#FFFFFF';

const CLOCK_TOP = 96;
const CLOCK_SIZE = 84;
const DATE_TOP = 6;
const DATE_SIZE = 18;
const NOTIFICATION_PADDING_HORIZONTAL = 14;
const WHEN_SIZE = 13;
const NOTIFICATION_TOP = 28;
const NOTIFICATION_SIDE = 12;
const NOTIFICATION_RADIUS = 22;
const NOTIFICATION_TEXT_SIZE = 15;
const NOTIFICATION_LINE_HEIGHT = 20;
const APP_ICON_SIZE = 38;
const APP_ICON_RADIUS = 9;

export const styles = StyleSheet.create({
  root: { ...StyleSheet.absoluteFill, alignItems: 'center' },
  photo: { ...StyleSheet.absoluteFill },
  scrim: { ...StyleSheet.absoluteFill, backgroundColor: LOCK_SCRIM },
  clock: { marginTop: CLOCK_TOP, color: LOCK_TEXT, fontFamily: fonts.text400, fontSize: CLOCK_SIZE, lineHeight: CLOCK_SIZE, fontVariant: ['tabular-nums'] },
  date: { marginTop: DATE_TOP, color: LOCK_TEXT, fontFamily: fonts.text600, fontSize: DATE_SIZE },
  notification: {
    marginTop: NOTIFICATION_TOP,
    alignSelf: 'stretch',
    marginHorizontal: NOTIFICATION_SIDE,
    flexDirection: 'row',
    gap: space.s3,
    paddingVertical: space.s3,
    paddingHorizontal: NOTIFICATION_PADDING_HORIZONTAL,
    borderRadius: NOTIFICATION_RADIUS,
    backgroundColor: NOTIFICATION_BACKGROUND,
  },
  appIcon: { width: APP_ICON_SIZE, height: APP_ICON_SIZE, borderRadius: APP_ICON_RADIUS },
  body: { flex: 1, minWidth: 0 },
  head: { flexDirection: 'row', gap: space.s2 },
  appName: { color: NOTIFICATION_INK, fontFamily: fonts.text700, fontSize: NOTIFICATION_TEXT_SIZE, lineHeight: NOTIFICATION_LINE_HEIGHT },
  when: { marginLeft: 'auto', color: NOTIFICATION_MUTED, fontFamily: fonts.text400, fontSize: WHEN_SIZE, lineHeight: NOTIFICATION_LINE_HEIGHT },
  message: { color: NOTIFICATION_INK, fontFamily: fonts.text400, fontSize: NOTIFICATION_TEXT_SIZE, lineHeight: NOTIFICATION_LINE_HEIGHT },
});

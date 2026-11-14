import { StyleSheet } from 'react-native';

import { fonts, space } from '@/theme/tokens';

export const SKELETON_TILES_HEIGHT = 76;
export const SKELETON_ROW_HEIGHT = 64;
export const SKELETON_ROWS = 4;
export const DONE_ICON_SIZE = 18;
const GOING_HEADING_SIZE = 16;
const GOING_HEADING_LINE_HEIGHT = 21;
const SUMMARY_AFTER_CARD = 14;

export const styles = StyleSheet.create({
  feedback: { gap: space.s3, paddingTop: space.s4 },
  caption: { marginTop: space.s3, marginHorizontal: space.s1 },
  done: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space.s2, marginTop: space.s5 },
  bottom: { height: space.s6 },
  daySummary: { marginTop: SUMMARY_AFTER_CARD },
  goingHeading: {
    fontFamily: fonts.display800,
    fontSize: GOING_HEADING_SIZE,
    lineHeight: GOING_HEADING_LINE_HEIGHT,
    marginTop: space.s5,
    marginBottom: space.s2,
  },
});

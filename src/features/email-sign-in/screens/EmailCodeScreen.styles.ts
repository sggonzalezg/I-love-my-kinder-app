import { StyleSheet } from 'react-native';

import { fonts, size, space } from '@/theme/tokens';

const TITLE_SIZE = 30;
const BOXES_MARGIN_TOP = 28;
const STATUS_GAP = 10;

export const styles = StyleSheet.create({
  title: { fontSize: TITLE_SIZE, lineHeight: TITLE_SIZE * 1.1, marginTop: space.s2, marginBottom: space.s2 },
  link: { fontFamily: fonts.text600 },
  boxes: { marginTop: BOXES_MARGIN_TOP, marginBottom: space.s3 },
  tools: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.s3, minHeight: size.touch },
  status: { flexDirection: 'row', alignItems: 'center', gap: STATUS_GAP, marginTop: space.s2 },
  openMail: { marginTop: space.s4 },
  wideAction: { marginTop: space.s6 },
});

import { StyleSheet } from 'react-native';

export const ALERT_ICON_SIZE = 16;
const ALERT_GAP = 6;

export const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: ALERT_GAP, marginTop: ALERT_GAP },
  text: { flex: 1 },
});

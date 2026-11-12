import { StyleSheet } from 'react-native';

const TRACK_HEIGHT = 10;
const THIN_TRACK_HEIGHT = 6;

export const styles = StyleSheet.create({
  track: { height: TRACK_HEIGHT, borderRadius: TRACK_HEIGHT / 2, overflow: 'hidden' },
  thin: { height: THIN_TRACK_HEIGHT, borderRadius: THIN_TRACK_HEIGHT / 2 },
  fill: { flex: 1, transformOrigin: 'left' },
});

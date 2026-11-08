import { StyleSheet } from 'react-native';

export const SCRIM_MAX_OPACITY = 0.55;
const SCRIM_HEIGHT = 180;

export const styles = StyleSheet.create({
  top: { position: 'absolute', left: 0, right: 0, top: 0, height: SCRIM_HEIGHT },
  bottom: { position: 'absolute', left: 0, right: 0, bottom: 0, height: SCRIM_HEIGHT },
});

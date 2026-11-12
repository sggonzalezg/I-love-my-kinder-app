import type { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { FadeIn, ReduceMotion, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { duration, easeOut } from '@/theme/motion';
import { radius, screenMargin, shadow, space } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

const GRAB_WIDTH = 36;
const GRAB_HEIGHT = 5;

interface SheetProps {
  visible: boolean;
  onClose: () => void;
  /** iOS only: fires once the sheet is gone, the first moment another modal (a picker) can open. */
  onDismiss?: () => void;
  /** Height rules of the sheet itself (a list that keeps its height while it filters). */
  sheetStyle?: StyleProp<ViewStyle>;
  children: ReactNode;
}

export function Sheet({ visible, onClose, onDismiss, sheetStyle, children }: SheetProps) {
  const c = useColors();
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose} onDismiss={onDismiss} statusBarTranslucent>
      <Animated.View entering={FadeIn.duration(duration.base)} style={[StyleSheet.absoluteFill, { backgroundColor: c.scrim }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityRole="button" accessibilityLabel="Cerrar" />
      </Animated.View>
      <View style={styles.anchor} pointerEvents="box-none">
        <Animated.View
          entering={SlideInDown.duration(duration.slow).easing(easeOut).reduceMotion(ReduceMotion.System)}
          style={[styles.sheet, shadow.sheet, { backgroundColor: c.surface, paddingBottom: insets.bottom + space.s5 }, sheetStyle]}>
          <View style={[styles.grab, { backgroundColor: c.border }]} />
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  anchor: { flex: 1, justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: radius.sheet, borderTopRightRadius: radius.sheet, paddingHorizontal: screenMargin, paddingTop: space.s3 },
  grab: { alignSelf: 'center', width: GRAB_WIDTH, height: GRAB_HEIGHT, borderRadius: radius.full, marginBottom: space.s4 },
});

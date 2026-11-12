import type { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { FadeIn, ReduceMotion, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useBackgroundColorStyles } from '@/theme/color-styles';
import { duration, easeOut } from '@/theme/motion';
import { shadow } from '@/theme/tokens';

import { bottomInsetStyle, styles } from './sheet.styles';

interface SheetProps {
  visible: boolean;
  onClose: () => void;
  onShow?: () => void;
  /** iOS only: fires once the sheet is gone, the first moment another modal (a picker) can open. */
  onDismiss?: () => void;
  sheetStyle?: StyleProp<ViewStyle>;
  children: ReactNode;
}

export function Sheet({ visible, onClose, onShow, onDismiss, sheetStyle, children }: SheetProps) {
  const backgroundStyles = useBackgroundColorStyles();
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose} onShow={onShow} onDismiss={onDismiss} statusBarTranslucent>
      {/* Screen readers stay inside the sheet: they close it with the back gesture (Android) or the escape gesture (iOS). */}
      <Animated.View entering={FadeIn.duration(duration.base)} style={[StyleSheet.absoluteFill, backgroundStyles.scrim]} importantForAccessibility="no-hide-descendants">
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityRole="button" accessibilityLabel="Cerrar" />
      </Animated.View>
      <View style={styles.anchor} pointerEvents="box-none">
        <Animated.View
          accessibilityViewIsModal
          onAccessibilityEscape={onClose}
          entering={SlideInDown.duration(duration.slow).easing(easeOut).reduceMotion(ReduceMotion.System)}
          style={[styles.sheet, shadow.sheet, backgroundStyles.surface, bottomInsetStyle(insets.bottom), sheetStyle]}>
          <View style={[styles.grab, backgroundStyles.border]} />
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

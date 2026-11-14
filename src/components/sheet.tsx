import type { ReactNode } from 'react';
import { Modal, Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import { GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { FadeIn, ReduceMotion, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSheetDragToClose } from '@/lib/animations/use-sheet-drag-to-close';
import { duration, easeOut } from '@/theme/motion';
import { shadow } from '@/theme/tokens';

import { sheetBottomPadding, useSheetStyles } from './sheet.styles';

interface SheetProps {
  visible: boolean;
  onClose: () => void;
  /** iOS only: fires once the sheet is gone, the first moment another modal (a picker) can open. */
  onDismiss?: () => void;
  /** Height rules of the sheet itself (a list that keeps its height while it filters). */
  sheetStyle?: StyleProp<ViewStyle>;
  /** The content scrolls: only the grab strip drags the sheet, so a downward scroll never closes it. */
  scrollableContent?: boolean;
  children: ReactNode;
}

export function Sheet({ visible, onClose, onDismiss, sheetStyle, scrollableContent = false, children }: SheetProps) {
  const styles = useSheetStyles();
  const insets = useSafeAreaInsets();
  const { gesture, dragStyle, onSheetLayout } = useSheetDragToClose(visible, onClose);

  const grabStrip = (
    <View style={styles.grabStrip}>
      <View style={styles.grab} />
    </View>
  );
  const sheet = (
    <Animated.View
      entering={SlideInDown.duration(duration.slow).easing(easeOut).reduceMotion(ReduceMotion.System)}
      onLayout={onSheetLayout}
      style={[styles.sheet, shadow.sheet, sheetBottomPadding(insets.bottom), sheetStyle]}>
      {scrollableContent ? <GestureDetector gesture={gesture}>{grabStrip}</GestureDetector> : grabStrip}
      {children}
    </Animated.View>
  );

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose} onDismiss={onDismiss} statusBarTranslucent>
      <GestureHandlerRootView style={styles.root}>
        <Animated.View entering={FadeIn.duration(duration.base)} style={styles.scrim}>
          <Pressable style={styles.root} onPress={onClose} accessibilityRole="button" accessibilityLabel="Cerrar" />
        </Animated.View>
        <Animated.View style={[styles.anchor, dragStyle]} pointerEvents="box-none">
          {scrollableContent ? sheet : <GestureDetector gesture={gesture}>{sheet}</GestureDetector>}
        </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  );
}

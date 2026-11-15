import { Image } from 'expo-image';
import { ImagePlus, X } from 'lucide-react-native';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';

import { Button } from '@/components/button';
import { PressableScale } from '@/components/pressable-scale';
import { Text } from '@/components/text';
import { EVENT_FORM_COPY } from '@/features/calendar/event-form-copy';
import type { EventImage } from '@/lib/event-image';
import { useBackgroundColorStyles } from '@/theme/color-styles';
import { attachmentEntering, formLayoutTransition } from '@/theme/motion';
import { useColors } from '@/theme/use-theme';

import { ATTACH_ICON_SIZE, ATTACH_PRESSED_SCALE, REMOVE_ICON_SIZE, styles } from './EventImageField.styles';

interface EventImageFieldProps {
  image: EventImage | null;
  cameraDenied: boolean;
  disabled: boolean;
  onAdd: () => void;
  onRemove: () => void;
  onOpenSettings: () => void;
}

export function EventImageField({ image, cameraDenied, disabled, onAdd, onRemove, onOpenSettings }: EventImageFieldProps) {
  const colors = useColors();
  const backgroundStyles = useBackgroundColorStyles();

  return (
    <Animated.View layout={formLayoutTransition} style={styles.field}>
      <Text variant="label">
        {EVENT_FORM_COPY.image}
        <Text variant="small" tone="muted">
          {` ${EVENT_FORM_COPY.optional}`}
        </Text>
      </Text>
      {image ? (
        <Animated.View entering={attachmentEntering} style={[styles.preview, backgroundStyles.blue100]}>
          <Image source={{ uri: image.uri }} style={styles.image} contentFit="cover" accessibilityLabel={EVENT_FORM_COPY.chosenImage} />
          <View style={styles.controls}>
            <PressableScale accessibilityRole="button" disabled={disabled} onPress={onAdd} style={styles.control}>
              <Text variant="smallStrong" tone="white">
                {EVENT_FORM_COPY.changeImage}
              </Text>
            </PressableScale>
            <PressableScale accessibilityRole="button" accessibilityLabel={EVENT_FORM_COPY.removeImage} disabled={disabled} onPress={onRemove} style={styles.control}>
              <X size={REMOVE_ICON_SIZE} color={colors.white} strokeWidth={2} />
            </PressableScale>
          </View>
        </Animated.View>
      ) : (
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel={EVENT_FORM_COPY.addImage}
          accessibilityHint={EVENT_FORM_COPY.addImageHint}
          pressedScale={ATTACH_PRESSED_SCALE}
          disabled={disabled}
          onPress={onAdd}
          style={[styles.attach, backgroundStyles.blue50]}>
          <ImagePlus size={ATTACH_ICON_SIZE} color={colors.blue} strokeWidth={2} />
          <View style={styles.attachText}>
            <Text variant="button" tone="blue">
              {EVENT_FORM_COPY.addImage}
            </Text>
            <Text variant="caption" tone="muted">
              {EVENT_FORM_COPY.addImageHint}
            </Text>
          </View>
        </PressableScale>
      )}
      {cameraDenied ? (
        <View style={styles.cameraDenied} accessibilityLiveRegion="polite">
          <Text variant="small" tone="red">
            {EVENT_FORM_COPY.cameraDenied}
          </Text>
          <Button label={EVENT_FORM_COPY.openSettings} variant="plain" onPress={onOpenSettings} />
        </View>
      ) : null}
    </Animated.View>
  );
}

import { Camera, Image as ImageIcon, type LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { PressableScale } from '@/components/pressable-scale';
import { Text } from '@/components/text';
import type { ChatPhotoSource } from '@/data/chat-photos';
import { TEACHER_UPLOAD_COPY } from '@/features/teacher-upload/teacher-upload-copy';
import { useBackgroundColorStyles } from '@/theme/color-styles';
import { useColors } from '@/theme/use-theme';

import { SOURCE_ICON_SIZE, styles } from './MediaSourceButtons.styles';

interface MediaSourceButtonsProps {
  onChoose: (source: ChatPhotoSource) => void;
}

const SOURCES: { source: ChatPhotoSource; label: string; icon: LucideIcon }[] = [
  { source: 'camera', label: TEACHER_UPLOAD_COPY.takeMedia, icon: Camera },
  { source: 'library', label: TEACHER_UPLOAD_COPY.chooseMedia, icon: ImageIcon },
];

export function MediaSourceButtons({ onChoose }: MediaSourceButtonsProps) {
  const colors = useColors();
  const backgroundStyles = useBackgroundColorStyles();

  return (
    <View style={styles.row}>
      {SOURCES.map(({ source, label, icon: Icon }) => (
        <PressableScale
          key={source}
          containerStyle={styles.cell}
          onPress={() => onChoose(source)}
          accessibilityRole="button"
          accessibilityLabel={label}
          style={({ pressed }) => [styles.button, pressed ? backgroundStyles.blue100 : backgroundStyles.blue50]}>
          <Icon size={SOURCE_ICON_SIZE} color={colors.blue} strokeWidth={1.8} />
          <Text variant="button" tone="blue" style={styles.label}>
            {label}
          </Text>
        </PressableScale>
      ))}
    </View>
  );
}

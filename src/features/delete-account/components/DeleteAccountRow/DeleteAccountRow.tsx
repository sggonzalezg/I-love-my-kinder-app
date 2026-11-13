import { ChevronRight, Trash2 } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Text } from '@/components/text';
import { DELETE_ACCOUNT_COPY } from '@/features/delete-account/delete-account-copy';
import { useBackgroundColorStyles } from '@/theme/color-styles';
import { iconStroke } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

import { ROW_ICON_SIZE, styles } from './DeleteAccountRow.styles';

export interface DeleteAccountRowProps {
  onPress: () => void;
}

export function DeleteAccountRow({ onPress }: DeleteAccountRowProps) {
  const colors = useColors();
  const backgroundStyles = useBackgroundColorStyles();
  return (
    <View style={styles.list}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={DELETE_ACCOUNT_COPY.profileRow}
        accessibilityHint={DELETE_ACCOUNT_COPY.profileRowMeta}
        style={({ pressed }) => [styles.row, pressed ? backgroundStyles.raised : backgroundStyles.surface]}>
        <Trash2 size={ROW_ICON_SIZE} color={colors.red} strokeWidth={iconStroke.regular} />
        <View style={styles.text}>
          <Text variant="bodyStrong" tone="red">
            {DELETE_ACCOUNT_COPY.profileRow}
          </Text>
          <Text variant="small" tone="muted">
            {DELETE_ACCOUNT_COPY.profileRowMeta}
          </Text>
        </View>
        <ChevronRight size={ROW_ICON_SIZE} color={colors.red} strokeWidth={iconStroke.regular} />
      </Pressable>
    </View>
  );
}

import { router } from 'expo-router';
import { ChevronRight, Settings } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Text } from '@/components/text';
import { SETTINGS_ROUTE } from '@/constants/routes';
import { DIRECTOR_SETTINGS_COPY } from '@/features/director-settings/director-settings-copy';
import { useBackgroundColorStyles } from '@/theme/color-styles';
import { iconStroke } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

import { ROW_ICON_SIZE, styles } from './SettingsEntryRow.styles';

export function SettingsEntryRow() {
  const colors = useColors();
  const backgroundStyles = useBackgroundColorStyles();
  return (
    <View style={styles.list}>
      <Pressable
        onPress={() => router.push(SETTINGS_ROUTE)}
        accessibilityRole="button"
        accessibilityLabel={DIRECTOR_SETTINGS_COPY.entryRow}
        accessibilityHint={DIRECTOR_SETTINGS_COPY.entryRowMeta}
        style={({ pressed }) => [styles.row, pressed ? backgroundStyles.raised : backgroundStyles.surface]}>
        <Settings size={ROW_ICON_SIZE} color={colors.ink} strokeWidth={iconStroke.regular} />
        <View style={styles.text}>
          <Text variant="bodyStrong">{DIRECTOR_SETTINGS_COPY.entryRow}</Text>
          <Text variant="small" tone="muted">
            {DIRECTOR_SETTINGS_COPY.entryRowMeta}
          </Text>
        </View>
        <ChevronRight size={ROW_ICON_SIZE} color={colors.muted} strokeWidth={iconStroke.regular} />
      </Pressable>
    </View>
  );
}

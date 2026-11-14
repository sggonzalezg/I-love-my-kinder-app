import { ClipboardCheck, IdCard, Users } from 'lucide-react-native';
import { View } from 'react-native';

import { Text } from '@/components/text';
import { CALENDAR_COPY } from '@/features/calendar/calendar-copy';
import { iconStroke } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

import { NOTIFIED_ICON_SIZE, styles, useNotifiedBlockStyles } from './NotifiedBlock.styles';

interface NotifiedBlockProps {
  lines: string[];
  voidedPermissionsLine?: string | null;
}

export function NotifiedBlock({ lines, voidedPermissionsLine }: NotifiedBlockProps) {
  const colors = useColors();
  const themed = useNotifiedBlockStyles();

  return (
    <View style={[styles.block, themed.block]}>
      <Text variant="smallStrong">{CALENDAR_COPY.notifiedTitle}</Text>
      {lines.map((line, index) => {
        const Icon = index === 0 ? Users : IdCard;
        return (
          <View key={line} style={styles.line}>
            <Icon size={NOTIFIED_ICON_SIZE} color={colors.blue} strokeWidth={iconStroke.regular} />
            <Text variant="small" style={styles.lineText}>
              {line}
            </Text>
          </View>
        );
      })}
      {voidedPermissionsLine ? (
        <View style={styles.line}>
          <ClipboardCheck size={NOTIFIED_ICON_SIZE} color={colors.blue} strokeWidth={iconStroke.regular} />
          <Text variant="small" style={styles.lineText}>
            {voidedPermissionsLine}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

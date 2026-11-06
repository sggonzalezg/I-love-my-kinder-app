import { View } from 'react-native';
import { Heart } from 'lucide-react-native';
import { Text } from './text';
import { useTheme } from '@/theme/use-theme';

interface DaySealProps {
  teacher?: string;
  time?: string;
  entryCount?: number;
}

export function DaySeal({ teacher, time, entryCount }: DaySealProps) {
  const { colors, spacing, radius } = useTheme();

  return (
    <View
      style={{
        backgroundColor: colors.primary,
        borderRadius: radius.md,
        padding: spacing.md,
        alignItems: 'center',
        marginBottom: spacing.md,
      }}
    >
      <Heart size={24} color={colors.onPrimary} fill={colors.onPrimary} />
      <Text style={{ fontSize: 14, fontWeight: '600', color: colors.onPrimary, marginTop: spacing.sm }}>
        {teacher} firmó el día
      </Text>
      {time && (
        <Text style={{ fontSize: 12, color: colors.onPrimary, opacity: 0.9, marginTop: spacing.xs }}>
          {time}
        </Text>
      )}
      {entryCount && (
        <Text style={{ fontSize: 12, color: colors.onPrimary, opacity: 0.9 }}>
          {entryCount} registros
        </Text>
      )}
    </View>
  );
}

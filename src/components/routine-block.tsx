import { View } from 'react-native';
import { Clock, Apple, Moon, Baby, Wind } from 'lucide-react-native';
import { Text } from './text';
import { useTheme } from '@/theme/use-theme';
import type { RoutineEntry } from '@/data/queries';

interface RoutineBlockProps {
  entry: RoutineEntry;
}

export function RoutineBlock({ entry }: RoutineBlockProps) {
  const { colors, spacing, radius } = useTheme();

  const getIcon = () => {
    switch (entry.type) {
      case 'meal':
        return <Apple size={20} color={colors.primary} />;
      case 'nap':
        return <Moon size={20} color={colors.primary} />;
      case 'hygiene':
        return entry.value === 'Pañal' ? (
          <Baby size={20} color={colors.primary} />
        ) : (
          <Wind size={20} color={colors.primary} />
        );
      default:
        return null;
    }
  };

  return (
    <View
      style={{
        backgroundColor: colors.surfaceVariant,
        borderRadius: radius.md,
        padding: spacing.md,
        marginBottom: spacing.sm,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md }}>
        <View style={{ marginTop: spacing.xs }}>{getIcon()}</View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            {entry.time && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
                <Clock size={16} color={colors.onSurfaceVariant} />
                <Text style={{ fontSize: 14, fontWeight: '600' }}>
                  {entry.time}
                </Text>
              </View>
            )}
          </View>

          <Text style={{ fontSize: 14, fontWeight: '500', marginTop: spacing.xs }}>
            {entry.value}
          </Text>

          {entry.notes && (
            <Text style={{ fontSize: 12, color: colors.onSurfaceVariant, marginTop: spacing.xs }}>
              {entry.notes}
            </Text>
          )}

          {entry.signed_by && (
            <Text style={{ fontSize: 12, color: colors.onSurfaceVariant, marginTop: spacing.xs }}>
              {entry.signed_by}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

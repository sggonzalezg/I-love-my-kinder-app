import { View } from 'react-native';
import { Sun, Sunset } from 'lucide-react-native';
import { Text } from './text';
import { useTheme } from '@/theme/use-theme';
import type { ShiftName } from '@/lib/shift';

interface ShiftBandProps {
  shift: ShiftName;
  hours: string; // e.g. "08:00 - 13:00"
  teacher?: string;
  signature?: string;
}

export function ShiftBand({ shift, hours, teacher, signature }: ShiftBandProps) {
  const { colors, spacing, radius } = useTheme();

  const isMorning = shift === 'morning';
  const bgColor = isMorning ? colors.primary : colors.secondary;
  const textColor = isMorning ? colors.onPrimary : colors.onSecondary;

  return (
    <View
      style={{
        backgroundColor: bgColor,
        borderRadius: radius.md,
        padding: spacing.md,
        marginBottom: spacing.md,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm }}>
        {isMorning ? (
          <Sun size={20} color={textColor} />
        ) : (
          <Sunset size={20} color={textColor} />
        )}
        <Text style={{ fontSize: 16, fontWeight: '600', color: textColor }}>
          {isMorning ? 'Turno matutino' : 'Turno vespertino'}
        </Text>
      </View>

      <Text style={{ fontSize: 14, color: textColor, opacity: 0.9, marginBottom: spacing.xs }}>
        {hours}
      </Text>

      {teacher && (
        <Text style={{ fontSize: 14, color: textColor, opacity: 0.9 }}>
          {teacher}
        </Text>
      )}

      {signature && (
        <Text style={{ fontSize: 12, color: textColor, opacity: 0.8, marginTop: spacing.xs }}>
          {signature}
        </Text>
      )}
    </View>
  );
}

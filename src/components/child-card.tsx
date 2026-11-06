import { View, Image, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { Text } from './text';
import { Chip } from './chip';
import { useTheme } from '@/theme/use-theme';
import type { Child } from '@/data/queries';

interface ChildCardProps {
  child: Child;
  status?: 'enrolled' | 'withdrawn' | 'loading';
  routineStatus?: 'pending' | 'synced' | 'offline';
}

export function ChildCard({ child, status = 'enrolled', routineStatus }: ChildCardProps) {
  const { colors, spacing, radius } = useTheme();

  return (
    <Link
      href={`/day/${child.id}` as any}
      asChild
    >
      <Pressable
        style={{
          backgroundColor: colors.surface,
          borderRadius: radius.md,
          padding: spacing.md,
          marginBottom: spacing.md,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          {child.photo_url ? (
            <Image
              source={{ uri: child.photo_url }}
              style={{
                width: 48,
                height: 48,
                borderRadius: radius.full,
              }}
            />
          ) : (
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: radius.full,
                backgroundColor: colors.secondary,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: '600', color: colors.onSecondary }}>
                {child.name.substring(0, 1)}
              </Text>
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '600' }}>
              {child.name}
            </Text>
            <Text style={{ fontSize: 14, color: colors.onSurfaceVariant, marginTop: spacing.xs }}>
              {child.room} · {child.shift === 'morning' ? 'Matutino' : 'Vespertino'}
            </Text>
            <View style={{ flexDirection: 'row', gap: spacing.xs, marginTop: spacing.xs }}>
              {status === 'withdrawn' && (
                <Chip label="Sin inscripción" variant="grey" />
              )}
              {routineStatus === 'pending' && (
                <Chip label="Pendiente" variant="wait" />
              )}
              {routineStatus === 'synced' && (
                <Chip label="Sincronizado" variant="ok" />
              )}
              {routineStatus === 'offline' && (
                <Chip label="Sin conexión" variant="grey" />
              )}
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

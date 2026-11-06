import { View, ScrollView, Image, Pressable } from 'react-native';
import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/components/screen';
import { Text } from '@/components/text';
import { IconButton } from '@/components/icon-button';
import { ShiftBand } from '@/components/shift-band';
import { RoutineBlock } from '@/components/routine-block';
import { DaySeal } from '@/components/day-seal';
import { SegmentedControl } from '@/components/segmented-control';
import { Banner } from '@/components/banner';
import { useTheme } from '@/theme/use-theme';
import { getTodayRoutine, getChildrenForFamily } from '@/data/queries';
import { formatLongDate } from '@/lib/dates';
import type { ShiftName } from '@/lib/shift';
import { ChevronLeft } from 'lucide-react-native';

export default function DayScreen() {
  const { childId } = useLocalSearchParams<{ childId: string }>();
  const router = useRouter();
  const { colors, spacing, radius } = useTheme();
  const [selectedShift, setSelectedShift] = useState<ShiftName>('morning');

  const children = getChildrenForFamily();
  const child = children.find((c) => c.id === childId);
  const routine = child ? getTodayRoutine(child.id) : undefined;

  if (!child) {
    return (
      <Screen>
        <View style={{ padding: spacing.md }}>
          <Text>No se encontró el niño</Text>
        </View>
      </Screen>
    );
  }

  const filteredEntries = routine?.entries.filter((e) => {
    // In a real app, filter by shift
    return true;
  }) || [];

  const photoUrl = 'https://images.unsplash.com/photo-1503454537688-e6694e7fbb33?w=400';

  return (
    <Screen>
      <ScrollView style={{ flex: 1 }}>
        {/* Header with photo */}
        <View style={{ position: 'relative', height: 200, marginBottom: spacing.md }}>
          <Image
            source={{ uri: photoUrl }}
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: colors.surfaceVariant,
            }}
          />
          {/* Status bar scrim */}
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 40,
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
            }}
          />
          {/* Back button */}
          <Pressable
            onPress={() => router.back()}
            style={{
              position: 'absolute',
              top: spacing.md,
              left: spacing.md,
            }}
          >
            <View
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: radius.full,
                width: 36,
                height: 36,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ChevronLeft size={24} color={colors.onSurface} />
            </View>
          </Pressable>
        </View>

        <View style={{ paddingHorizontal: spacing.md }}>
          {/* Title */}
          <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: spacing.xs }}>
            Día de {child.name}
          </Text>

          {/* Date and room info */}
          <Text style={{ fontSize: 14, color: colors.onSurfaceVariant, marginBottom: spacing.md }}>
            {formatLongDate(new Date())} · {child.room} · Matutino
          </Text>

          {/* Shift selector if both shifts */}
          {child.second_shift && (
            <View style={{ marginBottom: spacing.md }}>
              <SegmentedControl
                options={[
                  { label: 'Matutino', value: 'morning' },
                  { label: 'Vespertino', value: 'afternoon' },
                ]}
                value={selectedShift}
                onChange={(v) => setSelectedShift(v as ShiftName)}
              />
            </View>
          )}

          {/* Shift band */}
          <ShiftBand
            shift={selectedShift}
            hours="08:00 - 13:00"
            teacher="Maestra Sofía"
            signature="Firmó la mañana"
          />

          {/* Seal */}
          <DaySeal
            teacher="Maestra Sofía"
            time="12:30"
            entryCount={filteredEntries.length}
          />

          {/* Routine blocks */}
          {filteredEntries.length > 0 && (
            <View>
              {filteredEntries.map((entry) => (
                <RoutineBlock key={entry.id} entry={entry} />
              ))}
            </View>
          )}

          {filteredEntries.length === 0 && (
            <Text style={{ color: colors.onSurfaceVariant, textAlign: 'center', marginVertical: spacing.lg }}>
              Sin registros en el turno seleccionado
            </Text>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

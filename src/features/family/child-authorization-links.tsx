import { router, type Href } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/avatar';
import { Text } from '@/components/text';
import { fetchFamilyChildren } from '@/data/family-room';
import { useAsync } from '@/data/use-async';
import { initials } from '@/lib/format';
import { radius, space } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

export function ChildAuthorizationLinks({ userId }: { userId: string }) {
  const c = useColors();
  const children = useAsync(() => fetchFamilyChildren(userId), userId);

  if (!children.data?.length) return null;

  return (
    <View style={styles.section}>
      <Text variant="section" color="muted">
        Autorizaciones por niño
      </Text>
      <View style={[styles.list, { backgroundColor: c.surface }]}>
        {children.data.map((child, index) => (
          <Pressable
            key={child.id}
            accessibilityRole="button"
            accessibilityLabel={`Autorizaciones de ${child.firstName}`}
            onPress={() => router.push(`/authorizations/${child.id}?name=${encodeURIComponent(child.firstName)}` as Href)}
            style={({ pressed }) => [
              styles.row,
              index > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.border },
              pressed && { backgroundColor: c.raised },
            ]}>
            <Avatar photoPath={child.photoPath} initials={initials(child.firstName)} />
            <View style={styles.rowText}>
              <Text variant="bodyStrong">{child.firstName}</Text>
              <Text variant="small" color="muted">
                Redes, visibilidad y salud
              </Text>
            </View>
            <ChevronRight size={20} color={c.muted} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: space.s2, marginTop: space.s2 },
  list: { borderRadius: radius.lg, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.s3, padding: space.s3 },
  rowText: { flex: 1 },
});

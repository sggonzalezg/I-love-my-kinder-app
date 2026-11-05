import type { BottomTabBarProps } from 'expo-router/tabs';
import { Calendar, House, Image, User, Users, type LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import { badgeText } from '@/lib/format';
import { cssEaseOut, duration } from '@/theme/motion';
import { fonts, radius, tabular } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

import { Text } from './text';

export const TAB_ICONS: Record<string, LucideIcon> = {
  index: House,
  room: Users,
  gallery: Image,
  calendar: Calendar,
  profile: User,
};

export function TabBar({ state, descriptors, navigateToTab, insets }: BottomTabBarProps) {
  const c = useColors();
  const reduced = useReducedMotion();

  return (
    <View style={[styles.bar, { backgroundColor: c.surface, paddingBottom: Math.max(insets.bottom, 8) }]} accessibilityRole="tablist">
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const focused = state.index === index;
        const label = options.title ?? route.name;
        const Icon = TAB_ICONS[route.name] ?? House;
        const color = focused ? c.blue : c.muted;
        const count = badgeText(typeof options.tabBarBadge === 'number' ? options.tabBarBadge : 0);

        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={count ? `${label}, ${count}` : label}
            onPress={() => !focused && navigateToTab(route.key)}
            style={styles.tab}>
            <Animated.View
              style={[
                styles.pill,
                {
                  backgroundColor: focused ? c.blue50 : 'transparent',
                  transitionProperty: 'backgroundColor',
                  transitionDuration: reduced ? 0 : duration.base,
                  transitionTimingFunction: cssEaseOut,
                },
              ]}>
              <Icon size={24} color={color} strokeWidth={1.8} />
            </Animated.View>
            <Text variant="tab" style={{ color }}>
              {label}
            </Text>
            {count && (
              <View style={[styles.badge, { backgroundColor: c.red }]}>
                <Text style={[styles.badgeText, { color: c.onRed }]}>{count}</Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', paddingTop: 6, paddingHorizontal: 4 },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2, minHeight: 52 },
  pill: { width: 56, height: 30, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: 4, left: '50%', marginLeft: 10, minWidth: 18, height: 18, paddingHorizontal: 5, borderRadius: 9, alignItems: 'center' },
  badgeText: { fontFamily: fonts.text700, fontSize: 11, lineHeight: 18, ...tabular },
});

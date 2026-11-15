import { Check, Clock, X, type LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import { RollingNumber } from '@/components/RollingNumber/RollingNumber';
import { Text } from '@/components/text';
import { OUTING_PERMISSIONS_COPY } from '@/features/outing-permissions/outing-permissions-copy';
import { useBackgroundColorStyles } from '@/theme/color-styles';
import { iconStroke, type ColorName } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

import { barGrowAnimation, barPartStyle, styles, TILE_ICON_SIZE } from './PermissionSummary.styles';

interface PermissionSummaryProps {
  authorized: number;
  declined: number;
  pending: number;
  outingDay: boolean;
}

interface Tile {
  key: string;
  count: number;
  label: string;
  icon: LucideIcon;
  background: ColorName;
  foreground: ColorName;
}

export function PermissionSummary({ authorized, declined, pending, outingDay }: PermissionSummaryProps) {
  const colors = useColors();
  const backgroundStyles = useBackgroundColorStyles();
  const reduced = useReducedMotion();
  const tiles: Tile[] = [
    { key: 'authorized', count: authorized, label: outingDay ? OUTING_PERMISSIONS_COPY.tileGoing : OUTING_PERMISSIONS_COPY.tileAuthorized, icon: Check, background: 'ok50', foreground: 'ok' },
    { key: 'declined', count: declined, label: OUTING_PERMISSIONS_COPY.tileDeclined, icon: X, background: 'red50', foreground: 'red' },
    { key: 'pending', count: pending, label: OUTING_PERMISSIONS_COPY.tilePending, icon: Clock, background: 'wait50', foreground: 'wait' },
  ];

  return (
    <View>
      <View style={styles.tiles}>
        {tiles.map(({ key, count, label, icon: Icon, background, foreground }) => (
          <View key={key} accessible accessibilityLabel={`${count} ${label}`} style={[styles.tile, backgroundStyles[background]]}>
            <RollingNumber value={count} style={styles.tileNumber} />
            <View style={styles.tileLabel}>
              <Icon size={TILE_ICON_SIZE} color={colors[foreground]} strokeWidth={iconStroke.bold} />
              <Text variant="caption" tone={foreground} style={styles.tileLabelText}>
                {label}
              </Text>
            </View>
          </View>
        ))}
      </View>
      {outingDay ? null : (
        <View style={styles.bar} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
          {tiles.map(({ key, count, foreground }) =>
            count > 0 ? <Animated.View key={key} style={[styles.barPart, barPartStyle(count), backgroundStyles[foreground], !reduced && barGrowAnimation]} /> : null,
          )}
        </View>
      )}
    </View>
  );
}

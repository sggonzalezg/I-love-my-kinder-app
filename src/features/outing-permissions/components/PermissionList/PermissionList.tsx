import { View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import { PermissionRow } from '@/features/outing-permissions/components/PermissionRow/PermissionRow';
import type { ChildPermissionRow } from '@/lib/outing-permissions';
import { listEntering } from '@/theme/motion';

import { styles, usePermissionListStyles } from './PermissionList.styles';

interface PermissionListProps {
  rows: ChildPermissionRow[];
}

export function PermissionList({ rows }: PermissionListProps) {
  const themed = usePermissionListStyles();
  const reduced = useReducedMotion();
  if (rows.length === 0) return null;
  return (
    <View style={[styles.list, themed.list]}>
      {rows.map((row, index) => (
        <Animated.View key={row.child.id} entering={listEntering(index, reduced)}>
          <PermissionRow row={row} isFirst={index === 0} />
        </Animated.View>
      ))}
    </View>
  );
}

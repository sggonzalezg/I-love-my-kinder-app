import { Check, Clock, X, type LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { Avatar } from '@/components/avatar';
import { Chip, type ChipVariant } from '@/components/chip';
import { Text } from '@/components/text';
import { PERMISSION_ROW_CHIPS } from '@/features/outing-permissions/outing-permissions-copy';
import { initials } from '@/lib/format';
import type { ChildPermissionRow, PermissionRowStatus } from '@/lib/outing-permissions';

import { styles, usePermissionRowStyles } from './PermissionRow.styles';

const STATUS_CHIPS: Record<PermissionRowStatus, { variant: ChipVariant; icon: LucideIcon }> = {
  authorized: { variant: 'ok', icon: Check },
  declined: { variant: 'red', icon: X },
  withdrawn: { variant: 'red', icon: X },
  pending: { variant: 'wait', icon: Clock },
};

interface PermissionRowProps {
  row: ChildPermissionRow;
  isFirst: boolean;
}

export function PermissionRow({ row, isFirst }: PermissionRowProps) {
  const themed = usePermissionRowStyles();
  const { child, status, meta } = row;
  const chip = STATUS_CHIPS[status];
  return (
    <View style={[styles.row, !isFirst && [styles.divided, themed.divider]]}>
      <Avatar photoPath={child.photoPath} initials={initials(child.firstName, child.lastName)} />
      <View style={styles.texts}>
        <Text variant="bodyStrong" numberOfLines={1}>
          {`${child.firstName} ${child.lastName}`.trim()}
        </Text>
        {meta ? (
          <Text variant="caption" tone="muted" numeric>
            {meta}
          </Text>
        ) : null}
      </View>
      <Chip label={PERMISSION_ROW_CHIPS[status]} icon={chip.icon} variant={chip.variant} />
    </View>
  );
}

import { useLocalSearchParams } from 'expo-router';
import { CheckCheck } from 'lucide-react-native';
import { useReducer } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { Skeleton } from '@/components/skeleton';
import { Text } from '@/components/text';
import { TopBar } from '@/components/top-bar';
import { NoGoCard } from '@/features/outing-permissions/components/NoGoCard/NoGoCard';
import { PermissionFilterChips } from '@/features/outing-permissions/components/PermissionFilterChips/PermissionFilterChips';
import { PermissionList } from '@/features/outing-permissions/components/PermissionList/PermissionList';
import { PermissionSummary } from '@/features/outing-permissions/components/PermissionSummary/PermissionSummary';
import { OUTING_PERMISSIONS_COPY } from '@/features/outing-permissions/outing-permissions-copy';
import {
  INITIAL_OUTING_PERMISSIONS_STATE,
  OUTING_PERMISSIONS_ACTIONS,
  outingPermissionsReducer,
  shownFilter,
} from '@/features/outing-permissions/outing-permissions-reducer';
import { useOutingPermissions } from '@/features/outing-permissions/use-outing-permissions';
import { goingHeading, initialPermissionFilter, permissionFilterChips, permissionTally, rowsForFilter, stayingNames } from '@/lib/outing-permissions';
import { useColors } from '@/theme/use-theme';

import { DONE_ICON_SIZE, SKELETON_ROW_HEIGHT, SKELETON_ROWS, SKELETON_TILES_HEIGHT, styles } from './OutingPermissionsScreen.styles';

export function OutingPermissionsScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const colors = useColors();
  const [state, dispatch] = useReducer(outingPermissionsReducer, INITIAL_OUTING_PERMISSIONS_STATE);
  const { subtitle, rows, outingDay, notFound, loading, failed, reload } = useOutingPermissions(eventId);
  const header = <TopBar title={OUTING_PERMISSIONS_COPY.title} subtitle={subtitle ?? undefined} backLabel={OUTING_PERMISSIONS_COPY.back} />;

  if (loading) {
    return (
      <Screen header={header}>
        <View style={styles.feedback}>
          <Skeleton height={SKELETON_TILES_HEIGHT} />
          {Array.from({ length: SKELETON_ROWS }, (_, index) => (
            <Skeleton key={index} height={SKELETON_ROW_HEIGHT} />
          ))}
        </View>
      </Screen>
    );
  }

  if (failed || notFound || !rows) {
    return (
      <Screen header={header}>
        <View style={styles.feedback}>
          <Text tone={failed ? 'red' : 'muted'}>{failed ? OUTING_PERMISSIONS_COPY.loadError : OUTING_PERMISSIONS_COPY.notFound}</Text>
          {failed ? <Button label={OUTING_PERMISSIONS_COPY.retry} variant="soft" onPress={reload} /> : null}
        </View>
      </Screen>
    );
  }

  const tally = permissionTally(rows);

  if (outingDay) {
    const staying = stayingNames(rows);
    const goingRows = rowsForFilter(rows, 'authorized');
    return (
      <Screen header={header}>
        {staying.length > 0 ? <NoGoCard names={staying} /> : null}
        <View style={styles.daySummary}>
          <PermissionSummary authorized={tally.authorized} declined={tally.declined} pending={tally.pending} outingDay />
        </View>
        <Text accessibilityRole="header" style={styles.goingHeading}>
          {goingHeading(goingRows.length)}
        </Text>
        <PermissionList rows={goingRows} />
        <View style={styles.bottom} />
      </Screen>
    );
  }

  const filter = shownFilter(state, initialPermissionFilter(rows));

  return (
    <Screen header={header}>
      <PermissionSummary authorized={tally.authorized} declined={tally.declined} pending={tally.pending} outingDay={false} />
      <PermissionFilterChips
        chips={permissionFilterChips(rows)}
        selected={filter}
        onSelect={(chosen) => dispatch({ type: OUTING_PERMISSIONS_ACTIONS.FILTER_CHOSEN, filter: chosen })}
      />
      <PermissionList key={filter} rows={rowsForFilter(rows, filter)} />
      {filter === 'all' ? (
        <Text variant="caption" tone="muted" style={styles.caption}>
          {OUTING_PERMISSIONS_COPY.onePermissionPerChild}
        </Text>
      ) : null}
      {tally.pending === 0 ? (
        <View style={styles.done}>
          <CheckCheck size={DONE_ICON_SIZE} color={colors.ok} />
          <Text variant="smallStrong" tone="ok">
            {OUTING_PERMISSIONS_COPY.everyoneAnswered}
          </Text>
        </View>
      ) : null}
      <View style={styles.bottom} />
    </Screen>
  );
}

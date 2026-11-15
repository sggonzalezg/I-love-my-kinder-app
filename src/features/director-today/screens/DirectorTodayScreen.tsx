import { Fragment, useReducer } from 'react';
import { View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import { Button } from '@/components/button';
import { EmptyState } from '@/components/empty-state';
import { Screen } from '@/components/screen';
import { Skeleton } from '@/components/skeleton';
import { Text } from '@/components/text';
import { TopBar } from '@/components/top-bar';
import { useSession } from '@/data/session';
import { SupervisionRow } from '@/features/director-today/components/SupervisionRow/SupervisionRow';
import { DIRECTOR_TODAY_COPY } from '@/features/director-today/director-today-copy';
import { INITIAL_SUPERVISION_STATE, SUPERVISION_ACTIONS, supervisionReducer } from '@/features/director-today/supervision-reducer';
import { useDirectorToday } from '@/features/director-today/use-director-today';
import { useUnreadChatThreads } from '@/features/chat/use-unread-chat-threads';
import { TodayActions } from '@/features/family-today/components/TodayActions/TodayActions';
import { TodayProgress } from '@/features/teacher-day/components/TodayProgress/TodayProgress';
import { formatLongDate } from '@/lib/dates';
import { supervisionTotals } from '@/lib/director-today';
import { listEntering } from '@/theme/motion';

import { SKELETON_ROW_HEIGHT, SKELETON_ROWS, styles, useDirectorTodayStyles } from './DirectorTodayScreen.styles';

// The direction is not an announcement recipient, so her bell has no unread count.
const DIRECTOR_UNREAD_NOTICES = 0;

export function DirectorTodayScreen() {
  const reduced = useReducedMotion();
  const themed = useDirectorTodayStyles();
  const { session } = useSession();
  const unreadChats = useUnreadChatThreads(session?.user_id ?? null);
  const { groups, loading, failed, reload } = useDirectorToday();
  const [state, dispatch] = useReducer(supervisionReducer, INITIAL_SUPERVISION_STATE);

  const header = (
    <TopBar
      title={DIRECTOR_TODAY_COPY.title}
      subtitle={formatLongDate(new Date())}
      right={<TodayActions unreadNotices={DIRECTOR_UNREAD_NOTICES} unreadChats={unreadChats} />}
    />
  );

  if (failed) {
    return (
      <Screen header={header}>
        <View style={styles.error}>
          <Text tone="red">{DIRECTOR_TODAY_COPY.loadError}</Text>
          <Button label={DIRECTOR_TODAY_COPY.retry} variant="soft" onPress={reload} />
        </View>
      </Screen>
    );
  }

  if (loading || groups === null) {
    return (
      <Screen header={header}>
        <View style={styles.skeleton}>
          <Skeleton height={SKELETON_ROW_HEIGHT} />
          {Array.from({ length: SKELETON_ROWS }, (_, index) => (
            <Skeleton key={index} height={SKELETON_ROW_HEIGHT} />
          ))}
        </View>
      </Screen>
    );
  }

  if (groups.length === 0) {
    return (
      <Screen header={header}>
        <EmptyState title={DIRECTOR_TODAY_COPY.emptyTitle} description={DIRECTOR_TODAY_COPY.emptyHint} />
      </Screen>
    );
  }

  const totals = supervisionTotals(groups);

  return (
    <Screen header={header}>
      <TodayProgress ready={totals.logged} total={totals.total} ofLabel={DIRECTOR_TODAY_COPY.loggedOf(totals.total)} />
      <View style={[styles.list, themed.list]}>
        {groups.map((group, index) => (
          <Fragment key={group.key}>
            {index > 0 ? <View style={[styles.separator, themed.separator]} /> : null}
            <Animated.View entering={listEntering(index, reduced)}>
              <SupervisionRow
                group={group}
                open={state.openGroupKeys.includes(group.key)}
                onToggle={() => dispatch({ type: SUPERVISION_ACTIONS.GROUP_TOGGLED, groupKey: group.key })}
              />
            </Animated.View>
          </Fragment>
        ))}
      </View>
    </Screen>
  );
}

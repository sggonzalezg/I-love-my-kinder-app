import { router, type Href } from 'expo-router';
import { Clock } from 'lucide-react-native';
import { useEffect, useReducer } from 'react';
import { View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import { Banner } from '@/components/banner';
import { EmptyState } from '@/components/empty-state';
import { Screen } from '@/components/screen';
import { Text } from '@/components/text';
import { TopBar } from '@/components/top-bar';
import { fetchChatThreadSummaries, fetchThreadRosters } from '@/data/chat';
import { fetchFamilyChildren } from '@/data/family-room';
import { useSession } from '@/data/session';
import type { AuthSession } from '@/data/types';
import { useAsync } from '@/data/use-async';
import { useReloadOnRefocus } from '@/data/use-reload-on-refocus';
import { childNamesInGroup } from '@/lib/chat';
import { ALL_CHATS_FILTER, chatFilterChips, matchesChatFilter } from '@/lib/chat-filters';
import { listEntering } from '@/theme/motion';

import { CHAT_COPY } from './chat-copy';
import { ChatFilterChips } from './chat-filter-chips';
import { CHAT_LIST_ACTIONS, INITIAL_CHAT_LIST_STATE, chatListReducer } from './chat-list-reducer';
import { styles } from './chat-list-screen.styles';
import { ChatListSkeleton } from './chat-list-skeleton';
import { ChatLoadError } from './chat-load-error';
import { ChatNoticeGate } from './chat-notice-gate';
import { ChatThreadRow } from './chat-thread-row';
import { useOffHoursText } from './use-off-hours-text';

const header = <TopBar title={CHAT_COPY.title} backLabel={CHAT_COPY.backToToday} />;

export function ChatListScreen() {
  const { session } = useSession();
  if (!session) {
    return (
      <Screen header={header}>
        <ChatListSkeleton />
      </Screen>
    );
  }
  return (
    <ChatNoticeGate session={session} header={header}>
      <ChatList session={session} />
    </ChatNoticeGate>
  );
}

function openThread(threadId: string) {
  router.push(`/chat/${threadId}` as Href);
}

function ChatList({ session }: { session: AuthSession }) {
  const { user_id: userId, active_role: role } = session;
  const reduced = useReducedMotion();
  const [state, dispatch] = useReducer(chatListReducer, INITIAL_CHAT_LIST_STATE);
  const summaries = useAsync(() => fetchChatThreadSummaries(userId), userId);
  const threads = summaries.data?.map((summary) => summary.thread) ?? [];
  const rosters = useAsync(() => fetchThreadRosters(threads), summaries.data ? threads.map((thread) => thread.id).join(',') : null);
  const familyChildren = useAsync(() => fetchFamilyChildren(userId), role === 'family' ? userId : null);
  const offHoursText = useOffHoursText(role, userId);
  useReloadOnRefocus(summaries.reload);
  const onlyThreadId = summaries.data?.length === 1 ? summaries.data[0].thread.id : null;
  const now = new Date();

  const showFilters = role === 'director' && threads.length > 1;
  const filterChips = showFilters ? chatFilterChips(threads) : [];
  const filter = filterChips.find((chip) => chip.key === state.filterKey)?.filter ?? ALL_CHATS_FILTER;
  const rosterOf = (threadId: string) => rosters.data?.get(threadId) ?? null;
  const shownSummaries = (summaries.data ?? []).filter((summary) =>
    matchesChatFilter(summary.thread, rosterOf(summary.thread.id)?.teachers.length ?? null, filter),
  );

  useEffect(() => {
    if (onlyThreadId) router.replace(`/chat/${onlyThreadId}` as Href);
  }, [onlyThreadId]);

  return (
    <Screen header={header}>
      {offHoursText ? <Banner kind="info" icon={Clock} text={offHoursText} /> : null}
      {summaries.failed ? <ChatLoadError onRetry={summaries.reload} /> : null}
      {summaries.loading || onlyThreadId ? <ChatListSkeleton /> : null}
      {summaries.data?.length === 0 ? <EmptyState title={CHAT_COPY.noThreadsTitle} description={CHAT_COPY.noThreadsBody} /> : null}
      {showFilters ? (
        <ChatFilterChips chips={filterChips} selectedKey={state.filterKey} onSelect={(key) => dispatch({ type: CHAT_LIST_ACTIONS.FILTER_SELECTED, key })} />
      ) : null}
      {showFilters && shownSummaries.length === 0 ? (
        <Text variant="small" color="muted">
          {CHAT_COPY.noThreadsForFilter}
        </Text>
      ) : null}
      {summaries.data && summaries.data.length > 1 ? (
        <View style={styles.list}>
          {shownSummaries.map((summary, index) => (
            <Animated.View key={summary.thread.id} entering={listEntering(index, reduced)}>
              <ChatThreadRow
                summary={summary}
                roster={rosterOf(summary.thread.id)}
                userId={userId}
                viewer={role}
                childNames={familyChildren.data ? childNamesInGroup(familyChildren.data, summary.thread) : []}
                now={now}
                onOpen={() => openThread(summary.thread.id)}
              />
            </Animated.View>
          ))}
        </View>
      ) : null}
    </Screen>
  );
}

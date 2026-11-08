import { router } from 'expo-router';
import { CircleAlert, Clock } from 'lucide-react-native';
import { FlatList, KeyboardAvoidingView, Platform, View } from 'react-native';

import { Banner } from '@/components/banner';
import { EmptyState } from '@/components/empty-state';
import { Screen } from '@/components/screen';
import { Text } from '@/components/text';
import { TopBar } from '@/components/top-bar';
import { CHAT_LIST_ROUTE } from '@/constants/chat';
import { fetchChatThread, type ChatThread } from '@/data/chat';
import { fetchRoomRoster } from '@/data/family-room';
import { useSession } from '@/data/session';
import type { AuthSession } from '@/data/types';
import { useAsync } from '@/data/use-async';
import { CHAT_FIXED } from '@/legal/texts';
import { chatListItems, membersLine, seenByCount, type ChatListItem } from '@/lib/chat';

import { ChatComposer } from './chat-composer';
import { CHAT_COPY } from './chat-copy';
import { ChatListSkeleton } from './chat-list-skeleton';
import { ChatLoadError } from './chat-load-error';
import { ChatMembersSheet } from './chat-members-sheet';
import { ChatNoticeGate } from './chat-notice-gate';
import { ChatThreadHeader } from './chat-thread-header';
import { CHAT_THREAD_ACTIONS, displayedMessages, isNewSinceOpen, type DisplayedMessage } from './chat-thread-reducer';
import { styles } from './chat-thread-screen.styles';
import { ChatUnavailable } from './chat-unavailable';
import { MessageBubble } from './message-bubble';
import { UrgentLine } from './urgent-line';
import { useChatThread } from './use-chat-thread';
import { useOffHoursText } from './use-off-hours-text';

const listHeader = <TopBar title={CHAT_COPY.title} backLabel={CHAT_COPY.backToChats} />;

function backToChats() {
  if (router.canGoBack()) router.back();
  else router.replace(CHAT_LIST_ROUTE);
}

export function ChatThreadScreen({ threadId }: { threadId: string }) {
  const { session } = useSession();
  const thread = useAsync(() => fetchChatThread(threadId), threadId);

  if (!session || thread.loading) {
    return (
      <Screen header={listHeader}>
        <ChatListSkeleton />
      </Screen>
    );
  }
  if (thread.failed) {
    return (
      <Screen header={listHeader}>
        <ChatLoadError onRetry={thread.reload} />
      </Screen>
    );
  }
  if (!thread.data) {
    return (
      <Screen header={listHeader} bleed>
        <ChatUnavailable role={session.active_role} />
      </Screen>
    );
  }
  return (
    <ChatNoticeGate session={session} header={listHeader}>
      <ChatThreadView thread={thread.data} session={session} />
    </ChatNoticeGate>
  );
}

function ChatThreadView({ thread, session }: { thread: ChatThread; session: AuthSession }) {
  const { user_id: userId, active_role: role, nursery_urgent_phone: urgentPhone } = session;
  const { state, dispatch, send, retry, loading, loadFailed, reload } = useChatThread(thread.id, userId);
  const roster = useAsync(() => fetchRoomRoster(thread), thread.id);
  const offHoursText = useOffHoursText(role, userId);

  const messages = displayedMessages(state, userId);
  const items = chatListItems(messages, new Date()).reverse();
  const teacherNames = roster.data?.teachers.map((teacher) => `${teacher.first_name} ${teacher.last_name}`) ?? [];
  const familyCount = roster.data?.children.length ?? 0;
  const withoutTeacher = roster.data !== null && teacherNames.length === 0;

  function renderItem({ item }: { item: ChatListItem<DisplayedMessage> }) {
    if (item.kind === 'day') {
      return (
        <Text variant="caption" color="muted" style={styles.daySeparator}>
          {item.title}
        </Text>
      );
    }
    return (
      <MessageBubble
        message={item.message}
        own={item.message.senderId === userId}
        seenBy={seenByCount(item.message, state.reads)}
        animateEntry={isNewSinceOpen(state, item.key)}
        onRetry={retry}
      />
    );
  }

  return (
    <Screen
      bleed
      header={
        <ChatThreadHeader
          title={thread.label}
          membersLine={roster.data ? membersLine({ familyCount, teacherNames, viewer: role }) : null}
          onBack={backToChats}
          onOpenMembers={() => dispatch({ type: CHAT_THREAD_ACTIONS.MEMBERS_OPENED })}
        />
      }>
      <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {role === 'director' ? null : <UrgentLine phone={urgentPhone} />}
        <View style={styles.banners}>
          {withoutTeacher && role !== 'director' ? <Banner kind="offline" icon={CircleAlert} text={CHAT_FIXED.noTeacher(urgentPhone)} /> : null}
          {offHoursText ? <Banner kind="info" icon={Clock} text={offHoursText} /> : null}
          {loadFailed && messages.length > 0 ? <Banner kind="offline" text={CHAT_COPY.offline} /> : null}
          {loadFailed && messages.length === 0 ? <ChatLoadError onRetry={reload} /> : null}
        </View>
        {loading ? (
          <View style={styles.loading}>
            <ChatListSkeleton />
          </View>
        ) : null}
        {!loading && !loadFailed && messages.length === 0 ? (
          <View style={styles.empty}>
            <EmptyState title={CHAT_COPY.emptyTitle} description={CHAT_COPY.emptyBody(familyCount)} />
          </View>
        ) : null}
        {messages.length > 0 ? (
          <FlatList
            inverted
            data={items}
            keyExtractor={(item) => item.key}
            renderItem={renderItem}
            contentContainerStyle={styles.messages}
            keyboardShouldPersistTaps="handled"
          />
        ) : null}
        <ChatComposer draft={state.draft} onChangeDraft={(text) => dispatch({ type: CHAT_THREAD_ACTIONS.DRAFT_CHANGED, text })} onSend={send} />
      </KeyboardAvoidingView>
      <ChatMembersSheet
        visible={state.membersOpen}
        title={thread.label}
        roster={roster.data}
        onClose={() => dispatch({ type: CHAT_THREAD_ACTIONS.MEMBERS_CLOSED })}
      />
    </Screen>
  );
}

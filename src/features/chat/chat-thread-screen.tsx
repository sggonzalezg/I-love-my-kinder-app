import { router } from 'expo-router';
import { CircleAlert, Clock } from 'lucide-react-native';
import { FlatList, KeyboardAvoidingView, View } from 'react-native';

import { Banner } from '@/components/banner';
import { EmptyState } from '@/components/empty-state';
import { Screen } from '@/components/screen';
import { Text } from '@/components/text';
import { TopBar } from '@/components/top-bar';
import { CHAT_LIST_ROUTE } from '@/constants/chat';
import { fetchChatThread, type ChatThread } from '@/data/chat';
import { fetchRoomRoster } from '@/data/family-room';
import { fetchFamilyGalleryChildren } from '@/data/gallery';
import { useSession } from '@/data/session';
import type { AuthSession } from '@/data/types';
import { useAsync } from '@/data/use-async';
import { CHAT_FIXED } from '@/legal/texts';
import { chatListItems, membersLine, seenByCount, senderLine, type ChatListItem } from '@/lib/chat';
import { chatPhotoVisibility } from '@/lib/chat-photo';

import { ChatComposer } from './chat-composer';
import { CHAT_COPY } from './chat-copy';
import { ChatListSkeleton } from './chat-list-skeleton';
import { ChatLoadError } from './chat-load-error';
import { ChatMembersSheet } from './chat-members-sheet';
import { ChatNoticeGate } from './chat-notice-gate';
import { ChatPhotoSourceSheet } from './chat-photo-source-sheet';
import { ChatPhotoViewer } from './chat-photo-viewer';
import { ChatThreadHeader } from './chat-thread-header';
import { CHAT_THREAD_ACTIONS, canSend, displayedMessages, isNewSinceOpen, type DisplayedMessage } from './chat-thread-reducer';
import { styles } from './chat-thread-screen.styles';
import { ChatUnavailable } from './chat-unavailable';
import { MessageBubble } from './message-bubble';
import { UrgentLine } from './urgent-line';
import { useChatPhoto } from './use-chat-photo';
import { useChatThread } from './use-chat-thread';
import { useOffHoursText } from './use-off-hours-text';

// Android is edge-to-edge, so the window no longer resizes for the keyboard and needs the padding too.
const KEYBOARD_BEHAVIOR = 'padding';

const listHeader =<TopBar title={CHAT_COPY.title} backLabel={CHAT_COPY.backToChats} />;

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
  const { user_id: userId, active_role: role, nursery_id: nurseryId, nursery_urgent_phone: urgentPhone } = session;
  const { state, dispatch, send, retry, loading, loadFailed, reload } = useChatThread(thread.id, userId);
  const photo = useChatPhoto(state, dispatch, { nurseryId, threadId: thread.id });
  const roster = useAsync(() => fetchRoomRoster(thread), thread.id);
  const familyChildren = useAsync(() => fetchFamilyGalleryChildren(userId), role === 'family' ? userId : null);
  const offHoursText = useOffHoursText(role, userId);

  const messages = displayedMessages(state, userId);
  const items = chatListItems(messages, new Date()).reverse();
  const familyEnrollments = familyChildren.data?.flatMap((child) => child.enrollments) ?? null;
  const teacherNames = roster.data?.teachers.map((teacher) => `${teacher.first_name} ${teacher.last_name}`) ?? [];
  const familyCount = roster.data?.children.length ?? 0;
  const withoutTeacher = roster.data !== null && teacherNames.length === 0;
  const viewedItem = items.find((item) => item.kind === 'message' && item.key === state.viewerKey);
  const viewedMessage = viewedItem?.kind === 'message' ? viewedItem.message : null;

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
        photoVisibility={chatPhotoVisibility(role, item.message.createdAt, thread, familyEnrollments)}
        onRetry={retry}
        onOpenPhoto={() => dispatch({ type: CHAT_THREAD_ACTIONS.VIEWER_OPENED, key: item.key })}
      />
    );
  }

  // The avoiding view wraps the whole screen: it measures its frame from the window top, so the keyboard offset is right.
  return (
    <KeyboardAvoidingView style={styles.root} behavior={KEYBOARD_BEHAVIOR}>
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
        {role === 'director' ? null : <UrgentLine phone={urgentPhone} />}
        <View style={styles.banners}>
          {withoutTeacher && role !== 'director' ? <Banner kind="offline" icon={CircleAlert} text={CHAT_FIXED.noTeacher(urgentPhone)} /> : null}
          {offHoursText ? <Banner kind="info" icon={Clock} text={offHoursText} /> : null}
          {loadFailed && messages.length > 0 ? <Banner kind="offline" text={CHAT_COPY.offline} /> : null}
          {loadFailed && messages.length === 0 ? <ChatLoadError onRetry={reload} /> : null}
        </View>
        <View style={styles.root}>
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
        </View>
        <ChatComposer
          draft={state.draft}
          canSend={canSend(state)}
          attachment={state.attachment}
          cameraDenied={state.cameraDenied}
          onChangeDraft={(text) => dispatch({ type: CHAT_THREAD_ACTIONS.DRAFT_CHANGED, text })}
          onSend={send}
          onAddPhoto={() => dispatch({ type: CHAT_THREAD_ACTIONS.PHOTO_SOURCE_OPENED })}
          onRemovePhoto={() => dispatch({ type: CHAT_THREAD_ACTIONS.ATTACHMENT_REMOVED })}
          onRetryUpload={photo.retryUpload}
          onOpenSettings={photo.openSettings}
        />
        <ChatMembersSheet
          visible={state.membersOpen}
          title={thread.label}
          roster={roster.data}
          onClose={() => dispatch({ type: CHAT_THREAD_ACTIONS.MEMBERS_CLOSED })}
        />
        <ChatPhotoSourceSheet
          visible={state.photoSourceOpen}
          onChoose={photo.choose}
          onClose={() => dispatch({ type: CHAT_THREAD_ACTIONS.PHOTO_SOURCE_CLOSED })}
          onDismiss={photo.onSourceSheetDismissed}
        />
        {viewedMessage ? (
          <ChatPhotoViewer
            message={viewedMessage}
            senderLine={viewedMessage.senderId === userId ? CHAT_COPY.you : senderLine(viewedMessage.senderRole, viewedMessage.senderLabel)}
            onClose={() => dispatch({ type: CHAT_THREAD_ACTIONS.VIEWER_CLOSED })}
          />
        ) : null}
      </Screen>
    </KeyboardAvoidingView>
  );
}

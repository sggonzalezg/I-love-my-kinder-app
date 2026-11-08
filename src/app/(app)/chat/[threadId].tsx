import { useLocalSearchParams } from 'expo-router';

import { ChatThreadScreen } from '@/features/chat/chat-thread-screen';

export default function ChatThreadRoute() {
  const { threadId } = useLocalSearchParams<{ threadId: string }>();
  return <ChatThreadScreen threadId={threadId} />;
}

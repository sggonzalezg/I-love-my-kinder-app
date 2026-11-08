import { router } from 'expo-router';
import { MessageSquare } from 'lucide-react-native';

import { CHAT_LIST_ROUTE } from '@/constants/chat';
import { chatIconLabel } from '@/lib/format';

import { IconButton } from './icon-button';

export function ChatIcon({ unreadThreads = 0 }: { unreadThreads?: number }) {
  return <IconButton icon={MessageSquare} label={chatIconLabel(unreadThreads)} badge={unreadThreads} onPress={() => router.push(CHAT_LIST_ROUTE)} />;
}

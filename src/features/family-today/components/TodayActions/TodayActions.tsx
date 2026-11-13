import { router } from 'expo-router';
import { Bell } from 'lucide-react-native';
import { View } from 'react-native';

import { ChatIcon } from '@/components/chat-icon';
import { IconButton } from '@/components/icon-button';
import { NOTICES_ROUTE } from '@/constants/routes';
import { bellLabel } from '@/lib/format';

import { styles } from './TodayActions.styles';

interface TodayActionsProps {
  unreadNotices: number;
  unreadChats: number;
}

export function TodayActions({ unreadNotices, unreadChats }: TodayActionsProps) {
  return (
    <View style={styles.actions}>
      <ChatIcon unreadThreads={unreadChats} />
      <IconButton icon={Bell} label={bellLabel(unreadNotices)} badge={unreadNotices} onPress={() => router.push(NOTICES_ROUTE)} />
    </View>
  );
}

import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Bell } from 'lucide-react-native';
import { View } from 'react-native';

import { ChatIcon } from '@/components/chat-icon';
import { IconButton } from '@/components/icon-button';
import { Text } from '@/components/text';
import { NOTICES_ROUTE } from '@/constants/routes';
import { FAMILY_TODAY_COPY } from '@/features/family-today/family-today-copy';
import { bellLabel } from '@/lib/format';
import { useBackgroundColorStyles } from '@/theme/color-styles';

import { styles } from './FamilyTodayTopBar.styles';

interface FamilyTodayTopBarProps {
  greeting: string;
  unreadNotices: number;
  unreadChats: number;
}

export function FamilyTodayTopBar({ greeting, unreadNotices, unreadChats }: FamilyTodayTopBarProps) {
  const backgroundStyles = useBackgroundColorStyles();

  return (
    <View style={styles.bar}>
      <View style={[styles.logoPlate, backgroundStyles.white]}>
        <Image source={require('@/assets/images/logo-client.png')} style={styles.logo} contentFit="contain" accessibilityLabel={FAMILY_TODAY_COPY.logo} />
      </View>
      <Text variant="title" accessibilityRole="header" numberOfLines={1} style={styles.greeting}>
        {greeting}
      </Text>
      <View style={styles.actions}>
        <ChatIcon unreadThreads={unreadChats} />
        <IconButton icon={Bell} label={bellLabel(unreadNotices)} badge={unreadNotices} onPress={() => router.push(NOTICES_ROUTE)} />
      </View>
    </View>
  );
}

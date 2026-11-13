import { Image } from 'expo-image';
import { View } from 'react-native';

import { Text } from '@/components/text';
import { TodayActions } from '@/features/family-today/components/TodayActions/TodayActions';
import { FAMILY_TODAY_COPY } from '@/features/family-today/family-today-copy';
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
      <TodayActions unreadNotices={unreadNotices} unreadChats={unreadChats} />
    </View>
  );
}

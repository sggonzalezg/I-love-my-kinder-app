import { Image } from 'expo-image';
import { Lock } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { View } from 'react-native';

import { AccountChip } from '@/components/AccountChip/AccountChip';
import { Text } from '@/components/text';
import { iconStroke } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

import { LOCK_ICON_SIZE, styles } from './BlockedNotice.styles';

const CRAYONS_PHOTO = require('@/assets/images/crayons-stephen-andrews.jpg');

interface BlockedNoticeProps {
  title: string;
  body?: string;
  /** The email that was tried, shown in a chip so the person sees which account the nursery did not recognize. */
  email?: string;
  withPhoto?: boolean;
  children: ReactNode;
}

export function BlockedNotice({ title, body, email, withPhoto = false, children }: BlockedNoticeProps) {
  const colors = useColors();
  return (
    <View style={styles.root}>
      {withPhoto ? (
        <Image source={CRAYONS_PHOTO} style={styles.illustration} contentFit="cover" accessibilityElementsHidden importantForAccessibility="no" />
      ) : (
        <Lock size={LOCK_ICON_SIZE} color={colors.muted} strokeWidth={iconStroke.regular} />
      )}
      {email ? (
        <AccountChip email={email} />
      ) : null}
      <Text variant="title" accessibilityRole="header" style={styles.title}>
        {title}
      </Text>
      {body ? <Text style={styles.body}>{body}</Text> : null}
      <View style={styles.actions}>{children}</View>
    </View>
  );
}

import { Image, View } from 'react-native';

import { useSignedUrl } from '@/data/use-signed-url';
import { useBackgroundColorStyles } from '@/theme/color-styles';

import { avatarFrameStyle, initialsFontStyle, styles } from './avatar.styles';
import { Text } from './text';

export const AVATAR_SIZE = { md: 44, lg: 64, xl: 96 } as const;

interface AvatarProps {
  photoPath: string | null;
  initials: string;
  size?: keyof typeof AVATAR_SIZE;
}

export function Avatar({ photoPath, initials, size = 'md' }: AvatarProps) {
  const backgroundStyles = useBackgroundColorStyles();
  const url = useSignedUrl(photoPath);
  const side = AVATAR_SIZE[size];

  if (url) return <Image source={{ uri: url }} style={avatarFrameStyle(side)} accessibilityIgnoresInvertColors />;

  return (
    <View style={[avatarFrameStyle(side), styles.initials, backgroundStyles.blue50]}>
      <Text tone="blue" style={[styles.initialsText, initialsFontStyle(side)]}>
        {initials}
      </Text>
    </View>
  );
}

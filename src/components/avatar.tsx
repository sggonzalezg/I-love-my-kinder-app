import { Image, StyleSheet, View } from 'react-native';

import { useSignedUrl } from '@/data/use-signed-url';
import { fonts, radius } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';
import { Text } from './text';

export const AVATAR_SIZE = { md: 44, lg: 64, xl: 96 } as const;

interface AvatarProps {
  photoPath: string | null;
  initials: string;
  size?: keyof typeof AVATAR_SIZE;
}

export function Avatar({ photoPath, initials, size = 'md' }: AvatarProps) {
  const c = useColors();
  const url = useSignedUrl(photoPath);
  const side = AVATAR_SIZE[size];
  const frame = { width: side, height: side, borderRadius: radius.full };

  if (url) return <Image source={{ uri: url }} style={frame} accessibilityIgnoresInvertColors />;

  return (
    <View style={[frame, styles.initials, { backgroundColor: c.blue50 }]}>
      <Text style={[styles.initialsText, { color: c.blue, fontSize: side * 0.36 }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  initials: { alignItems: 'center', justifyContent: 'center' },
  initialsText: { fontFamily: fonts.text700 },
});

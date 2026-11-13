import { Image } from 'expo-image';
import type { ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/text';
import { useSignedUrl } from '@/data/use-signed-url';
import { CHILD_DAY_COPY } from '@/features/child-day/child-day-copy';
import { StoryScrim } from '@/features/gallery/story-scrim';
import { useBackgroundColorStyles } from '@/theme/color-styles';

import { overlayTopStyle, styles } from './DayPhotoHeader.styles';

interface DayPhotoHeaderProps {
  photoPath: string | null;
  firstName: string;
  initials: string;
  leading: ReactNode;
  center: ReactNode;
  trailing: ReactNode;
}

/** Design round 9: a neutral dark scrim keeps the white status bar legible on bright photos. */
export function DayPhotoHeader({ photoPath, firstName, initials, leading, center, trailing }: DayPhotoHeaderProps) {
  const backgroundStyles = useBackgroundColorStyles();
  const insets = useSafeAreaInsets();
  const url = useSignedUrl(photoPath);

  return (
    <View style={styles.header}>
      {url ? (
        <Image source={{ uri: url }} style={styles.photo} contentFit="cover" accessibilityLabel={CHILD_DAY_COPY.photo(firstName)} />
      ) : (
        <View style={[styles.initialsPlate, backgroundStyles.blue50]} importantForAccessibility="no-hide-descendants">
          <Text tone="blue" style={styles.initials}>
            {initials}
          </Text>
        </View>
      )}
      <StoryScrim edge="top" />
      <View style={[styles.overlay, overlayTopStyle(insets.top)]}>
        {leading}
        <View style={styles.center}>{center}</View>
        {trailing}
      </View>
    </View>
  );
}

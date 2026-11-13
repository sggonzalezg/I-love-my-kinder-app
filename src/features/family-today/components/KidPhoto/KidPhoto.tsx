import { Image, View } from 'react-native';

import { Text } from '@/components/text';
import { useSignedUrl } from '@/data/use-signed-url';
import { FAMILY_TODAY_COPY } from '@/features/family-today/family-today-copy';
import { useBackgroundColorStyles } from '@/theme/color-styles';

import { styles } from './KidPhoto.styles';

interface KidPhotoProps {
  photoPath: string | null;
  firstName: string;
  initials: string;
}

export function KidPhoto({ photoPath, firstName, initials }: KidPhotoProps) {
  const backgroundStyles = useBackgroundColorStyles();
  const url = useSignedUrl(photoPath);

  if (url) return <Image source={{ uri: url }} style={styles.photo} accessibilityLabel={FAMILY_TODAY_COPY.kidPhoto(firstName)} accessibilityIgnoresInvertColors />;

  return (
    <View style={[styles.photo, styles.initials, backgroundStyles.blue100]} importantForAccessibility="no-hide-descendants">
      <Text tone="blue" style={styles.initialsText}>
        {initials}
      </Text>
    </View>
  );
}

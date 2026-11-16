import { Image, View } from 'react-native';

import { Text } from '@/components/text';
import { useSignedUrl } from '@/data/use-signed-url';
import { FIRST_SIGN_IN_COPY } from '@/features/first-sign-in-authorizations/first-sign-in-copy';
import { childGroupsLine } from '@/lib/first-sign-in-authorizations';
import { initials } from '@/lib/format';
import type { FamilyChild } from '@/lib/room-groups';
import { useBackgroundColorStyles } from '@/theme/color-styles';

import { styles } from './ChildStepHeader.styles';

interface ChildStepHeaderProps {
  kid: FamilyChild;
}

export function ChildStepHeader({ kid }: ChildStepHeaderProps) {
  const backgroundStyles = useBackgroundColorStyles();
  const photoUrl = useSignedUrl(kid.photoPath);

  return (
    <View style={styles.header}>
      {photoUrl ? (
        <Image source={{ uri: photoUrl }} style={styles.photo} accessibilityLabel={FIRST_SIGN_IN_COPY.photo(kid.firstName)} accessibilityIgnoresInvertColors />
      ) : (
        <View style={[styles.photo, styles.initials, backgroundStyles.blue100]} importantForAccessibility="no-hide-descendants">
          <Text tone="blue" style={styles.initialsText}>
            {initials(kid.firstName, kid.lastName)}
          </Text>
        </View>
      )}
      <View style={styles.titles}>
        <Text variant="title" accessibilityRole="header">
          {FIRST_SIGN_IN_COPY.title(kid.firstName)}
        </Text>
        <Text variant="small" tone="muted">
          {childGroupsLine(kid.groups)}
        </Text>
      </View>
    </View>
  );
}

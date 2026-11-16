import { View } from 'react-native';

import { Avatar } from '@/components/avatar';
import { Button } from '@/components/button';
import { Text } from '@/components/text';
import { DIRECTOR_CHILDREN_COPY } from '@/features/director-children/director-children-copy';
import { size } from '@/theme/tokens';

import { styles } from './ChildPhotoField.styles';

interface ChildPhotoFieldProps {
  photoPath: string | null;
  initials: string;
  uploading: boolean;
  failed: boolean;
  cameraDenied: boolean;
  disabled: boolean;
  onChange: () => void;
  onOpenSettings: () => void;
}

export function ChildPhotoField({ photoPath, initials, uploading, failed, cameraDenied, disabled, onChange, onOpenSettings }: ChildPhotoFieldProps) {
  return (
    <View style={styles.field}>
      <View style={styles.row}>
        <Avatar photoPath={photoPath} initials={initials} size="xl" />
        <Button label={DIRECTOR_CHILDREN_COPY.changePhoto} variant="soft" height={size.touch} loading={uploading} disabled={disabled} onPress={onChange} />
      </View>
      {failed ? (
        <Text variant="small" tone="red" accessibilityLiveRegion="polite">
          {DIRECTOR_CHILDREN_COPY.photoFailed}
        </Text>
      ) : null}
      {cameraDenied ? (
        <View style={styles.cameraDenied} accessibilityLiveRegion="polite">
          <Text variant="small" tone="red">
            {DIRECTOR_CHILDREN_COPY.cameraDenied}
          </Text>
          <Button label={DIRECTOR_CHILDREN_COPY.openSettings} variant="plain" onPress={onOpenSettings} />
        </View>
      ) : null}
    </View>
  );
}

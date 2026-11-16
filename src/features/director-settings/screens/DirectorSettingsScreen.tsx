import { View } from 'react-native';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { Skeleton } from '@/components/skeleton';
import { Text } from '@/components/text';
import { TopBar } from '@/components/top-bar';
import { SettingsForm } from '@/features/director-settings/components/SettingsForm/SettingsForm';
import { DIRECTOR_SETTINGS_COPY } from '@/features/director-settings/director-settings-copy';
import { useNurserySettings } from '@/features/director-settings/use-director-settings';

import { SKELETON_FIELD_HEIGHT, SKELETON_FIELDS, styles } from './DirectorSettingsScreen.styles';

export function DirectorSettingsScreen() {
  const { data: settings, failed, reload } = useNurserySettings();
  const header = <TopBar title={DIRECTOR_SETTINGS_COPY.title} backLabel={DIRECTOR_SETTINGS_COPY.back} />;

  if (failed) {
    return (
      <Screen header={header}>
        <View style={styles.error}>
          <Text tone="red">{DIRECTOR_SETTINGS_COPY.loadError}</Text>
          <Button label={DIRECTOR_SETTINGS_COPY.retry} variant="soft" onPress={reload} />
        </View>
      </Screen>
    );
  }

  if (!settings) {
    return (
      <Screen header={header}>
        <View style={styles.stack}>
          {Array.from({ length: SKELETON_FIELDS }, (_, index) => (
            <Skeleton key={index} height={SKELETON_FIELD_HEIGHT} />
          ))}
        </View>
      </Screen>
    );
  }

  return <SettingsForm saved={settings} />;
}

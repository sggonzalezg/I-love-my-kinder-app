import { Image, Text, View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import { PUSH_PRIMER_COPY } from '@/features/push-primer/push-primer-copy';
import { listEntering } from '@/theme/motion';

import { styles } from './LockScreenPreview.styles';

const NAP_PHOTO = require('@/assets/images/nap-hessam-nabavi.jpg');
const APP_ICON = require('@/assets/images/logo-client.png');

export function LockScreenPreview() {
  const reduced = useReducedMotion();
  return (
    <View style={styles.root} accessible accessibilityLabel={PUSH_PRIMER_COPY.previewLabel}>
      <Image source={NAP_PHOTO} style={styles.photo} resizeMode="cover" />
      <View style={styles.scrim} />
      <Text style={styles.clock}>{PUSH_PRIMER_COPY.previewClock}</Text>
      <Text style={styles.date}>{PUSH_PRIMER_COPY.previewDate}</Text>
      <Animated.View entering={listEntering(0, reduced)} style={styles.notification}>
        <Image source={APP_ICON} style={styles.appIcon} />
        <View style={styles.body}>
          <View style={styles.head}>
            <Text style={styles.appName}>{PUSH_PRIMER_COPY.previewApp}</Text>
            <Text style={styles.when}>{PUSH_PRIMER_COPY.previewWhen}</Text>
          </View>
          <Text style={styles.message}>{PUSH_PRIMER_COPY.previewMessage}</Text>
        </View>
      </Animated.View>
    </View>
  );
}

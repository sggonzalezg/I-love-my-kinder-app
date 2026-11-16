import { Plus } from 'lucide-react-native';
import { View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import { Button } from '@/components/button';
import { Chip } from '@/components/chip';
import { PeopleSection } from '@/components/PeopleSection/PeopleSection';
import { Text } from '@/components/text';
import { FilePartLoadState } from '@/features/director-children/components/FilePartLoadState/FilePartLoadState';
import { DIRECTOR_CHILDREN_COPY } from '@/features/director-children/director-children-copy';
import { canEnrollInAnotherGroup, type ChildEnrollment } from '@/lib/child-enrollments';
import { groupLabel } from '@/lib/shift';
import { size } from '@/theme/tokens';
import { listEntering } from '@/theme/motion';

import { styles } from './ChildEnrollmentsPart.styles';

interface ChildEnrollmentsPartProps {
  enrollments: ChildEnrollment[] | null;
  failed: boolean;
  onReload: () => void;
  onChange: (enrollmentId: string) => void;
  onEnroll: () => void;
}

export function ChildEnrollmentsPart({ enrollments, failed, onReload, onChange, onEnroll }: ChildEnrollmentsPartProps) {
  const reduced = useReducedMotion();
  if (!enrollments) return <FilePartLoadState failed={failed} errorText={DIRECTOR_CHILDREN_COPY.enrollmentsLoadError} onReload={onReload} />;

  return (
    <Animated.View entering={listEntering(0, reduced)} style={styles.part}>
      <PeopleSection whenEmpty={<Text tone="muted">{DIRECTOR_CHILDREN_COPY.noEnrollments}</Text>}>
        {enrollments.map((enrollment) => {
          const label = groupLabel(enrollment.roomName, enrollment.shift);
          return (
            <View key={enrollment.id} style={styles.row}>
              <View style={styles.group}>
                <Chip label={label} />
              </View>
              <Button
                label={DIRECTOR_CHILDREN_COPY.changeGroup}
                variant="plain"
                height={size.touch}
                accessibilityHint={DIRECTOR_CHILDREN_COPY.changeGroupHint(label)}
                onPress={() => onChange(enrollment.id)}
              />
            </View>
          );
        })}
      </PeopleSection>
      {canEnrollInAnotherGroup(enrollments) ? (
        <Button label={DIRECTOR_CHILDREN_COPY.enrollInAnotherGroup} icon={Plus} variant="soft" block onPress={onEnroll} />
      ) : null}
    </Animated.View>
  );
}

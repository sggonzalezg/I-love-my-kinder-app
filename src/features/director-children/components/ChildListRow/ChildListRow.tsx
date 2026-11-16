import { Check, X } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Avatar } from '@/components/avatar';
import { Chip } from '@/components/chip';
import { Text } from '@/components/text';
import { DIRECTOR_CHILDREN_COPY } from '@/features/director-children/director-children-copy';
import { childStatusLabel, type DirectorChildEntry } from '@/lib/director-children';
import { useBackgroundColorStyles } from '@/theme/color-styles';

import { styles } from './ChildListRow.styles';

interface ChildListRowProps {
  child: DirectorChildEntry;
  onPress: () => void;
}

function rowLabel(child: DirectorChildEntry, statusLabel: string | null, groupsLine: string): string {
  const marks = child.authorizations.map((mark) => DIRECTOR_CHILDREN_COPY.authorizationState(DIRECTOR_CHILDREN_COPY.authorizationChips[mark.key], mark.granted));
  return [child.name, groupsLine, ...(statusLabel ? [statusLabel] : marks)].filter(Boolean).join(', ');
}

export function ChildListRow({ child, onPress }: ChildListRowProps) {
  const backgroundStyles = useBackgroundColorStyles();
  const statusLabel = childStatusLabel(child.status);
  const groupsLine = child.groups.map((group) => group.label).join(DIRECTOR_CHILDREN_COPY.groupsSeparator);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={rowLabel(child, statusLabel, groupsLine)}
      style={({ pressed }) => [styles.row, pressed ? backgroundStyles.raised : backgroundStyles.surface]}>
      <Avatar photoPath={child.photoPath} initials={child.initials} />
      <View style={styles.text}>
        <Text variant="bodyStrong" numberOfLines={1}>
          {child.name}
        </Text>
        {groupsLine ? (
          <Text variant="small" tone="muted" numberOfLines={1}>
            {groupsLine}
          </Text>
        ) : null}
        <View style={styles.marks}>
          {statusLabel ? (
            <Chip compact label={statusLabel} variant={child.status.kind === 'leaving' ? 'wait' : 'grey'} />
          ) : (
            child.authorizations.map((mark) => (
              <Chip
                key={mark.key}
                compact
                label={DIRECTOR_CHILDREN_COPY.authorizationChips[mark.key]}
                icon={mark.granted ? Check : X}
                variant={mark.granted ? 'ok' : 'grey'}
              />
            ))
          )}
        </View>
      </View>
    </Pressable>
  );
}

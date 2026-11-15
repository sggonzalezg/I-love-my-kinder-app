import { router } from 'expo-router';
import { Fragment } from 'react';
import { View } from 'react-native';

import { Text } from '@/components/text';
import { roomGroupHref } from '@/constants/routes';
import { GroupRow } from '@/features/director-rooms/components/GroupRow/GroupRow';
import { roomTitleAge, type DirectorGroup, type DirectorRoomCard } from '@/lib/director-rooms';
import { useBackgroundColorStyles } from '@/theme/color-styles';

import { styles } from './RoomCard.styles';

interface RoomCardProps {
  card: DirectorRoomCard;
  onManageTeachers: (group: DirectorGroup) => void;
}

export function RoomCard({ card, onManageTeachers }: RoomCardProps) {
  const backgroundStyles = useBackgroundColorStyles();
  const age = roomTitleAge(card.description);

  return (
    <View style={[styles.card, backgroundStyles.surface]}>
      <Text variant="section" accessibilityRole="header">
        {card.name}
        {age ? (
          <Text variant="small" tone="muted">
            {` ${age}`}
          </Text>
        ) : null}
      </Text>
      {card.groups.map((group, index) => (
        <Fragment key={group.shiftId}>
          {index > 0 ? <View style={[styles.separator, backgroundStyles.raised]} /> : null}
          <GroupRow group={group} onPress={() => router.push(roomGroupHref(group.roomId, group.shiftId))} onManageTeachers={() => onManageTeachers(group)} />
        </Fragment>
      ))}
    </View>
  );
}

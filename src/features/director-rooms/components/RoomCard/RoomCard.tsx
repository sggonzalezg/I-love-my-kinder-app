import { router } from 'expo-router';
import { Fragment } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/button';
import { Text } from '@/components/text';
import { editRoomHref, roomGroupHref } from '@/constants/routes';
import { GroupRow } from '@/features/director-rooms/components/GroupRow/GroupRow';
import { DIRECTOR_ROOMS_COPY } from '@/features/director-rooms/director-rooms-copy';
import { roomTitleAge, type DirectorGroup, type DirectorRoomCard } from '@/lib/director-rooms';
import { useBackgroundColorStyles } from '@/theme/color-styles';
import { size } from '@/theme/tokens';

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
      <View style={styles.header}>
        <Text variant="section" accessibilityRole="header" style={styles.title}>
          {card.name}
          {age ? (
            <Text variant="small" tone="muted">
              {` ${age}`}
            </Text>
          ) : null}
        </Text>
        <Button
          label={DIRECTOR_ROOMS_COPY.editRoom}
          variant="plain"
          height={size.touch}
          accessibilityHint={DIRECTOR_ROOMS_COPY.editRoomTitle(card.name)}
          onPress={() => router.push(editRoomHref(card.id, card.name, card.description))}
        />
      </View>
      {card.groups.map((group, index) => (
        <Fragment key={group.shiftId}>
          {index > 0 ? <View style={[styles.separator, backgroundStyles.raised]} /> : null}
          <GroupRow group={group} onPress={() => router.push(roomGroupHref(group.roomId, group.shiftId))} onManageTeachers={() => onManageTeachers(group)} />
        </Fragment>
      ))}
    </View>
  );
}

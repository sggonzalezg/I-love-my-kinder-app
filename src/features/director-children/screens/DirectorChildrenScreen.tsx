import { router } from 'expo-router';
import { Fragment, type ReactNode } from 'react';
import { View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import { Button } from '@/components/button';
import { EmptyState } from '@/components/empty-state';
import { Screen } from '@/components/screen';
import { Select } from '@/components/Select/Select';
import { Skeleton } from '@/components/skeleton';
import { Text } from '@/components/text';
import { TopBar } from '@/components/top-bar';
import { childFileHref } from '@/constants/routes';
import { ChildListRow } from '@/features/director-children/components/ChildListRow/ChildListRow';
import { ChildSearchField } from '@/features/director-children/components/ChildSearchField/ChildSearchField';
import { DIRECTOR_CHILDREN_COPY } from '@/features/director-children/director-children-copy';
import { useDirectorChildren } from '@/features/director-children/use-director-children';
import { DIRECTOR_ROOMS_COPY } from '@/features/director-rooms/director-rooms-copy';
import { listEntering } from '@/theme/motion';

import { SKELETON_ROW_HEIGHT, SKELETON_ROWS, styles, useChildrenListStyles } from './DirectorChildrenScreen.styles';

interface DirectorChildrenScreenProps {
  partSwitch: ReactNode;
}

export function DirectorChildrenScreen({ partSwitch }: DirectorChildrenScreenProps) {
  const reduced = useReducedMotion();
  const themed = useChildrenListStyles();
  const childrenList = useDirectorChildren();

  function body() {
    if (childrenList.failed) {
      return (
        <View style={styles.error}>
          <Text tone="red">{DIRECTOR_CHILDREN_COPY.loadError}</Text>
          <Button label={DIRECTOR_CHILDREN_COPY.retry} variant="soft" onPress={childrenList.reload} />
        </View>
      );
    }
    if (childrenList.loading) {
      return (
        <View style={styles.stack}>
          {Array.from({ length: SKELETON_ROWS }, (_, index) => (
            <Skeleton key={index} height={SKELETON_ROW_HEIGHT} />
          ))}
        </View>
      );
    }
    if (!childrenList.hasChildren) return <EmptyState title={DIRECTOR_CHILDREN_COPY.emptyTitle} description={DIRECTOR_CHILDREN_COPY.emptyHint} />;
    if (!childrenList.shownChildren.length) return <EmptyState title={DIRECTOR_CHILDREN_COPY.noResultsTitle} description={DIRECTOR_CHILDREN_COPY.noResultsHint} />;

    return (
      <View style={styles.results}>
        <Text variant="small" tone="muted" numeric>
          {childrenList.countLine}
        </Text>
        <View style={[styles.list, themed.list]}>
          {childrenList.shownChildren.map((child, index) => (
            <Fragment key={child.id}>
              {index > 0 ? <View style={[styles.separator, themed.separator]} /> : null}
              <Animated.View entering={listEntering(index, reduced)}>
                <ChildListRow child={child} onPress={() => router.push(childFileHref(child.id))} />
              </Animated.View>
            </Fragment>
          ))}
        </View>
      </View>
    );
  }

  return (
    <Screen header={<TopBar title={DIRECTOR_ROOMS_COPY.title} />}>
      {partSwitch}
      <View style={styles.tools}>
        <ChildSearchField value={childrenList.filters.query} placeholder={DIRECTOR_CHILDREN_COPY.searchPlaceholder} onChange={childrenList.changeQuery} />
        <Select
          variant="chip"
          label={DIRECTOR_CHILDREN_COPY.roomFilter}
          options={childrenList.roomOptions}
          value={childrenList.filters.roomId}
          onChange={childrenList.chooseRoom}
        />
      </View>
      {body()}
    </Screen>
  );
}

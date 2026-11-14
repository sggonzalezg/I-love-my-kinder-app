import { View } from 'react-native';

import { Button } from '@/components/button';
import { EmptyState } from '@/components/empty-state';
import { Screen } from '@/components/screen';
import { Skeleton } from '@/components/skeleton';
import { Text } from '@/components/text';
import { Toast } from '@/components/toast';
import { TopBar } from '@/components/top-bar';
import { DeleteMediaSheet } from '@/features/director-gallery/components/DeleteMediaSheet/DeleteMediaSheet';
import { RoomFilterChips } from '@/features/director-gallery/components/RoomFilterChips/RoomFilterChips';
import { DIRECTOR_GALLERY_COPY } from '@/features/director-gallery/director-gallery-copy';
import { DIRECTOR_GALLERY_ACTIONS } from '@/features/director-gallery/director-gallery-reducer';
import { useDirectorGallery } from '@/features/director-gallery/use-director-gallery';
import { MediaDaySection } from '@/features/gallery/media-day-section';
import { StoryViewer } from '@/features/gallery/story-viewer';
import { ALL_ROOMS_KEY, deletedToast, directorEmptyTitle } from '@/lib/director-gallery';
import { mediaDaySections } from '@/lib/gallery';

import { SKELETON_TILE_HEIGHT, SKELETON_TILE_ROWS, styles } from './DirectorGalleryScreen.styles';

const EMPTY_ILLUSTRATION = require('@/assets/images/crayons-stephen-andrews.jpg');

const header = <TopBar title={DIRECTOR_GALLERY_COPY.title} />;

export function DirectorGalleryScreen() {
  const { state, dispatch, chips, media, loading, failed, reload, confirmDelete } = useDirectorGallery();
  const sections = media ? mediaDaySections(media, new Date()) : [];
  const chosenRoomName = state.roomKey === ALL_ROOMS_KEY ? null : (chips.find((chip) => chip.key === state.roomKey)?.label ?? null);
  const groupLabels = new Map((media ?? []).map((item) => [item.id, item.groupLabel]));
  const pendingDelete = media?.find((item) => item.id === state.pendingDeleteId) ?? null;
  const openStory = (mediaId: string) => dispatch({ type: DIRECTOR_GALLERY_ACTIONS.STORY_OPENED, mediaId });

  return (
    <View style={styles.root}>
      <Screen header={header}>
        <RoomFilterChips chips={chips} selectedKey={state.roomKey} onSelect={(roomKey) => dispatch({ type: DIRECTOR_GALLERY_ACTIONS.ROOM_SELECTED, roomKey })} />
        {failed ? (
          <View style={styles.error}>
            <Text color="red">{DIRECTOR_GALLERY_COPY.loadError}</Text>
            <Button label={DIRECTOR_GALLERY_COPY.retry} variant="soft" onPress={reload} />
          </View>
        ) : null}
        {loading && !failed ? (
          <View style={styles.skeleton}>
            {Array.from({ length: SKELETON_TILE_ROWS }, (_, index) => (
              <Skeleton key={index} height={SKELETON_TILE_HEIGHT} />
            ))}
          </View>
        ) : null}
        {media && sections.length === 0 ? (
          <View style={styles.empty}>
            <EmptyState title={directorEmptyTitle(chosenRoomName)} description={DIRECTOR_GALLERY_COPY.emptyBody} illustration={EMPTY_ILLUSTRATION} />
          </View>
        ) : null}
        {sections.length > 0 ? (
          <View style={styles.sections}>
            {sections.map((section, index) => (
              <MediaDaySection key={section.key} section={section} index={index} onMissingUrlRetry={reload} onOpenMedia={openStory} />
            ))}
          </View>
        ) : null}
      </Screen>
      {state.openMediaId && sections.length > 0 ? (
        <StoryViewer
          sections={sections}
          groupLabelOf={(item) => groupLabels.get(item.id) ?? ''}
          startMediaId={state.openMediaId}
          onClose={() => dispatch({ type: DIRECTOR_GALLERY_ACTIONS.STORY_CLOSED })}
          onDelete={(item) => dispatch({ type: DIRECTOR_GALLERY_ACTIONS.DELETE_REQUESTED, mediaId: item.id })}
          paused={pendingDelete !== null}>
          <DeleteMediaSheet
            media={pendingDelete}
            deleting={state.deleting}
            failed={state.deleteFailed}
            onConfirm={confirmDelete}
            onClose={() => dispatch({ type: DIRECTOR_GALLERY_ACTIONS.DELETE_CANCELLED })}
          />
        </StoryViewer>
      ) : null}
      {state.toast ? <Toast message={deletedToast(state.toast)} /> : null}
    </View>
  );
}

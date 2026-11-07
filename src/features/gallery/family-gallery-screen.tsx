import { Lock } from 'lucide-react-native';
import { useReducer } from 'react';
import { View } from 'react-native';

import { Banner } from '@/components/banner';
import { Button } from '@/components/button';
import { EmptyState } from '@/components/empty-state';
import { Screen } from '@/components/screen';
import { SegmentedControl } from '@/components/segmented-control';
import { Skeleton } from '@/components/skeleton';
import { Text } from '@/components/text';
import { TopBar } from '@/components/top-bar';
import { fetchFamilyGalleryChildren, fetchGroupMedia } from '@/data/gallery';
import { useSession } from '@/data/session';
import { useAsync } from '@/data/use-async';
import {
  emptyGalleryText,
  galleryFooter,
  galleryGroupsOf,
  isFamilyEnrolled,
  joinedToday,
  mediaDaySections,
  withdrawnBanner,
  type GalleryGroup,
} from '@/lib/gallery';

import { styles, SKELETON_TILE_HEIGHT, SKELETON_TILE_ROWS } from './family-gallery-screen.styles';
import { GALLERY_COPY } from './gallery-copy';
import { GALLERY_SELECTION_ACTIONS, INITIAL_GALLERY_SELECTION, gallerySelectionReducer } from './gallery-selection-reducer';
import { MediaDaySection } from './media-day-section';

const JOINED_ILLUSTRATION = require('@/assets/images/blocks-markus-spiske.jpg');
const EMPTY_ILLUSTRATION = require('@/assets/images/crayons-stephen-andrews.jpg');

const header = <TopBar title={GALLERY_COPY.title} />;

export function FamilyGalleryScreen() {
  const { session } = useSession();
  const userId = session?.user_id ?? null;
  const children = useAsync(() => fetchFamilyGalleryChildren(userId!), userId);
  const [selection, dispatch] = useReducer(gallerySelectionReducer, INITIAL_GALLERY_SELECTION);
  const groups = children.data ? galleryGroupsOf(children.data) : [];
  const group = groups.find((candidate) => candidate.key === selection.selectedKey) ?? groups[0] ?? null;

  if (children.failed) {
    return (
      <Screen header={header}>
        <LoadError onRetry={children.reload} />
      </Screen>
    );
  }
  if (children.loading) {
    return (
      <Screen header={header}>
        <GallerySkeleton />
      </Screen>
    );
  }
  if (!group) {
    return (
      <Screen header={header}>
        <View style={styles.empty}>
          <EmptyState title={GALLERY_COPY.emptyTitle} description={GALLERY_COPY.noGroup} illustration={EMPTY_ILLUSTRATION} />
        </View>
      </Screen>
    );
  }
  return (
    <GalleryGroupView
      group={group}
      groups={groups}
      onSelectGroup={(key) => dispatch({ type: GALLERY_SELECTION_ACTIONS.GROUP_SELECTED, key })}
    />
  );
}

interface GalleryGroupViewProps {
  group: GalleryGroup;
  groups: GalleryGroup[];
  onSelectGroup: (key: string) => void;
}

function GalleryGroupView({ group, groups, onSelectGroup }: GalleryGroupViewProps) {
  const media = useAsync(() => fetchGroupMedia(group), group.key);
  const now = new Date();
  const familyEnrolled = isFamilyEnrolled(groups);
  const bannerText = withdrawnBanner(group, familyEnrolled);
  const banner = bannerText ? <Banner kind="info" icon={Lock} text={bannerText} /> : null;
  const sections = media.data ? mediaDaySections(media.data, now) : [];

  return (
    <Screen header={header}>
      {familyEnrolled ? null : banner}
      {groups.length > 1 ? (
        <SegmentedControl
          options={groups.map((option) => ({ label: option.label, value: option.key, icon: option.locked ? Lock : undefined }))}
          value={group.key}
          onChange={onSelectGroup}
        />
      ) : null}
      {familyEnrolled ? banner : null}
      {media.failed ? <LoadError onRetry={media.reload} /> : null}
      {media.loading ? <GallerySkeleton /> : null}
      {media.data && sections.length === 0 ? (
        <View style={styles.empty}>
          <EmptyState
            title={GALLERY_COPY.emptyTitle}
            description={emptyGalleryText(group, now)}
            illustration={joinedToday(group, now) ? JOINED_ILLUSTRATION : EMPTY_ILLUSTRATION}
          />
        </View>
      ) : null}
      {sections.length > 0 ? (
        <View style={styles.sections}>
          {sections.map((section, index) => (
            <MediaDaySection key={section.key} section={section} index={index} onMissingUrlRetry={media.reload} />
          ))}
          <Text variant="small" color="muted" style={styles.footer}>
            {galleryFooter(group, groups, now)}
          </Text>
        </View>
      ) : null}
    </Screen>
  );
}

function GallerySkeleton() {
  return (
    <View style={styles.skeleton}>
      {Array.from({ length: SKELETON_TILE_ROWS }, (_, index) => (
        <Skeleton key={index} height={SKELETON_TILE_HEIGHT} />
      ))}
    </View>
  );
}

function LoadError({ onRetry }: { onRetry: () => void }) {
  return (
    <View style={styles.error}>
      <Text color="red">{GALLERY_COPY.loadError}</Text>
      <Button label={GALLERY_COPY.retry} variant="soft" onPress={onRetry} />
    </View>
  );
}

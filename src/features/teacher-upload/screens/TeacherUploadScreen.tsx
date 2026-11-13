import { CircleAlert } from 'lucide-react-native';
import { View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import { Banner } from '@/components/banner';
import { Button } from '@/components/button';
import { EmptyState } from '@/components/empty-state';
import { Screen } from '@/components/screen';
import { Text } from '@/components/text';
import { TopBar } from '@/components/top-bar';
import { TEACHER_DAY_COPY } from '@/features/teacher-day/teacher-day-copy';
import { groupKeyOf } from '@/features/teacher-day/use-group-day';
import { GroupCheckRow } from '@/features/teacher-upload/components/GroupCheckRow/GroupCheckRow';
import { MediaSourceButtons } from '@/features/teacher-upload/components/MediaSourceButtons/MediaSourceButtons';
import { PickedGrid } from '@/features/teacher-upload/components/PickedGrid/PickedGrid';
import { UploadEmptyState } from '@/features/teacher-upload/components/UploadEmptyState/UploadEmptyState';
import { UploadQueueRow } from '@/features/teacher-upload/components/UploadQueueRow/UploadQueueRow';
import { TEACHER_UPLOAD_COPY } from '@/features/teacher-upload/teacher-upload-copy';
import { useTeacherUpload } from '@/features/teacher-upload/use-teacher-upload';
import { hasUnfinishedUploads, queueGroups, tooLongCount, uploadGroupsHeading } from '@/lib/gallery-upload';
import { groupLabel } from '@/lib/shift';
import { listEntering } from '@/theme/motion';
import { size } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

import { ERROR_ICON_SIZE, styles, useTeacherUploadStyles } from './TeacherUploadScreen.styles';

const header = <TopBar title={TEACHER_UPLOAD_COPY.title} />;

export function TeacherUploadScreen() {
  const colors = useColors();
  const reduced = useReducedMotion();
  const themed = useTeacherUploadStyles();
  const upload = useTeacherUpload();
  const { state, groups, queue } = upload;

  if (upload.groupsFailed) {
    return (
      <Screen header={header}>
        <View style={styles.notice}>
          <Text tone="red">{TEACHER_DAY_COPY.loadError}</Text>
          <Button label={TEACHER_DAY_COPY.retry} variant="soft" onPress={upload.reloadGroups} />
        </View>
      </Screen>
    );
  }

  if (!upload.groupsLoading && !groups.length) {
    return (
      <Screen header={header}>
        <EmptyState title={TEACHER_DAY_COPY.noGroup} description={TEACHER_DAY_COPY.noGroupHint} />
      </Screen>
    );
  }

  const hasPicks = state.picks.length > 0;
  const tooLong = tooLongCount(state.picks);

  return (
    <Screen header={header}>
      <MediaSourceButtons onChoose={upload.pick} />
      {state.cameraDenied ? (
        <View style={styles.notice}>
          <Text variant="small" tone="red">
            {TEACHER_UPLOAD_COPY.cameraDenied}
          </Text>
          <Button label={TEACHER_UPLOAD_COPY.openSettings} variant="soft" onPress={upload.openSettings} />
        </View>
      ) : null}
      {!hasPicks && !queue.length ? <UploadEmptyState /> : null}
      {hasPicks ? (
        <>
          <View style={styles.sectionHeader}>
            <Text variant="section" accessibilityRole="header">
              {TEACHER_UPLOAD_COPY.picked(state.picks.length)}
            </Text>
          </View>
          <PickedGrid picks={state.picks} onRemove={upload.removePick} />
          {tooLong ? (
            <View style={styles.errorLine}>
              <CircleAlert size={ERROR_ICON_SIZE} color={colors.red} strokeWidth={1.8} />
              <Text variant="smallStrong" tone="red" style={styles.errorText}>
                {TEACHER_UPLOAD_COPY.tooLong(tooLong)}
              </Text>
            </View>
          ) : null}
          <Text variant="small" tone="muted" style={styles.help}>
            {TEACHER_UPLOAD_COPY.shareHint}
          </Text>
          <View style={styles.sectionHeader}>
            <Text variant="section" accessibilityRole="header">
              {TEACHER_UPLOAD_COPY.uploadTo}
            </Text>
            {groups.length > 1 ? (
              <Text variant="caption" tone="muted">
                {TEACHER_UPLOAD_COPY.uploadToHint(groups.length)}
              </Text>
            ) : null}
          </View>
          <View style={[styles.list, themed.list]}>
            {groups.map((group, index) => {
              const groupKey = groupKeyOf(group);
              return (
                <GroupCheckRow
                  key={groupKey}
                  label={groupLabel(group.roomName, group.shift)}
                  checked={upload.checkedKeys.includes(groupKey)}
                  separated={index > 0}
                  onToggle={() => upload.toggleGroup(groupKey)}
                />
              );
            })}
          </View>
          <Button
            label={TEACHER_UPLOAD_COPY.uploadButton(upload.uploadableCount, upload.checkedGroupCount)}
            block
            height={size.teacherAction}
            disabled={!upload.uploadableCount || !upload.checkedGroupCount}
            onPress={upload.startUpload}
            style={styles.uploadButton}
          />
        </>
      ) : null}
      {queue.length ? (
        <>
          <View style={styles.sectionHeader}>
            <Text variant="section" accessibilityRole="header" style={styles.sectionTitle}>
              {TEACHER_UPLOAD_COPY.uploadingTo(uploadGroupsHeading(queueGroups(queue)))}
            </Text>
          </View>
          <View style={[styles.list, themed.list]}>
            {queue.map((item, index) => (
              <Animated.View key={item.id} entering={listEntering(index, reduced)}>
                <UploadQueueRow item={item} separated={index > 0} onRetry={() => upload.retry(item.id)} />
              </Animated.View>
            ))}
          </View>
          {hasUnfinishedUploads(queue) ? (
            <View style={styles.banner}>
              <Banner kind="offline" text={TEACHER_UPLOAD_COPY.offlineHint} />
            </View>
          ) : null}
        </>
      ) : null}
    </Screen>
  );
}

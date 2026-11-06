import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { EmptyState } from '@/components/empty-state';
import { Screen } from '@/components/screen';
import { SegmentedControl } from '@/components/segmented-control';
import { Skeleton } from '@/components/skeleton';
import { Text } from '@/components/text';
import { TopBar } from '@/components/top-bar';
import { fetchFamilyChildren, fetchRoomRoster, type RosterTeacher } from '@/data/family-room';
import { useSession } from '@/data/session';
import { useAsync } from '@/data/use-async';
import { classmateName } from '@/lib/classmates';
import { roomGroupsOf, type RoomGroup } from '@/lib/room-groups';
import { groupLabel } from '@/lib/shift';
import { space } from '@/theme/tokens';
import { BirthdaysSection } from './birthdays-section';
import { ClassmatesSection } from './classmates-section';
import { TeacherProfileSheet } from './teacher-profile-sheet';
import { TeachersRow } from './teachers-row';

const SKELETON_ROWS = 4;

export function FamilyRoomScreen() {
  const { session } = useSession();
  const userId = session?.user_id ?? null;
  const children = useAsync(() => fetchFamilyChildren(userId!), userId);
  const groups = children.data ? roomGroupsOf(children.data) : [];
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const group = groups.find((candidate) => candidate.key === selectedKey) ?? groups[0] ?? null;

  if (children.failed) return <LoadError onRetry={children.reload} />;
  if (children.loading) return <RoomSkeleton />;
  if (!group) {
    return (
      <Screen header={<TopBar title="Sala" />}>
        <EmptyState title="No hay una sala para mostrar" description="Cuando tu hijo esté inscripto en una sala, vas a ver acá a sus maestras y compañeros." />
      </Screen>
    );
  }

  return (
    <RoomGroupView group={group} groups={groups} onSelectGroup={setSelectedKey} />
  );
}

interface RoomGroupViewProps {
  group: RoomGroup;
  groups: RoomGroup[];
  onSelectGroup: (key: string) => void;
}

function RoomGroupView({ group, groups, onSelectGroup }: RoomGroupViewProps) {
  const roster = useAsync(() => fetchRoomRoster(group), group.key);
  const [openTeacher, setOpenTeacher] = useState<RosterTeacher | null>(null);
  const title = groupLabel(group.roomName, group.shift);
  const birthdayChildren = (roster.data?.children ?? []).map((child) => ({
    id: child.id,
    name: classmateName(child),
    firstName: child.first_name ?? classmateName(child),
    birthDate: child.birth_date,
  }));

  return (
    <Screen header={<TopBar title={title} />}>
      {groups.length > 1 && (
        <SegmentedControl
          options={groups.map((option) => ({ label: groupLabel(option.roomName, option.shift), value: option.key }))}
          value={group.key}
          onChange={onSelectGroup}
        />
      )}
      {roster.failed && <LoadErrorInline onRetry={roster.reload} />}
      {roster.loading && <RosterSkeleton />}
      {roster.data && (
        <View style={styles.sections}>
          <TeachersRow teachers={roster.data.teachers} onOpen={setOpenTeacher} />
          <BirthdaysSection classmates={birthdayChildren} />
          <ClassmatesSection classmates={roster.data.children} />
        </View>
      )}
      <TeacherProfileSheet teacher={openTeacher} groupTitle={title} onClose={() => setOpenTeacher(null)} />
    </Screen>
  );
}

function RosterSkeleton() {
  return (
    <View style={styles.skeleton}>
      <Skeleton height={96} />
      {Array.from({ length: SKELETON_ROWS }, (_, index) => (
        <Skeleton key={index} height={56} />
      ))}
    </View>
  );
}

function RoomSkeleton() {
  return (
    <Screen header={<TopBar title="Sala" />}>
      <RosterSkeleton />
    </Screen>
  );
}

function LoadErrorInline({ onRetry }: { onRetry: () => void }) {
  return (
    <View style={styles.error}>
      <Text color="red">No pudimos cargar la sala. Probá de nuevo.</Text>
      <Button label="Reintentar" variant="soft" onPress={onRetry} />
    </View>
  );
}

function LoadError({ onRetry }: { onRetry: () => void }) {
  return (
    <Screen header={<TopBar title="Sala" />}>
      <LoadErrorInline onRetry={onRetry} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  sections: { gap: space.s6 },
  skeleton: { gap: space.s3 },
  error: { gap: space.s3, alignItems: 'flex-start' },
});

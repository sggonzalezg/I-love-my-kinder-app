import { fetchDirectorRooms } from '@/data/director-rooms';
import { useSession } from '@/data/session';
import { useAsync } from '@/data/use-async';
import { useReloadOnRefocus } from '@/data/use-reload-on-refocus';
import { birthdaysToday, buildRoomCards, noTeacherGroups, type BirthdayToday, type DirectorGroup, type DirectorRoomCard } from '@/lib/director-rooms';

export interface DirectorRooms {
  cards: DirectorRoomCard[];
  groupsWithoutTeacher: DirectorGroup[];
  birthdays: BirthdayToday[];
  loading: boolean;
  failed: boolean;
  reload: () => void;
}

export function useDirectorRooms(): DirectorRooms {
  const { session } = useSession();
  const nurseryId = session?.nursery_id ?? null;
  const { data, loading, failed, reload } = useAsync(() => fetchDirectorRooms(nurseryId!, new Date()), nurseryId, { keepDataOnReload: true });
  useReloadOnRefocus(reload);

  const cards = data ? buildRoomCards(data) : [];
  return {
    cards,
    groupsWithoutTeacher: noTeacherGroups(cards),
    birthdays: data ? birthdaysToday(cards, data.enrollments, new Date()) : [],
    loading: loading && !data,
    failed,
    reload,
  };
}

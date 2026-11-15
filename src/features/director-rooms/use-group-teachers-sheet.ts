import * as Haptics from 'expo-haptics';
import { useReducer } from 'react';

import { fetchGroupTeachersInput, saveGroupTeachers } from '@/data/group-teachers';
import { useSession } from '@/data/session';
import { useAsync } from '@/data/use-async';
import { teacherChanges, teacherChoices, type TeacherChoice } from '@/lib/group-teachers';

import { GROUP_TEACHERS_ACTIONS, INITIAL_GROUP_TEACHERS_STATE, groupTeachersReducer, type GroupTeachersState, type SheetGroup } from './group-teachers-reducer';

export interface GroupTeachersSheetControl {
  state: GroupTeachersState;
  choices: TeacherChoice[] | null;
  loadFailed: boolean;
  reloadChoices: () => void;
  open: (group: SheetGroup) => void;
  close: () => void;
  toggle: (teacherId: string) => void;
  save: () => Promise<void>;
}

export function useGroupTeachersSheet(onSaved: () => void): GroupTeachersSheetControl {
  const { session } = useSession();
  const nurseryId = session?.nursery_id ?? null;
  const [state, dispatch] = useReducer(groupTeachersReducer, INITIAL_GROUP_TEACHERS_STATE);
  const { group } = state;
  const input = useAsync(() => fetchGroupTeachersInput(nurseryId!), nurseryId && group ? `${nurseryId}#${state.openCount}` : null);
  const choices = input.data && group ? teacherChoices(input.data.teachers, input.data.assignments, group) : null;

  const close = () => dispatch({ type: GROUP_TEACHERS_ACTIONS.CLOSED });

  async function save() {
    if (!group || !choices || !nurseryId) return;
    const changes = teacherChanges(choices, state.toggledIds);
    if (!changes.added.length && !changes.removed.length) {
      close();
      return;
    }
    dispatch({ type: GROUP_TEACHERS_ACTIONS.SAVE_STARTED });
    try {
      await saveGroupTeachers(nurseryId, group, changes);
    } catch {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      dispatch({ type: GROUP_TEACHERS_ACTIONS.SAVE_FAILED });
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    close();
    onSaved();
  }

  return {
    state,
    choices,
    loadFailed: input.failed,
    reloadChoices: input.reload,
    open: (sheetGroup) => dispatch({ type: GROUP_TEACHERS_ACTIONS.OPENED, group: sheetGroup }),
    close,
    toggle: (teacherId) => dispatch({ type: GROUP_TEACHERS_ACTIONS.TOGGLED, teacherId }),
    save,
  };
}

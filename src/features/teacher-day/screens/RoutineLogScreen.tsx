import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { Pencil } from 'lucide-react-native';
import { useEffect, useReducer } from 'react';
import { KeyboardAvoidingView, ScrollView, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { Banner } from '@/components/banner';
import { Button } from '@/components/button';
import { ChoiceGroup } from '@/components/ChoiceGroup/ChoiceGroup';
import { EmptyState } from '@/components/empty-state';
import { ProgressTrack } from '@/components/ProgressTrack/ProgressTrack';
import { Screen } from '@/components/screen';
import { Skeleton } from '@/components/skeleton';
import { Text } from '@/components/text';
import { TimeSheet, type QuickTime } from '@/components/TimeSheet/TimeSheet';
import { Toast, TOAST_VISIBLE_MS } from '@/components/toast';
import { QUICK_TIME_CHIPS_MINUTES } from '@/constants/routine';
import { queueRoutine } from '@/data/routine-queue-store';
import { AllergyStrip } from '@/features/teacher-day/components/AllergyStrip/AllergyStrip';
import { FieldLabel } from '@/features/teacher-day/components/FieldLabel/FieldLabel';
import { HygieneLog } from '@/features/teacher-day/components/HygieneLog/HygieneLog';
import { LogActionBar } from '@/features/teacher-day/components/LogActionBar/LogActionBar';
import { NoteField } from '@/features/teacher-day/components/NoteField/NoteField';
import { RestTimes } from '@/features/teacher-day/components/RestTimes/RestTimes';
import { WhoRow } from '@/features/teacher-day/components/WhoRow/WhoRow';
import { initialRoutineLogState, ROUTINE_LOG_ACTIONS, routineLogReducer, type RoutineLogAction, type TimeSheetState } from '@/features/teacher-day/routine-log-reducer';
import { TEACHER_DAY_COPY } from '@/features/teacher-day/teacher-day-copy';
import { useGroupDay, type GroupDayChild } from '@/features/teacher-day/use-group-day';
import { formatDbTime } from '@/lib/dates';
import { AMOUNT_LABELS, HYGIENE_TYPE_LABELS, hasRestRangeError, MEAL_LABELS, mealsForShift, type HygieneType, type MealAmount, type RoutineDraft } from '@/lib/routine';
import { routineKey } from '@/lib/routine-queue';
import { groupLabel } from '@/lib/shift';
import { hygieneSheetCopy, minutesBefore, syncedLabel, toTimeValue } from '@/lib/teacher-day';

import { CHILD_ENTERING, CHILD_EXITING, KEYBOARD_BEHAVIOR, SKELETON_BLOCK_HEIGHT, styles } from './RoutineLogScreen.styles';

const AMOUNT_OPTIONS = (['all', 'half', 'little', 'none'] as const).map((value) => ({ value, label: AMOUNT_LABELS[value] }));

function quickTimesBefore(now: Date): QuickTime[] {
  return [
    { label: TEACHER_DAY_COPY.now(formatDbTime(toTimeValue(now))), value: toTimeValue(now) },
    ...QUICK_TIME_CHIPS_MINUTES.map((minutes) => ({ label: TEACHER_DAY_COPY.minutesAgo(minutes), value: minutesBefore(now, minutes) })),
  ];
}

function sheetCopy(sheet: TimeSheetState, draft: RoutineDraft, hygieneType: HygieneType, childName: string) {
  const shownTime = formatDbTime(sheet.time);
  if (sheet.purpose === 'restStart' || sheet.purpose === 'restEnd') {
    return { title: TEACHER_DAY_COPY.restSheetTitle[sheet.purpose], subtitle: childName, confirm: TEACHER_DAY_COPY.setTime(shownTime) };
  }
  const entry = sheet.purpose === 'hygieneEdit' && sheet.entryIndex !== undefined ? draft.hygiene[sheet.entryIndex] : null;
  const copy = hygieneSheetCopy(entry?.kind ?? draft.hygieneKind, shownTime);
  return {
    title: copy.title,
    subtitle: `${HYGIENE_TYPE_LABELS[entry?.type ?? hygieneType]} · ${childName}`,
    confirm: entry ? TEACHER_DAY_COPY.setTime(shownTime) : copy.add,
  };
}

function primaryLabel(child: GroupDayChild, isLast: boolean): string {
  if (child.status === 'rejected') return TEACHER_DAY_COPY.next;
  if (child.status === 'synced') return TEACHER_DAY_COPY.saveChanges;
  return isLast ? TEACHER_DAY_COPY.saveAndFinish : TEACHER_DAY_COPY.saveAndNext;
}

export function RoutineLogScreen() {
  const params = useLocalSearchParams<{ group?: string; child?: string }>();
  const { group, children, queue, loading, failed, reload } = useGroupDay(params.group ?? null);
  const [state, dispatch] = useReducer(routineLogReducer, Number(params.child ?? 0), initialRoutineLogState);

  useEffect(() => {
    if (!state.toast) return;
    const timer = setTimeout(() => dispatch({ type: ROUTINE_LOG_ACTIONS.TOAST_HIDDEN }), TOAST_VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [state.toast]);

  const child = children[Math.min(state.index, children.length - 1)] ?? null;

  if (!child || !group) {
    return (
      <Screen header={null}>
        {loading && !failed ? <Skeleton height={SKELETON_BLOCK_HEIGHT} /> : null}
        {failed ? (
          <View style={styles.error}>
            <Text tone="red">{TEACHER_DAY_COPY.loadError}</Text>
            <Button label={TEACHER_DAY_COPY.retry} variant="soft" onPress={reload} />
          </View>
        ) : null}
        {!loading && !failed ? <EmptyState title={TEACHER_DAY_COPY.noGroup} description={TEACHER_DAY_COPY.noGroupHint} /> : null}
      </Screen>
    );
  }

  const now = new Date();
  const nowTime = toTimeValue(now);
  const draft = state.drafts[child.id] ?? child.draft;
  const index = children.indexOf(child);
  const isLast = index === children.length - 1;
  const rejected = child.status === 'rejected';
  const editing = child.status === 'synced';
  const restInvalid = hasRestRangeError(draft);
  const label = groupLabel(group.roomName, group.shift);

  const edit = (action: RoutineLogAction) => {
    dispatch({ type: ROUTINE_LOG_ACTIONS.DRAFT_STARTED, childId: child.id, draft: child.draft });
    dispatch(action);
  };

  const showChild = (nextIndex: number, toast: string | null) => {
    if (nextIndex >= children.length) {
      router.back();
      return;
    }
    dispatch({ type: ROUTINE_LOG_ACTIONS.CHILD_SHOWN, index: nextIndex, toast });
  };

  const save = () => {
    if (rejected) {
      showChild(index + 1, null);
      return;
    }
    if (restInvalid) {
      dispatch({ type: ROUTINE_LOG_ACTIONS.SAVE_BLOCKED });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    queueRoutine({ key: routineKey(child.target), target: child.target, draft, status: 'pending' });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    showChild(index + 1, TEACHER_DAY_COPY.saved(child.firstName));
  };

  const pressRestTime = (field: 'restStart' | 'restEnd') => {
    const time = draft[field];
    if (time) edit({ type: ROUTINE_LOG_ACTIONS.SHEET_OPENED, sheet: { purpose: field, time } });
    else edit({ type: ROUTINE_LOG_ACTIONS.REST_SET, childId: child.id, field, time: nowTime });
  };

  const confirmSheet = () => {
    const sheet = state.sheet;
    if (!sheet) return;
    if (sheet.purpose === 'hygieneAdd') edit({ type: ROUTINE_LOG_ACTIONS.HYGIENE_ADDED, childId: child.id, time: sheet.time });
    else if (sheet.purpose === 'hygieneEdit') edit({ type: ROUTINE_LOG_ACTIONS.HYGIENE_RETIMED, childId: child.id, entryIndex: sheet.entryIndex ?? 0, time: sheet.time });
    else edit({ type: ROUTINE_LOG_ACTIONS.REST_SET, childId: child.id, field: sheet.purpose, time: sheet.time });
  };

  const sheetText = state.sheet ? sheetCopy(state.sheet, draft, state.hygieneType, child.name) : null;

  return (
    <Screen bleed>
      <KeyboardAvoidingView behavior={KEYBOARD_BEHAVIOR} style={styles.fill}>
        <WhoRow
          name={child.name}
          position={rejected || editing ? null : index + 1}
          meta={rejected ? label : editing && child.savedAt ? syncedLabel(child.savedAt) : `de ${children.length} · ${label}`}
          status={child.status}
        />
        <View style={styles.margins}>
          <View style={styles.track}>
            <ProgressTrack fraction={index / children.length} thin />
          </View>
          {queue.offline ? <Banner kind="offline" text={TEACHER_DAY_COPY.offlineLog} /> : null}
          {rejected ? <Banner kind="error" text={TEACHER_DAY_COPY.notInGroup} /> : null}
          {state.showRangeError && restInvalid ? <Banner kind="error" text={TEACHER_DAY_COPY.saveError} /> : null}
        </View>
        <ScrollView style={styles.fill} contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          <Animated.View key={child.id} entering={CHILD_ENTERING} exiting={CHILD_EXITING}>
            {editing ? <Banner kind="info" icon={Pencil} text={TEACHER_DAY_COPY.editingBanner} /> : null}
            {child.allergies ? <AllergyStrip allergies={child.allergies} /> : null}
            {mealsForShift(group.shift).map((meal) => (
              <View key={meal}>
                <FieldLabel title={MEAL_LABELS[meal]} />
                <ChoiceGroup<MealAmount>
                  label={MEAL_LABELS[meal]}
                  options={AMOUNT_OPTIONS}
                  value={draft.meals[meal] ?? null}
                  disabled={rejected}
                  onChange={(amount) => edit({ type: ROUTINE_LOG_ACTIONS.MEAL_CHOSEN, childId: child.id, meal, amount })}
                />
              </View>
            ))}
            {rejected ? null : (
              <>
                <RestTimes
                  restStart={draft.restStart}
                  restEnd={draft.restEnd}
                  noRest={draft.noRest}
                  invalid={restInvalid}
                  showError={state.showRangeError}
                  disabled={rejected}
                  onPressTime={pressRestTime}
                  onToggleNoSleep={() => edit({ type: ROUTINE_LOG_ACTIONS.NO_SLEEP_TOGGLED, childId: child.id })}
                />
                <HygieneLog
                  kind={draft.hygieneKind}
                  type={state.hygieneType}
                  entries={draft.hygiene}
                  nowTime={nowTime}
                  disabled={rejected}
                  onKindChange={(kind) => edit({ type: ROUTINE_LOG_ACTIONS.HYGIENE_KIND_CHOSEN, childId: child.id, kind })}
                  onTypeChange={(hygieneType) => dispatch({ type: ROUTINE_LOG_ACTIONS.HYGIENE_TYPE_CHOSEN, hygieneType })}
                  onOpenTimeSheet={() => dispatch({ type: ROUTINE_LOG_ACTIONS.SHEET_OPENED, sheet: { purpose: 'hygieneAdd', time: nowTime } })}
                  onAddNow={() => edit({ type: ROUTINE_LOG_ACTIONS.HYGIENE_ADDED, childId: child.id, time: nowTime })}
                  onPressEntry={(entryIndex) =>
                    dispatch({ type: ROUTINE_LOG_ACTIONS.SHEET_OPENED, sheet: { purpose: 'hygieneEdit', time: draft.hygiene[entryIndex].time, entryIndex } })
                  }
                />
                <NoteField value={draft.notes} disabled={rejected} onChange={(notes) => edit({ type: ROUTINE_LOG_ACTIONS.NOTE_CHANGED, childId: child.id, notes })} />
              </>
            )}
          </Animated.View>
        </ScrollView>
        <LogActionBar
          primaryLabel={primaryLabel(child, isLast)}
          onPrimary={save}
          onPrevious={editing ? null : () => showChild(index - 1, null)}
          previousDisabled={index === 0}
        />
      </KeyboardAvoidingView>
      {state.toast ? <Toast message={state.toast} /> : null}
      {state.sheet && sheetText ? (
        <TimeSheet
          visible
          title={sheetText.title}
          subtitle={sheetText.subtitle}
          time={state.sheet.time}
          latest={now}
          quickTimes={quickTimesBefore(now)}
          confirmLabel={sheetText.confirm}
          confirmIsAdd={state.sheet.purpose === 'hygieneAdd'}
          onChange={(time) => dispatch({ type: ROUTINE_LOG_ACTIONS.SHEET_TIME_CHANGED, time })}
          onConfirm={confirmSheet}
          onCancel={() => dispatch({ type: ROUTINE_LOG_ACTIONS.SHEET_CLOSED })}
          onDelete={
            state.sheet.purpose === 'hygieneEdit'
              ? () => edit({ type: ROUTINE_LOG_ACTIONS.HYGIENE_REMOVED, childId: child.id, entryIndex: state.sheet?.entryIndex ?? 0 })
              : undefined
          }
        />
      ) : null}
    </Screen>
  );
}

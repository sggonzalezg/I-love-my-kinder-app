import { router, Stack, useLocalSearchParams } from 'expo-router';
import { CircleAlert, ClipboardCheck, X } from 'lucide-react-native';
import { KeyboardAvoidingView, View } from 'react-native';

import { Banner } from '@/components/banner';
import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { Skeleton } from '@/components/skeleton';
import { Text } from '@/components/text';
import { TimeSheet } from '@/components/TimeSheet/TimeSheet';
import { TopBar } from '@/components/top-bar';
import { AudienceRadios } from '@/features/calendar/components/AudienceRadios/AudienceRadios';
import { DateSheet } from '@/features/calendar/components/DateSheet/DateSheet';
import { DiscardSheet } from '@/features/calendar/components/DiscardSheet/DiscardSheet';
import { EventTextField } from '@/features/calendar/components/EventTextField/EventTextField';
import { IconChips } from '@/features/calendar/components/IconChips/IconChips';
import { ResignSheet } from '@/features/calendar/components/ResignSheet/ResignSheet';
import { FormActionBar } from '@/features/calendar/components/FormActionBar/FormActionBar';
import { FormRow } from '@/features/calendar/components/FormRow/FormRow';
import { FormRows } from '@/features/calendar/components/FormRows/FormRows';
import { EVENT_FORM_COPY, timeSheetDoneLabel } from '@/features/calendar/event-form-copy';
import { EVENT_TYPE_OPTIONS, TRANSPORT_OPTIONS } from '@/features/calendar/event-form-options';
import { EVENT_FORM_ACTIONS, type DateSheetKind, type TimeSheetKind } from '@/features/calendar/event-form-reducer';
import { useEventForm } from '@/features/calendar/use-event-form';
import { formatDbTime, fromIsoDate } from '@/lib/dates';
import {
  EVENT_DESCRIPTION_MAX_LENGTH,
  EVENT_PLACE_MAX_LENGTH,
  EVENT_TIME_MINUTE_STEP,
  EVENT_TITLE_MAX_LENGTH,
  LATEST_EVENT_TIME,
  canSaveEvent,
  formDayLabel,
  formShortDayLabel,
  notifyFamiliesLine,
  timeError,
  type EventFormValues,
} from '@/lib/event-form';
import { isOuting, typeChangeValues } from '@/lib/outing-fields';
import { askPermissionCaption, outingBannerText } from '@/lib/outing-form';
import { useColors } from '@/theme/use-theme';

import { ERROR_ICON_SIZE, KEYBOARD_BEHAVIOR, SKELETON_HEIGHT, styles } from './EventFormScreen.styles';

const SCREEN_OPTIONS = { presentation: 'fullScreenModal' } as const;

function latestTimeOf(day: Date): Date {
  const [hours, minutes] = LATEST_EVENT_TIME.split(':').map(Number);
  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours, minutes);
}

export function EventFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const colors = useColors();
  const form = useEventForm(id);
  const { state, dispatch } = form;
  const { values } = state;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const header = (
    <TopBar
      title={form.isEdit ? EVENT_FORM_COPY.editTitle : EVENT_FORM_COPY.newTitle}
      backLabel={EVENT_FORM_COPY.close}
      backIcon={X}
      onBack={form.close}
    />
  );

  if (form.loading || form.failed || form.notFound) {
    return (
      <Screen header={header}>
        <Stack.Screen options={SCREEN_OPTIONS} />
        {form.loading ? <Skeleton height={SKELETON_HEIGHT} /> : null}
        {form.failed ? (
          <View style={styles.feedback}>
            <Text tone="red">{EVENT_FORM_COPY.loadError}</Text>
            <Button label={EVENT_FORM_COPY.retry} variant="soft" onPress={form.reload} />
          </View>
        ) : null}
        {form.notFound ? <Text tone="muted">{EVENT_FORM_COPY.notFound}</Text> : null}
      </Screen>
    );
  }

  const change = (partial: Partial<EventFormValues>) => dispatch({ type: EVENT_FORM_ACTIONS.FIELD_CHANGED, values: partial });
  const openDateSheet = (sheet: DateSheetKind) => dispatch({ type: EVENT_FORM_ACTIONS.DATE_SHEET_OPENED, sheet, today: new Date() });
  const openTimeSheet = (sheet: TimeSheetKind) => dispatch({ type: EVENT_FORM_ACTIONS.TIME_SHEET_OPENED, sheet });
  const closeSheet = () => dispatch({ type: EVENT_FORM_ACTIONS.SHEET_CLOSED });
  const confirmSheet = () => dispatch({ type: EVENT_FORM_ACTIONS.SHEET_CONFIRMED });
  const hoursError = timeError(values);
  const dayValue = values.date ? formDayLabel(values.date) : EVENT_FORM_COPY.chooseDay;
  const isDateSheet = state.sheet === 'date' || state.sheet === 'until';
  const isTimeSheet = state.sheet === 'start' || state.sheet === 'end';
  const untilMinDate = values.date ? fromIsoDate(values.date) : today;
  const outing = isOuting(values);
  const startTitle = outing ? EVENT_FORM_COPY.outingStartSheetTitle : EVENT_FORM_COPY.startSheetTitle;
  const endTitle = outing ? EVENT_FORM_COPY.outingEndSheetTitle : EVENT_FORM_COPY.endSheetTitle;
  const audienceCaption = form.audience ? notifyFamiliesLine(form.audience.label, form.familyCount) : undefined;
  const notifyCaption = outing ? askPermissionCaption(form.familyCount) : audienceCaption;
  const saveLabel = form.isEdit ? EVENT_FORM_COPY.saveChanges : outing ? EVENT_FORM_COPY.saveOuting : EVENT_FORM_COPY.save;

  return (
    <View style={styles.root}>
      <Stack.Screen options={SCREEN_OPTIONS} />
      <KeyboardAvoidingView behavior={KEYBOARD_BEHAVIOR} style={styles.root}>
        <Screen header={header}>
          <View style={styles.form}>
            <View style={styles.section}>
              <Text variant="label">{EVENT_FORM_COPY.type}</Text>
              <IconChips label={EVENT_FORM_COPY.type} options={EVENT_TYPE_OPTIONS} value={values.type} onChange={(type) => change(typeChangeValues(type))} />
            </View>

            {outing ? <Banner kind="info" icon={ClipboardCheck} text={outingBannerText(form.familyCount)} /> : null}

            <EventTextField
              label={EVENT_FORM_COPY.title}
              value={values.title}
              editable={!state.saving}
              maxLength={EVENT_TITLE_MAX_LENGTH}
              onChange={(title) => change({ title })}
            />

            <View style={styles.section}>
              <Text variant="label">{EVENT_FORM_COPY.when}</Text>
              {values.allDay ? (
                <FormRows>
                  <FormRow label={EVENT_FORM_COPY.allDay} switchValue onSwitchChange={(allDay) => change({ allDay })} />
                  <FormRow label={EVENT_FORM_COPY.from} value={values.date ? formShortDayLabel(values.date) : EVENT_FORM_COPY.chooseDay} onPress={() => openDateSheet('date')} />
                  <FormRow
                    label={EVENT_FORM_COPY.until}
                    labelAside={EVENT_FORM_COPY.optional}
                    value={values.untilDate ? formShortDayLabel(values.untilDate) : EVENT_FORM_COPY.oneDay}
                    onPress={() => openDateSheet('until')}
                  />
                </FormRows>
              ) : (
                <FormRows>
                  <FormRow label={EVENT_FORM_COPY.day} value={dayValue} onPress={() => openDateSheet('date')} />
                  {outing ? null : <FormRow label={EVENT_FORM_COPY.allDay} switchValue={false} onSwitchChange={(allDay) => change({ allDay })} />}
                  <FormRow
                    label={outing ? EVENT_FORM_COPY.outingStarts : EVENT_FORM_COPY.starts}
                    value={formatDbTime(values.startTime)}
                    onPress={() => openTimeSheet('start')}
                  />
                  <FormRow
                    label={outing ? EVENT_FORM_COPY.outingEnds : EVENT_FORM_COPY.ends}
                    value={formatDbTime(values.endTime)}
                    error={hoursError !== null}
                    onPress={() => openTimeSheet('end')}
                  />
                </FormRows>
              )}
              {hoursError ? (
                <View style={styles.error} accessibilityLiveRegion="polite">
                  <CircleAlert size={ERROR_ICON_SIZE} color={colors.red} />
                  <Text variant="smallStrong" tone="red" style={styles.errorText}>
                    {hoursError}
                  </Text>
                </View>
              ) : null}
              {values.allDay ? (
                <Text variant="small" tone="muted">
                  {EVENT_FORM_COPY.allDayHelp}
                </Text>
              ) : null}
            </View>

            <View style={styles.section}>
              <Text variant="label">{EVENT_FORM_COPY.audience}</Text>
              <AudienceRadios label={EVENT_FORM_COPY.audience} options={form.options} value={values.audienceKey} onChange={(audienceKey) => change({ audienceKey })} />
            </View>

            <EventTextField
              label={outing ? EVENT_FORM_COPY.outingPlace : EVENT_FORM_COPY.place}
              labelAside={outing ? undefined : EVENT_FORM_COPY.optional}
              help={outing ? EVENT_FORM_COPY.outingPlaceHelp : undefined}
              value={values.place}
              editable={!state.saving}
              maxLength={EVENT_PLACE_MAX_LENGTH}
              onChange={(place) => change({ place })}
            />
            {outing ? (
              <View style={styles.section}>
                <Text variant="label">{EVENT_FORM_COPY.transport}</Text>
                <IconChips
                  label={EVENT_FORM_COPY.transport}
                  options={TRANSPORT_OPTIONS}
                  value={values.transportChoice}
                  onChange={(transportChoice) => change({ transportChoice })}
                />
                {values.transportChoice === 'other' ? (
                  <EventTextField
                    label={EVENT_FORM_COPY.otherTransport}
                    value={values.otherTransport}
                    editable={!state.saving}
                    maxLength={EVENT_PLACE_MAX_LENGTH}
                    onChange={(otherTransport) => change({ otherTransport })}
                  />
                ) : null}
              </View>
            ) : null}
            <EventTextField
              label={outing ? EVENT_FORM_COPY.outingNotes : EVENT_FORM_COPY.description}
              labelAside={EVENT_FORM_COPY.optional}
              value={values.description}
              multiline
              editable={!state.saving}
              maxLength={EVENT_DESCRIPTION_MAX_LENGTH}
              onChange={(description) => change({ description })}
            />

            <View style={styles.section}>
              <Text variant="label">{EVENT_FORM_COPY.notifications}</Text>
              <FormRows>
                {form.isEdit ? null : (
                  <FormRow
                    label={outing ? EVENT_FORM_COPY.askPermissionNow : EVENT_FORM_COPY.notifyNow}
                    caption={notifyCaption}
                    switchValue
                    switchDisabled
                    onSwitchChange={() => undefined}
                  />
                )}
                <FormRow
                  label={outing ? EVENT_FORM_COPY.remindUnanswered : EVENT_FORM_COPY.remindDayBefore}
                  caption={outing ? EVENT_FORM_COPY.remindUnansweredAt : EVENT_FORM_COPY.remindAt}
                  switchValue={values.remindDayBefore}
                  onSwitchChange={(remindDayBefore) => change({ remindDayBefore })}
                />
              </FormRows>
            </View>

            {state.saveError === 'offline' ? <Banner kind="offline" text={EVENT_FORM_COPY.offline} /> : null}
            {state.saveError === 'failed' ? <Banner kind="error" text={EVENT_FORM_COPY.saveFailed} /> : null}
          </View>
        </Screen>
        <FormActionBar
          label={saveLabel}
          icon={outing && !form.isEdit ? ClipboardCheck : undefined}
          disabled={!canSaveEvent(values) || state.saveError === 'offline'}
          loading={state.saving}
          onPress={form.save}
        />
      </KeyboardAvoidingView>

      <DateSheet
        visible={isDateSheet}
        shownMonth={state.sheetMonth}
        selectedDate={state.draftDate}
        minDate={state.sheet === 'until' ? untilMinDate : today}
        today={today}
        onClear={state.sheet === 'until' ? () => dispatch({ type: EVENT_FORM_ACTIONS.UNTIL_CLEARED }) : undefined}
        onMonthShift={(step) => dispatch({ type: EVENT_FORM_ACTIONS.SHEET_MONTH_SHIFTED, step })}
        onChoose={(date) => dispatch({ type: EVENT_FORM_ACTIONS.DRAFT_DATE_CHOSEN, date })}
        onConfirm={confirmSheet}
        onClose={closeSheet}
      />
      {isTimeSheet ? (
        <TimeSheet
          visible
          title={state.sheet === 'start' ? startTitle : endTitle}
          time={state.draftTime}
          latest={latestTimeOf(now)}
          quickTimes={[]}
          minuteStep={EVENT_TIME_MINUTE_STEP}
          confirmLabel={timeSheetDoneLabel(formatDbTime(state.draftTime))}
          onChange={(time) => dispatch({ type: EVENT_FORM_ACTIONS.DRAFT_TIME_CHANGED, time })}
          onConfirm={confirmSheet}
          onCancel={closeSheet}
        />
      ) : null}
      <ResignSheet
        visible={state.resignOpen}
        text={form.resignText ?? ''}
        onConfirm={form.confirmResign}
        onKeepEditing={() => dispatch({ type: EVENT_FORM_ACTIONS.RESIGN_CANCELLED })}
      />
      <DiscardSheet visible={state.discardOpen} onDiscard={() => router.back()} onKeepEditing={() => dispatch({ type: EVENT_FORM_ACTIONS.DISCARD_CANCELLED })} />
    </View>
  );
}

import { KeyboardAvoidingView, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { Banner } from '@/components/banner';
import { FormActionBar } from '@/components/FormActionBar/FormActionBar';
import { FormTextField } from '@/components/FormTextField/FormTextField';
import { Screen } from '@/components/screen';
import { Text } from '@/components/text';
import { TimeSheet } from '@/components/TimeSheet/TimeSheet';
import { TopBar } from '@/components/top-bar';
import { FormRows } from '@/features/calendar/components/FormRows/FormRows';
import { ShiftTimesRow } from '@/features/director-settings/components/ShiftTimesRow/ShiftTimesRow';
import { DIRECTOR_SETTINGS_COPY } from '@/features/director-settings/director-settings-copy';
import { useSettingsForm } from '@/features/director-settings/use-director-settings';
import { formatDbTime } from '@/lib/dates';
import { ADDRESS_MAX_LENGTH, PHONE_MAX_LENGTH, type NurserySettings } from '@/lib/director-settings';
import { shiftLabel } from '@/lib/shift';
import { layoutReflowTransition } from '@/theme/motion';

import { KEYBOARD_BEHAVIOR, LATEST_SHIFT_TIME, SHIFT_TIME_MINUTE_STEP, styles } from './SettingsForm.styles';

function latestShiftTime(): Date {
  const latest = new Date();
  latest.setHours(LATEST_SHIFT_TIME.hours, LATEST_SHIFT_TIME.minutes, 0, 0);
  return latest;
}

interface SettingsFormProps {
  saved: NurserySettings;
}

export function SettingsForm({ saved }: SettingsFormProps) {
  const form = useSettingsForm(saved);
  const { details, shifts } = form.state.edited;
  const saving = form.state.status === 'saving';
  const sheet = form.state.timeSheet;
  const sheetShiftName = sheet ? shiftLabel(sheet.shiftName).toLowerCase() : '';
  const shiftErrorLines = shifts.flatMap((shift) => {
    const error = form.shiftErrors[shift.name];
    return error ? [{ shiftName: shift.name, error }] : [];
  });

  return (
    <View style={styles.root}>
      <KeyboardAvoidingView behavior={KEYBOARD_BEHAVIOR} style={styles.root}>
        <Screen header={<TopBar title={DIRECTOR_SETTINGS_COPY.title} backLabel={DIRECTOR_SETTINGS_COPY.back} />}>
          <Animated.View layout={layoutReflowTransition} style={styles.form}>
            <FormTextField
              label={DIRECTOR_SETTINGS_COPY.address}
              value={details.address}
              error={form.fieldErrors.address}
              editable={!saving}
              maxLength={ADDRESS_MAX_LENGTH}
              onChange={(value) => form.changeField('address', value)}
            />
            <FormTextField
              label={DIRECTOR_SETTINGS_COPY.contactPhone}
              value={details.contactPhone}
              error={form.fieldErrors.contactPhone}
              keyboardType="phone-pad"
              editable={!saving}
              maxLength={PHONE_MAX_LENGTH}
              onChange={(value) => form.changeField('contactPhone', value)}
            />
            <FormTextField
              label={DIRECTOR_SETTINGS_COPY.urgentPhone}
              help={DIRECTOR_SETTINGS_COPY.urgentPhoneHelp}
              value={details.urgentPhone}
              error={form.fieldErrors.urgentPhone}
              keyboardType="phone-pad"
              editable={!saving}
              maxLength={PHONE_MAX_LENGTH}
              onChange={(value) => form.changeField('urgentPhone', value)}
            />
            <Animated.View layout={layoutReflowTransition} style={styles.shifts}>
              <Text variant="section" accessibilityRole="header">
                {DIRECTOR_SETTINGS_COPY.shifts}
              </Text>
              <FormRows>
                {shifts.map((shift) => (
                  <ShiftTimesRow
                    key={shift.name}
                    shift={shift}
                    invalid={form.shiftErrors[shift.name] !== null}
                    disabled={saving}
                    onTimePress={(edge) => form.openTimeSheet(shift.name, edge)}
                  />
                ))}
              </FormRows>
              {shiftErrorLines.map(({ shiftName, error }) => (
                <Text key={shiftName} variant="small" tone="red">
                  {error}
                </Text>
              ))}
              <Text variant="small" tone="muted">
                {DIRECTOR_SETTINGS_COPY.shiftsHelp}
              </Text>
            </Animated.View>
            {form.state.status === 'failed' ? <Banner kind="error" text={DIRECTOR_SETTINGS_COPY.saveError} /> : null}
          </Animated.View>
        </Screen>
        <FormActionBar label={DIRECTOR_SETTINGS_COPY.save} disabled={!form.canSave} loading={saving} onPress={form.save} />
      </KeyboardAvoidingView>
      {sheet ? (
        <TimeSheet
          visible
          title={sheet.edge === 'startTime' ? DIRECTOR_SETTINGS_COPY.startsTitle(sheetShiftName) : DIRECTOR_SETTINGS_COPY.endsTitle(sheetShiftName)}
          time={sheet.draftTime}
          latest={latestShiftTime()}
          quickTimes={[]}
          minuteStep={SHIFT_TIME_MINUTE_STEP}
          confirmLabel={DIRECTOR_SETTINGS_COPY.timeSheetDone(formatDbTime(sheet.draftTime))}
          onChange={form.changeDraftTime}
          onConfirm={form.confirmTimeSheet}
          onCancel={form.closeTimeSheet}
        />
      ) : null}
    </View>
  );
}

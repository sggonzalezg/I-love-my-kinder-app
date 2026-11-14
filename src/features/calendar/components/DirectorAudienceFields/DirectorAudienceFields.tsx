import { View } from 'react-native';

import { Select } from '@/components/Select/Select';
import { AudienceRadios } from '@/features/calendar/components/AudienceRadios/AudienceRadios';
import { AudienceReachLine } from '@/features/calendar/components/AudienceReachLine/AudienceReachLine';
import { EVENT_FORM_COPY } from '@/features/calendar/event-form-copy';
import { AUDIENCE_SCOPE_OPTIONS, audienceScope, firstAudienceKeyOf, optionsInScope, type AudienceReach, type AudienceScope } from '@/lib/director-event-audience';
import type { EventAudienceOption } from '@/lib/event-form';

import { styles } from './DirectorAudienceFields.styles';

interface DirectorAudienceFieldsProps {
  options: EventAudienceOption[];
  audience: EventAudienceOption | null;
  reach: AudienceReach | null;
  onChange: (audienceKey: string | null) => void;
}

const SCOPE_PICKER_LABELS: Record<Exclude<AudienceScope, 'nursery'>, string> = {
  room: EVENT_FORM_COPY.roomPicker,
  group: EVENT_FORM_COPY.groupPicker,
};

/** The scope lives in the chosen audience key, so choosing a scope starts on its first room or group. */
export function DirectorAudienceFields({ options, audience, reach, onChange }: DirectorAudienceFieldsProps) {
  const scope = audience ? audienceScope(audience) : null;
  const scopedOptions = scope && scope !== 'nursery' ? optionsInScope(options, scope) : [];

  return (
    <View style={styles.fields}>
      <AudienceRadios
        label={EVENT_FORM_COPY.audience}
        options={AUDIENCE_SCOPE_OPTIONS}
        value={scope}
        onChange={(nextScope) => onChange(firstAudienceKeyOf(options, nextScope))}
      />
      {scope && scope !== 'nursery' ? (
        <Select
          label={SCOPE_PICKER_LABELS[scope]}
          options={scopedOptions.map((option) => ({ value: option.key, label: option.label }))}
          value={audience?.key ?? null}
          onChange={onChange}
        />
      ) : null}
      {reach ? <AudienceReachLine reach={reach} /> : null}
    </View>
  );
}

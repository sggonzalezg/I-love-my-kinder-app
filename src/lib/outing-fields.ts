import type { EventType } from './calendar';
import type { EventFormValues } from './event-form';

export const OUTING_TRANSPORT_CHOICES = ['walking', 'hiredBus', 'other'] as const;
export type TransportChoice = (typeof OUTING_TRANSPORT_CHOICES)[number];

export const TRANSPORT_LABELS: Record<TransportChoice, string> = {
  walking: 'Caminando',
  hiredBus: 'Ómnibus contratado',
  other: 'Otro',
};

const PRESET_TRANSPORTS: TransportChoice[] = ['walking', 'hiredBus'];

export interface TransportFields {
  transportChoice: TransportChoice | null;
  otherTransport: string;
}

export function isOuting(values: Pick<EventFormValues, 'type'>): boolean {
  return values.type === 'outing';
}

/** events.transport is free text: a preset chip stores its word, Otro stores what was typed. */
export function transportValue(values: TransportFields): string | null {
  if (values.transportChoice === null) return null;
  if (values.transportChoice === 'other') return values.otherTransport.trim() || null;
  return TRANSPORT_LABELS[values.transportChoice];
}

export function transportFieldsFromStored(transport: string | null): TransportFields {
  const stored = transport?.trim() ?? '';
  if (!stored) return { transportChoice: null, otherTransport: '' };
  const preset = PRESET_TRANSPORTS.find((choice) => TRANSPORT_LABELS[choice] === stored);
  return preset ? { transportChoice: preset, otherTransport: '' } : { transportChoice: 'other', otherTransport: stored };
}

/** An outing has a time out and back, so "Todo el día" does not apply to it. */
export function typeChangeValues(type: EventType): Partial<EventFormValues> {
  return type === 'outing' ? { type, allDay: false, untilDate: null } : { type };
}

export function isOutingComplete(values: EventFormValues): boolean {
  if (!isOuting(values)) return true;
  return values.place.trim() !== '' && transportValue(values) !== null;
}

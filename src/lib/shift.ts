// The backend names shifts 'morning' / 'afternoon'; end-user copy says Matutino / Vespertino (round 14).
export type ShiftName = 'morning' | 'afternoon';

export function shiftLabel(shift: ShiftName): string {
  return shift === 'morning' ? 'Matutino' : 'Vespertino';
}

export function shiftBandTitle(shift: ShiftName): string {
  return shift === 'morning' ? 'Turno matutino' : 'Turno vespertino';
}

/** F6 opens on the current shift: Vespertino from 13:00. */
export function currentShift(now = new Date()): ShiftName {
  return now.getHours() >= 13 ? 'afternoon' : 'morning';
}

export function groupLabel(roomName: string, shift: ShiftName): string {
  return `${roomName} · ${shiftLabel(shift)}`;
}

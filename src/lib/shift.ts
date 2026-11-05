// The backend names shifts 'morning' / 'afternoon'; end-user copy says Matutino / Vespertino.
export type ShiftName = 'morning' | 'afternoon';

export function shiftLabel(shift: ShiftName): string {
  return shift === 'morning' ? 'Matutino' : 'Vespertino';
}

export function shiftBandTitle(shift: ShiftName): string {
  return shift === 'morning' ? 'Turno matutino' : 'Turno vespertino';
}

export function currentShift(now = new Date()): ShiftName {
  return now.getHours() >= 13 ? 'afternoon' : 'morning';
}

export function groupLabel(roomName: string, shift: ShiftName): string {
  return `${roomName} · ${shiftLabel(shift)}`;
}

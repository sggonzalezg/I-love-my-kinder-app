import { SHEET_CLOSE_HEIGHT_SHARE, SHEET_CLOSE_VELOCITY, SHEET_OVERDRAG_LIMIT } from '@/constants/sheet';

/** A flick closes the sheet as well as a long drag, as long as it ends below where it started. */
export function shouldCloseSheet(translationY: number, velocityY: number, sheetHeight: number): boolean {
  'worklet';
  if (translationY <= 0) return false;
  return velocityY > SHEET_CLOSE_VELOCITY || translationY > sheetHeight * SHEET_CLOSE_HEIGHT_SHARE;
}

/** Downward the sheet follows the finger; upward it rubber-bands toward a small limit. */
export function sheetDragOffset(translationY: number): number {
  'worklet';
  if (translationY >= 0) return translationY;
  return -SHEET_OVERDRAG_LIMIT * (1 - Math.exp(translationY / SHEET_OVERDRAG_LIMIT));
}

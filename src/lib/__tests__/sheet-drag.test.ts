import { SHEET_OVERDRAG_LIMIT } from '@/constants/sheet';
import { sheetDragOffset, shouldCloseSheet } from '@/lib/sheet-drag';

const SHEET_HEIGHT = 400;

describe('shouldCloseSheet', () => {
  it('closes when dragged past 30% of the sheet height', () => {
    expect(shouldCloseSheet(130, 0, SHEET_HEIGHT)).toBe(true);
  });

  it('stays open when a slow drag ends before 30% of the height', () => {
    expect(shouldCloseSheet(100, 200, SHEET_HEIGHT)).toBe(false);
  });

  it('closes on a short downward flick', () => {
    expect(shouldCloseSheet(20, 1200, SHEET_HEIGHT)).toBe(true);
  });

  it('stays open on a fast flick that ends above where it started', () => {
    expect(shouldCloseSheet(-10, 1200, SHEET_HEIGHT)).toBe(false);
  });

  it('stays open on an upward flick', () => {
    expect(shouldCloseSheet(40, -1500, SHEET_HEIGHT)).toBe(false);
  });
});

describe('sheetDragOffset', () => {
  it('follows the finger downward', () => {
    expect(sheetDragOffset(120)).toBe(120);
  });

  it('resists an upward drag', () => {
    const offset = sheetDragOffset(-60);
    expect(offset).toBeLessThan(0);
    expect(offset).toBeGreaterThan(-60);
  });

  it('never lifts the sheet past the overdrag limit', () => {
    expect(sheetDragOffset(-1000)).toBeGreaterThanOrEqual(-SHEET_OVERDRAG_LIMIT);
  });
});

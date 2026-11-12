import { AccessibilityInfo, type HostInstance } from 'react-native';

import { moveAccessibilityFocus, shouldReturnFocusToTrigger } from '../accessibility-focus';

describe('shouldReturnFocusToTrigger', () => {
  it('returns focus when the sheet goes from open to closed', () => {
    expect(shouldReturnFocusToTrigger(true, false)).toBe(true);
  });

  it('keeps focus where it is when the sheet opens', () => {
    expect(shouldReturnFocusToTrigger(false, true)).toBe(false);
  });

  it('keeps focus where it is on the first render with the sheet closed', () => {
    expect(shouldReturnFocusToTrigger(false, false)).toBe(false);
  });
});

describe('moveAccessibilityFocus', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('sends a focus event to the mounted element', () => {
    const sendEvent = jest.spyOn(AccessibilityInfo, 'sendAccessibilityEvent').mockImplementation(() => undefined);
    const element = {} as HostInstance;

    moveAccessibilityFocus({ current: element });

    expect(sendEvent).toHaveBeenCalledWith(element, 'focus');
  });

  it('does nothing while the element is not mounted', () => {
    const sendEvent = jest.spyOn(AccessibilityInfo, 'sendAccessibilityEvent').mockImplementation(() => undefined);

    moveAccessibilityFocus({ current: null });

    expect(sendEvent).not.toHaveBeenCalled();
  });
});

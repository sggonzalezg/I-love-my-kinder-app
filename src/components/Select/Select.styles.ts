import { StyleSheet } from 'react-native';

import { createThemedStyles } from '@/theme/themed-styles';
import { radius, space, type } from '@/theme/tokens';

export const SEARCH_ICON_SIZE = 18;
export const LOADING_BAR_HEIGHT = 40;
export const LOADING_BAR_COUNT = 3;

const SEARCH_HEIGHT = 44;
const SHORT_LIST_MAX_HEIGHT = '72%';
const SEARCH_LIST_HEIGHT = '88%';
const SEARCH_PADDING_HORIZONTAL = 14;
const GROUP_PADDING_TOP = 14;
const GROUP_PADDING_BOTTOM = 6;

export const styles = StyleSheet.create({
  shortSheet: { maxHeight: SHORT_LIST_MAX_HEIGHT },
  searchSheet: { height: SEARCH_LIST_HEIGHT },
  title: { marginBottom: space.s3 },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.s2,
    height: SEARCH_HEIGHT,
    paddingHorizontal: SEARCH_PADDING_HORIZONTAL,
    marginBottom: space.s2,
    borderRadius: radius.full,
  },
  searchInput: { flex: 1, height: '100%', fontFamily: type.body.fontFamily, fontSize: type.body.fontSize },
  fitList: { flexGrow: 0, flexShrink: 1, marginHorizontal: -space.s2 },
  fillList: { flex: 1, marginHorizontal: -space.s2 },
  group: { paddingTop: GROUP_PADDING_TOP, paddingBottom: GROUP_PADDING_BOTTOM, paddingHorizontal: space.s3 },
  message: { paddingVertical: space.s4, paddingHorizontal: space.s3 },
  loading: { gap: space.s2, paddingVertical: space.s2 },
});

export const useSearchColorStyles = createThemedStyles((colors) => ({
  box: { backgroundColor: colors.raised },
  input: { color: colors.ink },
}));

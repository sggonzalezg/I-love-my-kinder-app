import * as Haptics from 'expo-haptics';
import { Search } from 'lucide-react-native';
import { useReducer } from 'react';
import { FlatList, TextInput, View } from 'react-native';

import { SelectOptionRow } from '@/components/Select/components/SelectOptionRow/SelectOptionRow';
import { SelectTrigger, type SelectVariant } from '@/components/Select/components/SelectTrigger/SelectTrigger';
import { SELECT_COPY } from '@/components/Select/select-copy';
import {
  INITIAL_SELECT_STATE,
  SELECT_ACTIONS,
  buildSelectRows,
  isFilteringValue,
  selectReducer,
  shouldShowSearch,
  type SelectOption,
  type SelectRow,
} from '@/components/Select/select-reducer';
import { Sheet } from '@/components/sheet';
import { Skeleton } from '@/components/skeleton';
import { Text } from '@/components/text';
import { useSheetAccessibilityFocus } from '@/lib/accessibility-focus';
import { iconStroke } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

import { LOADING_BAR_COUNT, LOADING_BAR_HEIGHT, SEARCH_ICON_SIZE, styles, useSearchColorStyles } from './Select.styles';

export type { SelectOption, SelectVariant };

interface SelectProps {
  options: SelectOption[];
  value: string | null;
  onChange: (value: string) => void;
  label: string;
  /** Defaults to the label; the room switch says "Elegí la sala". */
  sheetTitle?: string;
  placeholder?: string;
  variant?: SelectVariant;
  /** Defaults to on above eight options; lists of people or children turn it on. */
  searchable?: boolean;
  searchPlaceholder?: string;
  error?: string | null;
  disabled?: boolean;
  disabledHelp?: string;
  loading?: boolean;
  emptyText?: string;
}

function rowKey(row: SelectRow): string {
  return row.kind === 'group' ? `group:${row.title}` : row.option.value;
}

export function Select({
  options,
  value,
  onChange,
  label,
  sheetTitle = label,
  placeholder,
  variant = 'field',
  searchable,
  searchPlaceholder = SELECT_COPY.search,
  error,
  disabled,
  disabledHelp,
  loading,
  emptyText,
}: SelectProps) {
  const [state, dispatch] = useReducer(selectReducer, INITIAL_SELECT_STATE);
  const colors = useColors();
  const searchColorStyles = useSearchColorStyles();
  const selectedOption = options.find((option) => option.value === value);
  const hasSearch = shouldShowSearch(options, searchable);
  const rows = buildSelectRows(options, state.query);
  const { titleRef, triggerRef, focusTitle } = useSheetAccessibilityFocus(state.isOpen);
  const close = () => dispatch({ type: SELECT_ACTIONS.CLOSED });

  function choose(option: SelectOption) {
    Haptics.selectionAsync();
    dispatch({ type: SELECT_ACTIONS.OPTION_CHOSEN });
    if (option.value !== value) onChange(option.value);
  }

  function renderRow({ item }: { item: SelectRow }) {
    if (item.kind === 'group') {
      return (
        <Text variant="smallStrong" tone="muted" style={styles.group} accessibilityRole="header">
          {item.title}
        </Text>
      );
    }
    return <SelectOptionRow option={item.option} selected={item.option.value === value} onChoose={choose} />;
  }

  function renderEmptyList() {
    if (loading) {
      return (
        <View style={styles.loading} accessibilityLabel={SELECT_COPY.loading} accessibilityState={{ busy: true }}>
          {Array.from({ length: LOADING_BAR_COUNT }, (_, index) => (
            <Skeleton key={index} height={LOADING_BAR_HEIGHT} />
          ))}
        </View>
      );
    }
    const message = state.query.trim() ? SELECT_COPY.noResults(state.query.trim()) : emptyText;
    return message ? (
      <Text tone="muted" style={styles.message}>
        {message}
      </Text>
    ) : null;
  }

  return (
    <>
      <SelectTrigger
        ref={triggerRef}
        variant={variant}
        label={label}
        valueLabel={selectedOption?.label}
        valueImageUrl={selectedOption?.imageUrl}
        placeholder={placeholder}
        isOpen={state.isOpen}
        isFiltering={variant === 'chip' && isFilteringValue(options, value)}
        error={error}
        disabled={disabled}
        disabledHelp={disabledHelp}
        onPress={() => dispatch({ type: SELECT_ACTIONS.OPENED })}
      />
      <Sheet visible={state.isOpen} onClose={close} onShow={focusTitle} sheetStyle={hasSearch ? styles.searchSheet : styles.shortSheet}>
        <Text ref={titleRef} variant="sheetTitle" style={styles.title} accessibilityRole="header">
          {sheetTitle}
        </Text>
        {hasSearch ? (
          <View style={[styles.search, searchColorStyles.box]}>
            <Search size={SEARCH_ICON_SIZE} color={colors.muted} strokeWidth={iconStroke} />
            <TextInput
              value={state.query}
              onChangeText={(query) => dispatch({ type: SELECT_ACTIONS.QUERY_CHANGED, query })}
              placeholder={searchPlaceholder}
              placeholderTextColor={colors.muted}
              accessibilityLabel={searchPlaceholder}
              autoCorrect={false}
              autoFocus
              style={[styles.searchInput, searchColorStyles.input]}
            />
          </View>
        ) : null}
        <FlatList
          data={loading ? [] : rows}
          keyExtractor={rowKey}
          renderItem={renderRow}
          ListEmptyComponent={renderEmptyList}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
          style={hasSearch ? styles.fillList : styles.fitList}
        />
      </Sheet>
    </>
  );
}

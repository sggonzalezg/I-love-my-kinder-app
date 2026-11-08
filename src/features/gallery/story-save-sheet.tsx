import { Lock, Shield, type LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { Button } from '@/components/button';
import { Sheet } from '@/components/sheet';
import { Text } from '@/components/text';
import { SAVE_MEDIA_NOTICE } from '@/legal/texts';
import { useColors } from '@/theme/use-theme';

import { STORY_COPY } from './story-copy';
import type { StorySheet } from './story-viewer-reducer';
import { SHEET_ICON_SIZE, styles } from './story-save-sheet.styles';

interface SheetContent {
  icon: LucideIcon;
  title: string;
  body: string;
  note: string | null;
  confirmLabel: string;
  dismissLabel: string;
}

const CONTENT: Record<StorySheet, SheetContent> = {
  notice: {
    icon: Shield,
    title: SAVE_MEDIA_NOTICE.title,
    body: SAVE_MEDIA_NOTICE.body,
    note: null,
    confirmLabel: SAVE_MEDIA_NOTICE.action,
    dismissLabel: STORY_COPY.cancel,
  },
  permissionDenied: {
    icon: Lock,
    title: STORY_COPY.permissionTitle,
    body: STORY_COPY.permissionBody,
    note: STORY_COPY.permissionNote,
    confirmLabel: STORY_COPY.openSettings,
    dismissLabel: STORY_COPY.notNow,
  },
};

interface StorySaveSheetProps {
  sheet: StorySheet | null;
  onConfirm: () => void;
  onDismiss: () => void;
}

export function StorySaveSheet({ sheet, onConfirm, onDismiss }: StorySaveSheetProps) {
  const colors = useColors();
  const content = sheet ? CONTENT[sheet] : null;

  return (
    <Sheet visible={content !== null} onClose={onDismiss}>
      {content ? (
        <View style={styles.body}>
          <content.icon size={SHEET_ICON_SIZE} color={colors.blue} strokeWidth={1.8} />
          <Text variant="title" accessibilityRole="header">
            {content.title}
          </Text>
          <Text>{content.body}</Text>
          {content.note ? (
            <Text variant="small" color="muted">
              {content.note}
            </Text>
          ) : null}
          <View style={styles.actions}>
            <Button label={content.confirmLabel} block onPress={onConfirm} />
            <Button label={content.dismissLabel} variant="plain" block onPress={onDismiss} />
          </View>
        </View>
      ) : null}
    </Sheet>
  );
}

import { StatusBar } from 'expo-status-bar';
import { CircleAlert } from 'lucide-react-native';
import { useEffect, useReducer, useRef } from 'react';
import { ActivityIndicator, Modal, Pressable, View } from 'react-native';
import { GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { cancelAnimation, Easing, FadeIn, FadeInLeft, FadeInRight, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Toast, TOAST_VISIBLE_MS } from '@/components/toast';
import { PHOTO_STORY_MS, STORY_SLIDE_DISTANCE } from '@/constants/story';
import type { MediaDaySection } from '@/lib/gallery';
import {
  nextDayPosition,
  nextStoryPosition,
  previousDayPosition,
  previousStoryPosition,
  storyPositionOf,
  storyTimeLabel,
  type StoryPosition,
} from '@/lib/story';
import { duration, easeOut } from '@/theme/motion';

import { StoryBottomBar } from './story-bottom-bar';
import { STORY_COPY } from './story-copy';
import { StoryHeader } from './story-header';
import { STORY_ICON_COLOR } from './story-icon-button.styles';
import { StoryLoadError } from './story-load-error';
import { StoryPhoto } from './story-photo';
import { StoryProgressBars } from './story-progress-bars';
import { StorySaveSheet } from './story-save-sheet';
import { StoryScrim } from './story-scrim';
import { StoryVideo } from './story-video';
import {
  STORY_VIEWER_ACTIONS,
  initialStoryViewerState,
  isStoryPaused,
  storyViewerReducer,
  type StoryDirection,
  type StoryMediaStatus,
} from './story-viewer-reducer';
import { bottomInsetStyle, styles, toastLayerInsetStyle, topInsetStyle } from './story-viewer.styles';
import { useScreenReaderEnabled } from './use-screen-reader-enabled';
import { useStoryGestures } from './use-story-gestures';
import { useStorySave } from './use-story-save';

interface StoryViewerProps {
  sections: MediaDaySection[];
  groupLabel: string;
  startMediaId: string;
  onClose: () => void;
}

export function StoryViewer({ sections, groupLabel, startMediaId, onClose }: StoryViewerProps) {
  const reduced = useReducedMotion();
  const insets = useSafeAreaInsets();
  const screenReaderOn = useScreenReaderEnabled();
  const [state, dispatch] = useReducer(storyViewerReducer, storyPositionOf(sections, startMediaId), initialStoryViewerState);
  const progress = useSharedValue(0);
  const photoElapsedMs = useRef(0);

  const dayLengths = sections.map((section) => section.items.length);
  const day = sections[state.position.dayIndex];
  const media = day.items[state.position.itemIndex];
  const isVideo = media.type === 'video';
  const failed = state.mediaStatus === 'failed' || !media.url;
  const paused = isStoryPaused(state, screenReaderOn);
  const save = useStorySave(media, state, dispatch);

  function moveTo(position: StoryPosition | null, direction: StoryDirection) {
    if (!position) return;
    progress.set(0);
    dispatch({ type: STORY_VIEWER_ACTIONS.MOVED, position, direction });
  }

  function goNext() {
    const next = nextStoryPosition(state.position, dayLengths);
    if (next) moveTo(next, 1);
    else onClose();
  }

  function goPrevious() {
    const previous = previousStoryPosition(state.position, dayLengths);
    if (previous !== state.position) moveTo(previous, -1);
  }

  function jumpDay(direction: StoryDirection) {
    moveTo(direction === 1 ? nextDayPosition(state.position, dayLengths) : previousDayPosition(state.position), direction);
  }

  function setMediaStatus(status: StoryMediaStatus) {
    dispatch({ type: STORY_VIEWER_ACTIONS.MEDIA_STATUS_CHANGED, status });
  }

  function onVideoEnded() {
    if (!screenReaderOn) goNext();
  }

  const { gesture, stageStyle } = useStoryGestures({ onClose, onSwipeDay: jumpDay });

  useEffect(() => {
    photoElapsedMs.current = 0;
  }, [media.id]);

  // The timer advances the story; the bar only decorates it, so a pause keeps the elapsed time for the resume.
  useEffect(() => {
    if (isVideo || paused) return;
    const remainingMs = Math.max(PHOTO_STORY_MS - photoElapsedMs.current, 0);
    const startedAt = Date.now();
    progress.set(reduced ? 1 : withTiming(1, { duration: remainingMs, easing: Easing.linear }));
    const timer = setTimeout(goNext, remainingMs);
    return () => {
      clearTimeout(timer);
      cancelAnimation(progress);
      photoElapsedMs.current += Date.now() - startedAt;
    };
    // goNext reads the current position, which media.id already tracks.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [media.id, isVideo, paused, reduced, progress]);

  useEffect(() => {
    if (!state.toast) return;
    const timer = setTimeout(() => dispatch({ type: STORY_VIEWER_ACTIONS.TOAST_HIDDEN }), TOAST_VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [state.toast]);

  const entering = reduced
    ? FadeIn.duration(duration.fast)
    : (state.direction === 1 ? FadeInRight : FadeInLeft)
        .duration(duration.base)
        .easing(easeOut)
        .withInitialValues({ transform: [{ translateX: STORY_SLIDE_DISTANCE * state.direction }] });
  const loading = !failed && (state.mediaStatus === 'loading' || state.mediaStatus === 'buffering');

  return (
    <Modal visible transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <GestureHandlerRootView style={styles.root}>
        <StatusBar style="light" />
        <GestureDetector gesture={gesture}>
          <Animated.View style={[styles.stage, stageStyle]}>
            <Animated.View key={`${media.id}-${state.attempt}`} entering={entering} style={styles.media}>
              {media.url && media.type === 'photo' ? <StoryPhoto url={media.url} onStatusChange={setMediaStatus} /> : null}
              {media.url && media.type === 'video' ? (
                <StoryVideo
                  url={media.url}
                  muted={state.muted}
                  playing={state.sheet === null}
                  progress={progress}
                  onStatusChange={setMediaStatus}
                  onDurationLoaded={(seconds) => dispatch({ type: STORY_VIEWER_ACTIONS.DURATION_LOADED, seconds })}
                  onEnded={onVideoEnded}
                />
              ) : null}
            </Animated.View>
            {loading ? <ActivityIndicator size="large" color={STORY_ICON_COLOR} style={styles.spinner} /> : null}
            <View style={styles.tapZones}>
              <Pressable style={styles.previousZone} onPress={goPrevious} accessibilityRole="button" accessibilityLabel={STORY_COPY.previous} />
              <Pressable style={styles.nextZone} onPress={goNext} accessibilityRole="button" accessibilityLabel={STORY_COPY.next} />
            </View>
            {failed ? <StoryLoadError isVideo={isVideo} onRetry={() => dispatch({ type: STORY_VIEWER_ACTIONS.RETRIED })} /> : null}
            <StoryScrim edge="top" />
            <StoryScrim edge="bottom" />
            <View style={[styles.top, topInsetStyle(insets.top)]}>
              <StoryProgressBars count={day.items.length} currentIndex={state.position.itemIndex} progress={progress} />
              <StoryHeader
                uploader={media.uploader}
                timeLabel={storyTimeLabel(media.createdAt, new Date(), isVideo ? state.videoSeconds : null)}
                isVideo={isVideo}
                muted={state.muted}
                onToggleSound={() => dispatch({ type: STORY_VIEWER_ACTIONS.MUTE_TOGGLED })}
                onClose={onClose}
              />
            </View>
            <View style={[styles.bottom, bottomInsetStyle(insets.bottom)]}>
              <StoryBottomBar
                groupLabel={groupLabel}
                failed={failed}
                saving={state.savingId === media.id}
                saved={state.savedIds.includes(media.id)}
                onSave={save.requestSave}
                onNext={goNext}
              />
            </View>
          </Animated.View>
        </GestureDetector>
        {state.toast ? (
          <View style={[styles.toastLayer, toastLayerInsetStyle(insets.bottom)]} pointerEvents="none">
            <Toast
              message={state.toast === 'saved' ? STORY_COPY.savedToast : STORY_COPY.saveFailedToast}
              icon={state.toast === 'saved' ? undefined : CircleAlert}
            />
          </View>
        ) : null}
        <StorySaveSheet
          sheet={state.sheet}
          onConfirm={state.sheet === 'notice' ? save.acceptNotice : save.openSettings}
          onDismiss={() => dispatch({ type: STORY_VIEWER_ACTIONS.SHEET_CLOSED })}
        />
      </GestureHandlerRootView>
    </Modal>
  );
}

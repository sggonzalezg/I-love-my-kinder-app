import { useVideoPlayer, VideoView, type VideoPlayer, type VideoPlayerStatus } from 'expo-video';
import { useEffect } from 'react';
import { Easing, useReducedMotion, withTiming, type SharedValue } from 'react-native-reanimated';

import { VIDEO_TIME_UPDATE_SECONDS } from '@/constants/story';

import { STORY_COPY } from './story-copy';
import { styles } from './story-media.styles';
import type { StoryMediaStatus } from './story-viewer-reducer';

const MEDIA_STATUS: Record<VideoPlayerStatus, StoryMediaStatus> = {
  idle: 'buffering',
  loading: 'buffering',
  readyToPlay: 'ready',
  error: 'failed',
};

const TIME_UPDATE_MS = VIDEO_TIME_UPDATE_SECONDS * 1000;

// The native player is mutable by design; the React Compiler only allows it outside the component.
function setMuted(player: VideoPlayer, muted: boolean) {
  player.muted = muted;
}

interface StoryVideoProps {
  url: string;
  muted: boolean;
  playing: boolean;
  progress: SharedValue<number>;
  onStatusChange: (status: StoryMediaStatus) => void;
  onDurationLoaded: (seconds: number) => void;
  onEnded: () => void;
}

export function StoryVideo({ url, muted, playing, progress, onStatusChange, onDurationLoaded, onEnded }: StoryVideoProps) {
  const reduced = useReducedMotion();
  const player = useVideoPlayer(url, (created) => {
    created.muted = true;
    created.timeUpdateEventInterval = VIDEO_TIME_UPDATE_SECONDS;
  });

  useEffect(() => setMuted(player, muted), [player, muted]);

  useEffect(() => {
    if (playing) player.play();
    else player.pause();
  }, [player, playing]);

  useEffect(() => {
    const subscriptions = [
      player.addListener('statusChange', ({ status }) => onStatusChange(MEDIA_STATUS[status])),
      player.addListener('sourceLoad', ({ duration }) => onDurationLoaded(duration)),
      player.addListener('playToEnd', onEnded),
      player.addListener('timeUpdate', ({ currentTime }) => {
        if (player.duration <= 0) return;
        const fraction = Math.min(currentTime / player.duration, 1);
        progress.set(reduced ? fraction : withTiming(fraction, { duration: TIME_UPDATE_MS, easing: Easing.linear }));
      }),
    ];
    return () => subscriptions.forEach((subscription) => subscription.remove());
  }, [player, progress, reduced, onStatusChange, onDurationLoaded, onEnded]);

  return <VideoView player={player} style={styles.media} contentFit="cover" nativeControls={false} accessibilityLabel={STORY_COPY.videoLabel} />;
}

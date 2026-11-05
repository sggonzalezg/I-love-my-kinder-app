import { useEffect, useRef, useState } from 'react';
import { TextInput, View, ViewStyle, type TextInputProps } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useColors } from '@/theme/use-theme';
import { space, size, type as typeScale, radius } from '@/theme/tokens';

const BOX_SIZE = 60;
const BOX_GAP = 12;
const SHAKE_OFFSET = 6;
const NUM_BOXES = 6;

interface OtpInputProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: boolean;
  editable?: boolean;
  style?: ViewStyle;
}

export default function OtpInput({ value, onChangeText, error = false, editable = true, style }: OtpInputProps) {
  const c = useColors();
  const inputRef = useRef<any>(null);
  const shakeX = useSharedValue(0);
  const [prevError, setPrevError] = useState(false);

  useEffect(() => {
    if (error && !prevError) {
      // Trigger shake animation: ±6 px, 3 cycles = 600 ms
      shakeX.value = withSpring(0, { damping: 18, stiffness: 220 });
      const shakeSequence = () => {
        shakeX.value = SHAKE_OFFSET;
        setTimeout(() => {
          shakeX.value = -SHAKE_OFFSET;
          setTimeout(() => {
            shakeX.value = SHAKE_OFFSET;
            setTimeout(() => {
              shakeX.value = -SHAKE_OFFSET;
              setTimeout(() => {
                shakeX.value = SHAKE_OFFSET;
                setTimeout(() => {
                  shakeX.value = 0;
                }, 100);
              }, 100);
            }, 100);
          }, 100);
        }, 100);
      };
      shakeSequence();
    }
    setPrevError(error);
  }, [error, shakeX, prevError]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const handlePaste = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, NUM_BOXES);
    onChangeText(digits);
  };

  return (
    <Animated.View style={[animatedStyle, style]}>
      <View style={{ display: 'none' }}>
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={handlePaste}
          autoComplete="sms-otp"
          textContentType="oneTimeCode"
          keyboardType="numeric"
          maxLength={NUM_BOXES}
          editable={editable}
        />
      </View>

      <View
        style={{
          flexDirection: 'row',
          gap: BOX_GAP,
          justifyContent: 'center',
        }}
        onTouchEnd={() => inputRef.current?.focus()}
      >
        {Array.from({ length: NUM_BOXES }).map((_, i) => (
          <View
            key={i}
            style={{
              width: BOX_SIZE,
              height: BOX_SIZE,
              borderWidth: 2,
              borderColor: error ? c.red : value.length > i ? c.blue : c.border,
              borderRadius: radius.md,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: c.surface,
            }}
          >
            {value[i] && (
              <TextInput
                style={{
                  color: c.ink,
                  ...typeScale.display,
                  textAlign: 'center',
                  width: '100%',
                  height: '100%',
                  padding: 0,
                  textAlignVertical: 'center',
                }}
                value={value[i]}
                editable={false}
              />
            )}
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

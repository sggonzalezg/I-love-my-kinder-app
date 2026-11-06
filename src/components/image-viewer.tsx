import { View, Image, Pressable, Modal, StyleSheet } from 'react-native';
import { useState } from 'react';
import { X } from 'lucide-react-native';
import { Text } from './text';
import { useColors } from '@/theme/use-theme';
import { Button } from './button';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { space, radius } from '@/theme/tokens';

interface ImageViewerProps {
  imageUrl: string;
  title?: string;
  onClose: () => void;
}

export function ImageViewer({ imageUrl, title, onClose }: ImageViewerProps) {
  const colors = useColors();

  return (
    <Modal visible={true} transparent={true} animationType="fade">
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.black }}>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.black,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              position: 'absolute',
              top: space.s4,
              right: space.s4,
              zIndex: 10,
            }}
          >
            <Pressable
              onPress={onClose}
              style={({ pressed }) => ({
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: `rgba(0, 0, 0, 0.5)`,
                justifyContent: 'center',
                alignItems: 'center',
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <X size={24} color={colors.white} />
            </Pressable>
          </View>

          <Image
            source={{ uri: imageUrl }}
            style={{
              width: '90%',
              height: '70%',
              resizeMode: 'contain',
              borderRadius: radius.sm,
            }}
          />

          <View
            style={{
              position: 'absolute',
              bottom: space.s6,
              left: space.s4,
              right: space.s4,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {title && (
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: colors.white,
                  flex: 1,
                }}
              >
                {title}
              </Text>
            )}
            <Button
              label="Guardar"
              onPress={() => {
                // TODO: Implement save functionality
              }}
              style={{ marginLeft: space.s4 }}
            />
          </View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

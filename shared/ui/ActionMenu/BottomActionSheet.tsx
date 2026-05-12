import { useThemedStyles } from "@/hooks/useThemedStyles";

import { ThemedText } from "@/shared/core/ThemedText";
import GradientView from "@/shared/Gradient";
import React, { ReactNode, useEffect } from "react";
import { Modal, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from "react-native-reanimated";

interface BottomActionSheetProps {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

const BottomActionSheet: React.FC<BottomActionSheetProps> = ({
  isVisible,
  onClose,
  title,
  children,
}) => {
  const styles = useThemedStyles((c) => ({

  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  container: {
    width: "100%",
    maxHeight: "85%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  sheet: {
    width: "100%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingBottom: 32,
    paddingHorizontal: 16,
    minHeight: 200,
    flex: 0,
  },
  handleContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: c.secondary,
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
    color: c.brightText,
  },
  content: {
    width: "100%",
  },
  contentContainer: {
    paddingBottom: 8,
  },

}));

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(isVisible ? 1 : 0, {
      duration: 250,
    });
  }, [isVisible, progress]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(progress.value, [0, 1], [600, 0]),
      },
    ],
  }));

  if (!isVisible) return null;

  return (
    <Modal visible={isVisible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View style={[styles.overlay, overlayStyle]} />
        </TouchableWithoutFeedback>

        <Animated.View style={[styles.container, sheetStyle]}>
          <GradientView style={styles.sheet}>
            <View style={styles.handleContainer}>
              <View style={styles.handle} />
            </View>

            {title && (
              <ThemedText type="subtitle" style={styles.title}>
                {title}
              </ThemedText>
            )}

            <ScrollView 
              style={styles.content}
              contentContainerStyle={styles.contentContainer}
              showsVerticalScrollIndicator={false}
            >
              {children}
            </ScrollView>
          </GradientView>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default BottomActionSheet;

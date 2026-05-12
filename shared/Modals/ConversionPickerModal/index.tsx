import type { FileConversionType } from "@/api/types/file";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useThemedStyles } from "@/hooks/useThemedStyles";

import { ThemedText } from "@/shared/core/ThemedText";
import type { ConversionOption } from "@/shared/fileConversion/getConversionOptions";
import GradientView from "@/shared/Gradient";
import { Feather } from "@expo/vector-icons";
import { MotiView } from "moti";
import React, { useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export interface ConversionPickerModalProps {
  visible: boolean;
  title?: string;
  fileName: string;
  options: ConversionOption[];
  isSubmitting: boolean;
  onClose: () => void;
  onSelect: (conversion: FileConversionType) => void;
}

const ConversionPickerModal: React.FC<ConversionPickerModalProps> = ({
  visible,
  title = "Конвертация",
  fileName,
  options,
  isSubmitting,
  onClose,
  onSelect,
}) => {
  const themeColors = useThemeColors();
  const styles = useThemedStyles((c) => ({

  fill: {
    flex: 1,
  },
  modalRoot: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.52)",
  },
  sheetWrap: {
    width: "100%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  sheet: {
    flex: 0,
    flexGrow: 0,
    width: "100%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingBottom: 28,
    paddingHorizontal: 16,
  },
  handleRow: { alignItems: "center", marginBottom: 12 },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: c.secondary,
  },
  title: {
    textAlign: "center",
    color: c.brightText,
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    color: c.secondary,
    fontSize: 13,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  scroll: {
    width: "100%",
  },
  scrollContent: {
    paddingBottom: 12,
    gap: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: c.cardBackground,
    gap: 12,
    borderWidth: 1,
    borderColor: c.border,
  },
  rowDisabled: { opacity: 0.45 },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: c.inactive,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: {
    flex: 1,
    fontSize: 16,
    color: c.brightText,
  },
  loadingLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  loadingCard: {
    backgroundColor: c.cardBackground,
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 28,
    alignItems: "center",
    minWidth: 260,
    borderWidth: 1,
    borderColor: c.border,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "600",
    color: c.brightText,
    marginTop: 16,
    marginBottom: 6,
  },
  loadingHint: {
    fontSize: 13,
    color: c.secondary,
    textAlign: "center",
  },

}));

  const { height: windowHeight } = useWindowDimensions();
  const scrollMaxHeight = useMemo(
    () => Math.min(420, Math.round(windowHeight * 0.5)),
    [windowHeight]
  );

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(visible ? 1 : 0, { duration: 250 });
  }, [visible, progress]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(progress.value, [0, 1], [420, 0]) }],
  }));

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="none" onRequestClose={isSubmitting ? undefined : onClose}>
      <View style={styles.fill}>
        <View style={styles.modalRoot}>
          <TouchableWithoutFeedback onPress={isSubmitting ? undefined : onClose}>
            <Animated.View style={[styles.backdrop, overlayStyle]} />
          </TouchableWithoutFeedback>

          <Animated.View
            style={[
              styles.sheetWrap,
              sheetStyle,
              { maxHeight: Math.round(windowHeight * 0.88) },
            ]}
          >
            <GradientView style={styles.sheet}>
              <View style={styles.handleRow}>
                <View style={styles.handle} />
              </View>
              <ThemedText type="subtitle" style={styles.title}>
                {title}
              </ThemedText>
              <ThemedText style={styles.subtitle} numberOfLines={2}>
                {fileName}
              </ThemedText>

              <ScrollView
                style={[styles.scroll, { maxHeight: scrollMaxHeight }]}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={options.length > 4}
                keyboardShouldPersistTaps="handled"
              >
                {options.map((opt) => (
                  <TouchableOpacity
                    key={opt.conversion}
                    style={[styles.row, isSubmitting && styles.rowDisabled]}
                    onPress={() => !isSubmitting && onSelect(opt.conversion)}
                    activeOpacity={0.75}
                    disabled={isSubmitting}
                  >
                    <View style={styles.rowIcon}>
                      <Feather name="shuffle" size={20} color={themeColors.primary} />
                    </View>
                    <ThemedText style={styles.rowLabel}>{opt.label}</ThemedText>
                    <Feather name="chevron-right" size={18} color={themeColors.secondary} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </GradientView>
          </Animated.View>
        </View>

        {isSubmitting && (
          <View style={styles.loadingLayer} pointerEvents="auto">
            <MotiView
              from={{ opacity: 0.88, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "timing",
                duration: 900,
                loop: true,
                repeatReverse: true,
              }}
              style={styles.loadingCard}
            >
              <ActivityIndicator size="large" color={themeColors.primary} />
              <ThemedText style={styles.loadingText}>Конвертация…</ThemedText>
              <ThemedText style={styles.loadingHint}>Подождите, это может занять время</ThemedText>
            </MotiView>
          </View>
        )}
      </View>
    </Modal>
  );
};

export default ConversionPickerModal;

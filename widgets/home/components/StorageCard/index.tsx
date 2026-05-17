import { useGetStorageInfoQuery } from "@/api/storageApi";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useI18n } from "@/shared/localization";

import { ThemedText } from "@/shared/core/ThemedText";
import ProgressBar from "@/shared/ui/animated/ProgressBar";
import {
  formatBytes,
  storageUsedFraction,
} from "@/widgets/storage/utils/storageQuota";
import React, { useMemo } from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";

interface StorageCardProps {
  activeRoomsCount?: number;
}

const StorageCard = React.memo(({ activeRoomsCount = 0 }: StorageCardProps) => {
  const themeColors = useThemeColors();
  const styles = useThemedStyles((c) => ({

  storageCard: {
    backgroundColor: c.cardBackground,
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: c.border,
  },
  storageCardTitle: {
    color: c.text,
    marginBottom: 8,
  },
  storageCardValue: {
    color: c.brightText,
    marginBottom: 4,
  },
  storageCardSubtitle: {
    color: c.secondary,
    marginBottom: 16,
  },
  storageLoading: {
    marginVertical: 20,
    alignSelf: "flex-start",
  },
  roomsSection: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: c.border,
  },
  roomsTitle: {
    color: c.text,
    marginBottom: 8,
  },
  roomsValue: {
    color: c.primary,
    fontSize: 32,
    fontWeight: "700",
  },
  sharedButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: c.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: c.border,
  },
  sharedButtonText: {
    color: c.primary,
    fontSize: 14,
    fontWeight: "600",
  },

}));

  const { tl } = useI18n();
  const router = useRouter();
  const { data: storageInfo, isLoading, isError } = useGetStorageInfoQuery();

  const usedBytes = storageInfo?.usedBytes ?? 0;
  const maxBytes = storageInfo?.maxBytes ?? 0;

  const progress = useMemo(() => {
    if (!maxBytes || maxBytes <= 0) return 0;
    return Math.round(storageUsedFraction(usedBytes, maxBytes) * 1000) / 10;
  }, [usedBytes, maxBytes]);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  React.useEffect(() => {
    opacity.value = withTiming(1, { duration: 600 });
    translateY.value = withSpring(0, { damping: 15 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.storageCard, animatedStyle]}>
      <ThemedText type="subtitle" style={styles.storageCardTitle}>
        {tl("Хранилище")}
      </ThemedText>
      {isLoading ? (
        <>
          <ActivityIndicator
            size="small"
            color={themeColors.primary}
            style={styles.storageLoading}
          />
          <ThemedText type="small" style={styles.storageCardSubtitle}>
            {tl("Загрузка…")}
          </ThemedText>
          <ProgressBar progress={0} />
        </>
      ) : isError || !storageInfo?.id ? (
        <>
          <ThemedText type="megaTitle" style={styles.storageCardValue}>
            —
          </ThemedText>
          <ThemedText type="small" style={styles.storageCardSubtitle}>
            {tl("Не удалось загрузить данные хранилища")}
          </ThemedText>
          <ProgressBar progress={0} />
        </>
      ) : (
        <>
          <ThemedText type="megaTitle" style={styles.storageCardValue}>
            {formatBytes(usedBytes)}
          </ThemedText>
          <ThemedText type="small" style={styles.storageCardSubtitle}>
            {tl("из")} {formatBytes(maxBytes)} {tl("занято")}
          </ThemedText>
          <ProgressBar progress={progress} />
        </>
      )}
      
      <Animated.View style={styles.roomsSection}>
        <ThemedText type="subtitle" style={styles.roomsTitle}>
          {tl("Активных комнат")}
        </ThemedText>
        <ThemedText type="title" style={styles.roomsValue}>
          {activeRoomsCount}
        </ThemedText>
      </Animated.View>

      <TouchableOpacity
        style={styles.sharedButton}
        onPress={() => router.push("/(tabs)/shared")}
      >
        <Feather name="share-2" size={20} color={themeColors.primary} />
        <ThemedText style={styles.sharedButtonText}>{tl("Общие ресурсы")}</ThemedText>
      </TouchableOpacity>
    </Animated.View>
  );
});

StorageCard.displayName = "StorageCard";

export default StorageCard;

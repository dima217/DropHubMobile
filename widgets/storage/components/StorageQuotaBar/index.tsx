import { useThemeColors } from "@/hooks/useThemeColors";
import { ThemedText } from "@/shared/core/ThemedText";
import { useI18n } from "@/shared/localization";
import React, { useMemo } from "react";
import { StyleSheet, View as RNView } from "react-native";
import {
  formatBytes,
  storageFreeBytes,
  storageUsedFraction,
} from "../../utils/storageQuota";

export interface StorageQuotaBarProps {
  usedBytes: number;
  maxBytes: number;
}

/**
 * Полоска занятости хранилища по данным GET /storage (`usedBytes` / `maxBytes`).
 */
export const StorageQuotaBar: React.FC<StorageQuotaBarProps> = ({
  usedBytes,
  maxBytes,
}) => {
  const { tl } = useI18n();
  const colors = useThemeColors();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrap: {
          marginBottom: 12,
          gap: 6,
        },
        row: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
        },
        label: {
          flex: 1,
          fontSize: 12,
          color: colors.secondary,
        },
        free: {
          fontSize: 12,
          color: colors.secondary,
        },
        freeWarn: {
          color: colors.reject,
        },
        track: {
          height: 6,
          borderRadius: 3,
          backgroundColor: colors.border,
          overflow: "hidden",
        },
        fill: {
          height: "100%",
          borderRadius: 3,
          backgroundColor: colors.primary,
        },
        fillWarn: {
          backgroundColor: colors.reject,
        },
      }),
    [colors]
  );

  if (!Number.isFinite(maxBytes) || maxBytes <= 0) return null;

  const used = Number.isFinite(usedBytes) ? Math.max(0, usedBytes) : 0;
  const fraction = storageUsedFraction(used, maxBytes);
  const free = storageFreeBytes(maxBytes, used);
  const nearFull = fraction >= 0.9;

  return (
    <RNView style={styles.wrap}>
      <RNView style={styles.row}>
        <ThemedText style={styles.label} numberOfLines={1}>
          {tl("Хранилище")}: {formatBytes(used)} {tl("из")} {formatBytes(maxBytes)}
        </ThemedText>
        <ThemedText
          style={[styles.free, nearFull && styles.freeWarn]}
          numberOfLines={1}
        >
          {tl("свободно")} {formatBytes(free)}
        </ThemedText>
      </RNView>
      <RNView style={styles.track}>
        <RNView
          style={[
            styles.fill,
            { width: `${fraction * 100}%` },
            nearFull && styles.fillWarn,
          ]}
        />
      </RNView>
    </RNView>
  );
};

import { useThemeColors } from "@/hooks/useThemeColors";
import { ThemedText } from "@/shared/core/ThemedText";
import React, { useMemo } from "react";
import { TouchableOpacity, View as RNView } from "react-native";
import { createStorageSectionStyles } from "../styles";

type BatchDest = { kind: "move" | "copy"; itemIds: string[] };

type Props = {
  batchDestination: BatchDest;
  isBatchMoveDestinationInvalid: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function StorageBatchDestinationBanner({
  batchDestination,
  isBatchMoveDestinationInvalid,
  onCancel,
  onConfirm,
}: Props) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStorageSectionStyles(colors), [colors]);
  return (
    <RNView style={styles.batchDestinationBanner}>
      <ThemedText style={styles.batchDestinationText}>
        {batchDestination.kind === "move" ? "Переместить" : "Копировать"}{" "}
        {batchDestination.itemIds.length} эл. → откройте папку назначения (хлебные
        крошки), затем подтвердите.
      </ThemedText>
      {batchDestination.kind === "move" && isBatchMoveDestinationInvalid && (
        <ThemedText style={styles.batchDestinationWarning}>
          Сюда нельзя: текущая папка совпадает с перемещаемой или входит в
          выделение.
        </ThemedText>
      )}
      <RNView style={styles.batchDestinationActions}>
        <TouchableOpacity onPress={onCancel}>
          <ThemedText style={styles.batchDestinationCancel}>
            Отмена
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onConfirm}
          disabled={
            batchDestination.kind === "move" && isBatchMoveDestinationInvalid
          }
        >
          <ThemedText
            style={[
              styles.batchDestinationConfirm,
              batchDestination.kind === "move" &&
                isBatchMoveDestinationInvalid &&
                styles.batchDestinationConfirmDisabled,
            ]}
          >
            {batchDestination.kind === "move"
              ? "Переместить сюда"
              : "Копировать сюда"}
          </ThemedText>
        </TouchableOpacity>
      </RNView>
    </RNView>
  );
}

import { ThemedText } from "@/shared/core/ThemedText";
import React from "react";
import { TouchableOpacity, View as RNView } from "react-native";
import { storageSectionStyles } from "../styles";

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
  return (
    <RNView style={storageSectionStyles.batchDestinationBanner}>
      <ThemedText style={storageSectionStyles.batchDestinationText}>
        {batchDestination.kind === "move" ? "Переместить" : "Копировать"}{" "}
        {batchDestination.itemIds.length} эл. → откройте папку назначения (хлебные
        крошки), затем подтвердите.
      </ThemedText>
      {batchDestination.kind === "move" && isBatchMoveDestinationInvalid && (
        <ThemedText style={storageSectionStyles.batchDestinationWarning}>
          Сюда нельзя: текущая папка совпадает с перемещаемой или входит в
          выделение.
        </ThemedText>
      )}
      <RNView style={storageSectionStyles.batchDestinationActions}>
        <TouchableOpacity onPress={onCancel}>
          <ThemedText style={storageSectionStyles.batchDestinationCancel}>
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
              storageSectionStyles.batchDestinationConfirm,
              batchDestination.kind === "move" &&
                isBatchMoveDestinationInvalid &&
                storageSectionStyles.batchDestinationConfirmDisabled,
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

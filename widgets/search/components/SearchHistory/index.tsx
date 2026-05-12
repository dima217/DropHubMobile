import { useThemeColors } from "@/hooks/useThemeColors";
import { ThemedText } from "@/shared/core/ThemedText";
import { Feather } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { View as RNView, StyleSheet, TouchableOpacity } from "react-native";

interface SearchHistoryProps {
  history: string[];
  onSelectQuery: (query: string) => void;
}

export const SearchHistory: React.FC<SearchHistoryProps> = ({
  history,
  onSelectQuery,
}) => {
  const colors = useThemeColors();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        historyContainer: {},
        historyTitle: {
          fontSize: 14,
          color: colors.secondary,
          marginBottom: 8,
        },
        historyItem: {
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          paddingVertical: 8,
          paddingHorizontal: 12,
          backgroundColor: colors.cardBackground,
          borderRadius: 8,
          marginBottom: 4,
        },
        historyText: {
          fontSize: 14,
          color: colors.text,
        },
      }),
    [colors]
  );

  if (history.length === 0) return null;

  return (
    <RNView style={styles.historyContainer}>
      {history.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.historyItem}
          onPress={() => onSelectQuery(item)}
        >
          <Feather name="clock" size={16} color={colors.secondary} />
          <ThemedText style={styles.historyText}>{item}</ThemedText>
        </TouchableOpacity>
      ))}
    </RNView>
  );
};

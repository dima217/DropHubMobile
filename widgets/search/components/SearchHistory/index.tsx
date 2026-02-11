import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import React from "react";
import { StyleSheet, TouchableOpacity, View as RNView } from "react-native";
import { Feather } from "@expo/vector-icons";

interface SearchHistoryProps {
  history: string[];
  onSelectQuery: (query: string) => void;
}

export const SearchHistory: React.FC<SearchHistoryProps> = ({
  history,
  onSelectQuery,
}) => {
  if (history.length === 0) return null;

  return (
    <RNView style={styles.historyContainer}>
      <ThemedText style={styles.historyTitle}>История поиска:</ThemedText>
      {history.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.historyItem}
          onPress={() => onSelectQuery(item)}
        >
          <Feather name="clock" size={16} color={Colors.secondary} />
          <ThemedText style={styles.historyText}>{item}</ThemedText>
        </TouchableOpacity>
      ))}
    </RNView>
  );
};

const styles = StyleSheet.create({
  historyContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  historyTitle: {
    fontSize: 14,
    color: Colors.secondary,
    marginBottom: 8,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    marginBottom: 4,
  },
  historyText: {
    fontSize: 14,
    color: Colors.text,
  },
});


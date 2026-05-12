import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useThemeColors } from "@/hooks/useThemeColors";

import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

const SearchButton: React.FC = () => {
  const themeColors = useThemeColors();
  const styles = useThemedStyles((c) => ({

  button: {
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
  },

}));

  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => router.push("/(tabs)/search")}
      activeOpacity={0.7}
    >
      <Feather name="search" size={20} color={themeColors.primary} />
    </TouchableOpacity>
  );
};

export default SearchButton;

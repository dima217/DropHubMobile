import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useThemeColors } from "@/hooks/useThemeColors";

import Header from "@/shared/Header";
import View from "@/shared/View";
import { FavoritesSection } from "@/widgets/favorites/FavoritesSection";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

const FavoritesScreen = () => {
  const themeColors = useThemeColors();
  const styles = useThemedStyles((c) => ({

  tagButton: {
    padding: 4,
  },

}));

  return (
    <View>
      <Header title="Избранное" />
      <FavoritesSection
        renderHeaderActions={({ onOpenGlobalTags }) => (
          <TouchableOpacity
            onPress={() => onOpenGlobalTags()}
            style={styles.tagButton}
          >
            <Feather name="tag" size={20} color={themeColors.primary} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default FavoritesScreen;

import { Colors } from "@/constants/design-tokens";
import Header from "@/shared/Header";
import View from "@/shared/View";
import { FavoritesSection } from "@/widgets/favorites/FavoritesSection";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

const FavoritesScreen = () => {
  return (
    <View>
      <Header title="Избранное" />
      <FavoritesSection
        renderHeaderActions={({ onOpenGlobalTags }) => (
          <TouchableOpacity
            onPress={() => onOpenGlobalTags()}
            style={styles.tagButton}
          >
            <Feather name="tag" size={20} color={Colors.primary} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  tagButton: {
    padding: 4,
  },
});

export default FavoritesScreen;

import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useThemeColors } from "@/hooks/useThemeColors";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { MediaFile } from "../../hooks/useMediaPicker";

interface Props {
  media: MediaFile;
  onRemove: () => void;
}

const MediaPreview: React.FC<Props> = ({ media, onRemove }) => {
  const themeColors = useThemeColors();
  const styles = useThemedStyles((c) => ({

  wrapper: {
    width: "100%",
    height: "100%",
  },
  preview: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  removeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
  },

}));

  return (
    <View style={styles.wrapper}>
      <Image
        key={media.uri}
        source={{ uri: media.thumbnail || media.uri }}
        style={styles.preview}
      />

      <TouchableOpacity style={styles.removeBtn} onPress={onRemove}>
        <MaterialCommunityIcons
          name="close-circle"
          size={32}
          color={themeColors.primary}
        />
      </TouchableOpacity>
    </View>
  );
};

export default MediaPreview;

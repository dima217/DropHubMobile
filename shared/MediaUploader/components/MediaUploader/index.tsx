import { Colors } from "@/constants/design-tokens";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { useMediaPicker } from "../../hooks/useMediaPicker";

interface MediaUploaderProps {
  value?: string;
  type: "image" | "video";
  onChange?: (media: string | undefined) => void;
  defaultImage?: any;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({
  value,
  type,
  onChange,
  defaultImage,
}) => {
  const { pickMedia } = useMediaPicker();

  const handlePick = async () => {
    const picked = await pickMedia(type);
    if (onChange && picked) {
      onChange(picked.uri);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={value ? { uri: value } : defaultImage}
        style={styles.uploadArea}
      />

      <TouchableOpacity style={styles.addButton} onPress={handlePick}>
        <View style={styles.plusCircle}>
          <View style={styles.plusHorizontal} />
          <View style={styles.plusVertical} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default MediaUploader;

const CIRCLE_SIZE = 140;
const PLUS_SIZE = 36;

const styles = StyleSheet.create({
  container: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadArea: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 1,
    borderColor: Colors.primary,
    overflow: "hidden",
  },
  addButton: {
    position: "absolute",
    top: 10,
    right: 0,
  },
  plusCircle: {
    width: PLUS_SIZE,
    height: PLUS_SIZE,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: PLUS_SIZE / 2,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  plusHorizontal: {
    position: "absolute",
    width: 12,
    height: 2,
    backgroundColor: "#fff",
  },
  plusVertical: {
    position: "absolute",
    width: 2,
    height: 12,
    backgroundColor: "#fff",
  },
});

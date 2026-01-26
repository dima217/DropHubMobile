import { ThemedText } from "@/shared/core/ThemedText";
import MediaUploader from "@/shared/MediaUploader/components/MediaUploader";
import Circle from "@/shared/ui/Circle";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Dimensions, Image, StyleSheet, View } from "react-native";

const defaultIcons = [
  require("@/assets/icons/icon1.png"),
  require("@/assets/icons/icon2.png"),
  require("@/assets/icons/icon1.png"),
  require("@/assets/icons/icon1.png"),
  require("@/assets/icons/icon1.png"),
  require("@/assets/icons/icon1.png"),
];

const { width } = Dimensions.get("window");
const ICON_SIZE = 60;
const ICON_MARGIN = (width - ICON_SIZE * 3) / 6;

const AvatarScreen = () => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name="avatar"
      render={({ field: { value, onChange } }) => (
        <View style={styles.stepContainer}>
          <View style={styles.innerContainer}>
            <ThemedText type="megaTitle">Avatar</ThemedText>
          </View>

          <View style={styles.mediaContainer}>
            <MediaUploader value={value} onChange={onChange} type="image" />
          </View>

          <View style={styles.innerContainer}>
            <ThemedText type="medium">
              Choose an avatar or set your own
            </ThemedText>
          </View>

          <View style={styles.iconsGrid}>
            {defaultIcons.map((icon, index) => (
              <Circle
                key={`icon-${index}-${value === `icon-${index + 1}`}`}
                size={ICON_SIZE}
                style={[
                  { marginHorizontal: ICON_MARGIN, marginVertical: 10 },
                  value === `icon-${index + 1}` && styles.iconSelected,
                ]}
                onPress={() => onChange(`icon-${index + 1}`)}
              >
                <Image source={icon} style={styles.iconImage} />
              </Circle>
            ))}
          </View>
        </View>
      )}
    />
  );
};

export default AvatarScreen;

const styles = StyleSheet.create({
  innerContainer: {
    gap: 6,
    marginVertical: 20,
  },
  stepContainer: {
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  mediaContainer: {
    marginBottom: 30,
    alignItems: "center",
  },
  iconsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginHorizontal: -ICON_MARGIN,
  },
  iconSelected: {
    borderColor: "#007AFF",
    borderWidth: 2,
  },
  iconImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});

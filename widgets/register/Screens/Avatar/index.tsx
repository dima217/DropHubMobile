import { useGetDefaultsAvatarsQuery } from "@/api/avatarApi";
import { ThemedText } from "@/shared/core/ThemedText";
import MediaUploader from "@/shared/MediaUploader/components/MediaUploader";
import ActivityIndicator from "@/shared/ui/ActivityIndicator";
import Circle from "@/shared/ui/Circle";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Image, StyleSheet, View } from "react-native";
import { Grid } from "./ui/Grid";

/*const defaultIcons = [
  require("@/assets/icons/icon1.png"),
  require("@/assets/icons/icon2.png"),
  require("@/assets/icons/icon1.png"),
  require("@/assets/icons/icon1.png"),
  require("@/assets/icons/icon1.png"),
  require("@/assets/icons/icon1.png"),
];
*/
//const { width } = Dimensions.get("window");
//const ICON_SIZE = 60;
//const ICON_MARGIN = (width - ICON_SIZE * 3) / 6;

const AvatarScreen = () => {
  const { control } = useFormContext();

  const { data: avatars, isLoading, isError } = useGetDefaultsAvatarsQuery();

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
            <MediaUploader
              defaultImages={avatars}
              value={value}
              onChange={onChange}
              type="image"
            />
          </View>

          <View style={styles.innerContainer}>
            <ThemedText type="medium">
              Choose an avatar or set your own
            </ThemedText>
          </View>

          {isLoading && <ActivityIndicator />}

          {isError && (
            <ThemedText type="small">Failed to load avatars</ThemedText>
          )}

          {avatars && (
            <Grid columns={3} gap={18}>
              {avatars.map((uri, index) => {
                const avatarValue = `${index}`;
                const isSelected = value === avatarValue;

                return (
                  <Circle
                    fluid
                    key={`icon-${index}-${isSelected}`}
                    style={value === avatarValue && styles.iconSelected}
                    onPress={() => onChange(avatarValue)}
                  >
                    <Image source={{ uri }} style={styles.iconImage} />
                  </Circle>
                );
              })}
            </Grid>
          )}
        </View>
      )}
    />
  );
};

export default AvatarScreen;

const styles = StyleSheet.create({
  innerContainer: {
    gap: 6,
    marginBottom: 20,
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
    backgroundColor: "#FFFF",
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

import { useThemeColors } from "@/hooks/useThemeColors";
import { Avatar as RNAvatar } from "react-native-elements";
import React, { useMemo } from "react";
import { createAvatarStyles } from "./styles";

interface AvatarProps {
  size?: "small" | "medium" | "large" | number;
  uri?: string;
  title?: string;
  onPress?: () => void;
}

const Avatar = ({ size, uri, title, onPress }: AvatarProps) => {
  const colors = useThemeColors();
  const styles = useMemo(() => createAvatarStyles(colors), [colors]);

  if (uri) {
    return <RNAvatar rounded source={{ uri: uri }} size={size} onPress={onPress} />;
  }
  if (title) {
    return (
      <RNAvatar
        rounded
        title={title}
        size={size}
        overlayContainerStyle={styles.avatarBackground}
        titleStyle={styles.avatarText}
        onPress={onPress}
      />
    );
  }
};

export default Avatar;

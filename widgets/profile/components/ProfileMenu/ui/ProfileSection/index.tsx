import { useThemeColors } from "@/hooks/useThemeColors";
import { useThemedStyles } from "@/hooks/useThemedStyles";

import GradientView from "@/shared/Gradient";
import { ThemedText } from "@/shared/core/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { ReactNode } from "react";
import { TouchableOpacity, View } from "react-native";

interface ProfileSectionProps {
  icon: ReactNode;
  title: string;
  onPress: () => void;
  isNested: boolean;
  isLast: boolean;
}

const ProfileSection = ({
  icon,
  title,
  onPress,
  isNested,
  isLast,
}: ProfileSectionProps) => {
  const themeColors = useThemeColors();
  const styles = useThemedStyles((c) => ({
    container: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      height: 85,
      justifyContent: "space-between",
      alignItems: "center",
    },
    iconContainer: {
      width: 40,
      height: 40,
    },
    iconGradientContainer: {
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 20,
    },
    itemBorder: {
      borderBottomWidth: 1,
      borderColor: c.inactive,
    },
    content: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
  }));

  return (
    <TouchableOpacity
      style={[styles.container, !isLast ? styles.itemBorder : ""]}
      onPress={onPress}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <GradientView style={styles.iconGradientContainer}>
            {icon}
          </GradientView>
        </View>
        <ThemedText>{title}</ThemedText>
      </View>
      {isNested && (
        <Ionicons name="arrow-forward" size={24} color={themeColors.border} />
      )}
    </TouchableOpacity>
  );
};

export default ProfileSection;

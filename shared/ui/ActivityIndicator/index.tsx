import { ActivityIndicator as NativeActivityIndicator } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";

import type { ActivityIndicatorProps } from "react-native";


const ActivityIndicator = ({ ...rest }: ActivityIndicatorProps) => {
  const colors = useThemeColors();
  return (
    <NativeActivityIndicator size="large" color={colors.primary} {...rest} />
  );
};

export default ActivityIndicator;

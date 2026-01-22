import { ActivityIndicator as NativeActivityIndicator } from "react-native";

import type { ActivityIndicatorProps } from "react-native";

import { Colors } from "@/constants/design-tokens";

const ActivityIndicator = ({ ...rest }: ActivityIndicatorProps) => {
  return (
    <NativeActivityIndicator size="large" color={Colors.primary} {...rest} />
  );
};

export default ActivityIndicator;

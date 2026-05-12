import { useThemedStyles } from "@/hooks/useThemedStyles";

import React from "react";
import {
  View as RNView,
  StyleProp,
  StyleSheet,
  ViewProps,
  ViewStyle,
} from "react-native";

interface CustomViewProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

const View: React.FC<CustomViewProps> = ({ style, children, ...rest }) => {
  const styles = useThemedStyles((c) => ({

  container: {
    flex: 1,
    backgroundColor: c.background,
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },

}));

  return (
    <RNView style={[styles.container, style]} {...rest}>
      {children}
    </RNView>
  );
};

export default View;

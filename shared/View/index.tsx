import { Colors } from "@/constants/design-tokens";
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
  return (
    <RNView style={[styles.container, style]} {...rest}>
      {children}
    </RNView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingVertical: 50,
  },
});

export default View;

import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

interface GridProps {
  columns?: number;
  gap?: number;
  children: ReactNode;
}

export const Grid: React.FC<GridProps> = ({
  columns = 3,
  gap = 12,
  children,
}) => {
  const itemWidth = `${80 / columns}%` as const;

  return (
    <View style={styles.grid}>
      {React.Children.map(children, (child) => (
        <View
          style={[
            styles.item,
            {
              width: itemWidth,
              marginBottom: gap,
            },
          ]}
        >
          {child}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  item: {
    alignItems: "center",
  },
});

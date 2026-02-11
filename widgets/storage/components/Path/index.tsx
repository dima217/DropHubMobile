import { Colors } from "@/constants/design-tokens";
import React from "react";
import {
    View as RNView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
} from "react-native";

export interface BreadcrumbSegment {
  id: string | null;
  name: string;
}

interface StorageBreadcrumbsProps {
  path: BreadcrumbSegment[];
  onNavigate: (segmentId: string | null, index: number) => void;
}

export const StorageBreadcrumbs: React.FC<StorageBreadcrumbsProps> = ({
  path,
  onNavigate,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {path.map((segment, index) => {
        const isLast = index === path.length - 1;

        return (
          <RNView
            key={`${segment.id ?? "root"}_${index}`}
            style={styles.itemWrapper}
          >
            <TouchableOpacity
              disabled={isLast}
              onPress={() => onNavigate(segment.id, index)}
            >
              <Text
                style={[
                  styles.text,
                  isLast && styles.textActive,
                ]}
              >
                {segment.name}
              </Text>

              {isLast && <RNView style={styles.underline} />}
            </TouchableOpacity>

            {index < path.length - 1 && (
              <Text style={styles.separator}>/</Text>
            )}
          </RNView>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 8,
  },
  itemWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    color: Colors.text,
    fontSize: 14,
  },
  textActive: {
    color: Colors.primary,
    fontWeight: "600",
  },
  underline: {
    height: 2,
    backgroundColor: Colors.primary,
    marginTop: 2,
    borderRadius: 1,
  },
  separator: {
    color: Colors.secondary,
    marginHorizontal: 4,
  },
});

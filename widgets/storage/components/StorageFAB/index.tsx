import { Colors } from "@/constants/design-tokens";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View as RNView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface StorageFABProps {
  onCreateFolder: () => void;
  onUploadFiles: () => void;
  isCreatingFolder: boolean;
  isStorageReady: boolean;
}

export const StorageFAB: React.FC<StorageFABProps> = ({
  onCreateFolder,
  onUploadFiles,
  isCreatingFolder,
  isStorageReady,
}) => {
  const insets = useSafeAreaInsets();
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <RNView
      style={[
        styles.fabContainer,
        { bottom: insets.bottom + 24 },
      ]}
    >
      {isExpanded && (
        <>
          <TouchableOpacity
            style={styles.smallFab}
            onPress={onCreateFolder}
            disabled={isCreatingFolder}
          >
            <Feather name="folder-plus" size={20} color={Colors.brightText} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.smallFab}
            onPress={onUploadFiles}
            disabled={!isStorageReady}
          >
            <Feather name="upload" size={20} color={Colors.brightText} />
          </TouchableOpacity>
        </>
      )}
      <TouchableOpacity
        style={styles.mainFab}
        onPress={() => setIsExpanded((prev) => !prev)}
      >
        <Feather
          name={isExpanded ? "x" : "plus"}
          size={24}
          color={Colors.brightText}
        />
      </TouchableOpacity>
    </RNView>
  );
};

const styles = StyleSheet.create({
  fabContainer: {
    position: "absolute",
    right: 16,
    alignItems: "center",
    gap: 12,
  },
  mainFab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  smallFab: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.cardBackground,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
});


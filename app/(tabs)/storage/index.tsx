import { roomApi, useGetRoomDetailsQuery } from "@/api/roomApi";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useThemeColors } from "@/hooks/useThemeColors";

import Header from "@/shared/Header";
import SearchButton from "@/shared/SearchButton";
import View from "@/shared/View";
import { StorageSection } from "@/widgets/storage/components/StorageSection";
import { menuOptions } from "@/widgets/storage/components/StorageSection/data/defaultOptions";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  View as RNView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useDispatch } from "react-redux";

const StorageScreen = () => {
  const themeColors = useThemeColors();
  const styles = useThemedStyles((c) => ({

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: c.reject,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  breadcrumbContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 8,
  },
  breadcrumbItemWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  breadcrumbText: {
    color: c.text,
    fontSize: 14,
  },
  breadcrumbTextActive: {
    color: c.primary,
    fontWeight: "600",
  },
  breadcrumbUnderline: {
    height: 2,
    backgroundColor: c.primary,
    marginTop: 2,
    borderRadius: 1,
  },
  breadcrumbSeparator: {
    color: c.secondary,
    marginHorizontal: 4,
  },
  tagButton: {
    padding: 4,
  },

}));

  const router = useRouter();
  const dispatch = useDispatch();
  const { archiveRoomId } = useLocalSearchParams<{ archiveRoomId?: string }>();
  const { data: roomDetails } = useGetRoomDetailsQuery(archiveRoomId!, {
    skip: !archiveRoomId,
  });

  const archiveFileIds = useMemo(
    () => roomDetails?.files?.map((f) => f._id) ?? [],
    [roomDetails?.files]
  );

  const archiveMode = useMemo(() => {
    if (!archiveRoomId) return undefined;
    return {
      roomId: archiveRoomId,
      fileIds: archiveFileIds,
      onCancel: () => router.replace("/(tabs)/storage"),
      onComplete: () => {
        dispatch(roomApi.util.invalidateTags(["Room"]));
        // Clear archive params to prevent sticky bottom archive bar.
        router.replace("/(tabs)/storage");
      },
    };
  }, [archiveRoomId, archiveFileIds, router, dispatch]);

  return (
    <View>
      <Header
        title="Storage"
        rightAction={
          <RNView style={{ flexDirection: "row", gap: 8 }}>
            <SearchButton />
          </RNView>
        }
      />

      <StorageSection
        options={{
          showBreadcrumbs: true,
          showPreviewToggle: true,
          showFAB: !archiveMode,
          showGlobalTagsButton: true,
          consumePendingMoveOnTabFocus: true,
        }}
        menuOptions={menuOptions}
        renderHeaderActions={({ onOpenGlobalTags }) => (
          <RNView style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity
              onPress={() => onOpenGlobalTags()}
              style={styles.tagButton}
            >
              <Feather name="tag" size={20} color={themeColors.primary} />
            </TouchableOpacity>
          </RNView>
        )}
        archiveMode={archiveMode}
      />
    </View>
  );
};

export default StorageScreen;

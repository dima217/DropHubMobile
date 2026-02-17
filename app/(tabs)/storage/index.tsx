import { roomApi, useGetRoomDetailsQuery } from "@/api/roomApi";
import { Colors } from "@/constants/design-tokens";
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
        router.back();
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
        }}
        menuOptions={menuOptions}
        renderHeaderActions={({ onOpenGlobalTags }) => (
          <RNView style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity
              onPress={() => onOpenGlobalTags()}
              style={styles.tagButton}
            >
              <Feather name="tag" size={20} color={Colors.primary} />
            </TouchableOpacity>
          </RNView>
        )}
        archiveMode={archiveMode}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: Colors.reject,
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
    color: Colors.text,
    fontSize: 14,
  },
  breadcrumbTextActive: {
    color: Colors.primary,
    fontWeight: "600",
  },
  breadcrumbUnderline: {
    height: 2,
    backgroundColor: Colors.primary,
    marginTop: 2,
    borderRadius: 1,
  },
  breadcrumbSeparator: {
    color: Colors.secondary,
    marginHorizontal: 4,
  },
  tagButton: {
    padding: 4,
  },
});

export default StorageScreen;

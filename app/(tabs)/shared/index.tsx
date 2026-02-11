import { useGetSharedResourcesQuery } from "@/api/sharedApi";
import { FileItem, FileUploadStatus } from "@/api/types/file";
import { StorageItem } from "@/api/types/storage";
import { Colors } from "@/constants/design-tokens";
import Header from "@/shared/Header";
import SearchButton from "@/shared/SearchButton";
import View from "@/shared/View";
import { ThemedText } from "@/shared/core/ThemedText";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  View as RNView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const mapStorageItemToFile = (item: StorageItem): FileItem => {
  const meta = item.fileMeta;
  return {
    _id: meta?._id || item.id,
    originalName: meta?.originalName || item.name,
    storedName: meta?.storedName || item.name,
    size: meta?.size || 0,
    mimeType: meta?.mimeType || "application/octet-stream",
    uploadTime: meta?.uploadTime || new Date().toISOString(),
    downloadCount: meta?.downloadCount || 0,
    key: "",
    uploadedParts: 0,
    expiresAt: null,
    creatorId: meta?.creatorId || Number(item.creatorId) || 0,
    uploadSession: { status: FileUploadStatus.COMPLETE },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    __v: 0,
  };
};

const SharedScreen = () => {
  const router = useRouter();
  const { data: sharedResources, isLoading } = useGetSharedResourcesQuery();

  const handleItemPress = (resourceId: string) => {
    router.push(`/(tabs)/shared/${resourceId}`);
  };

  return (
    <View>
      <Header title="Shared" rightAction={<SearchButton />} />

      {isLoading ? (
        <RNView style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </RNView>
      ) : (
        <FlatList
          data={sharedResources || []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.itemCard}
              onPress={() => handleItemPress(item.id)}
            >
              <ThemedText style={styles.itemTitle}>
                {item.isDirectory ? "Папка" : "Файл"}
              </ThemedText>
              <ThemedText style={styles.itemSubtitle}>
                ID: {item.id}
              </ThemedText>
              <ThemedText style={styles.itemRole}>
                Роль: {item.userRole}
              </ThemedText>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <RNView style={styles.emptyContainer}>
              <ThemedText style={styles.emptyText}>
                Нет общих ресурсов
              </ThemedText>
            </RNView>
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  listContent: {
    paddingVertical: 12,
  },
  itemCard: {
    backgroundColor: Colors.cardBackground,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    marginHorizontal: 16,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.brightText,
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 12,
    color: Colors.secondary,
    marginBottom: 4,
  },
  itemRole: {
    fontSize: 14,
    color: Colors.primary,
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    color: Colors.secondary,
    fontSize: 14,
  },
});

export default SharedScreen;


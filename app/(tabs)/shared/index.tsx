import { useLazyDownloadSharedFileQuery } from "@/api/fileApi";
import { useGetSharedResourcesQuery } from "@/api/sharedApi";
import { Colors } from "@/constants/design-tokens";
import { createUploader, UploadProvider } from "@/services/upload/UploaderFactory";
import Header from "@/shared/Header";
import SearchButton from "@/shared/SearchButton";
import View from "@/shared/View";
import { ThemedText } from "@/shared/core/ThemedText";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  View as RNView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const SharedScreen = () => {
  const router = useRouter();
  const { data: sharedResources, isLoading } = useGetSharedResourcesQuery();
  const [downloadSharedFile] = useLazyDownloadSharedFileQuery();

  const handleItemPress = async (item: {
    id: string;
    storageId: string;
    isDirectory: boolean;
    fileId: string | null;
  }) => {
    if (item.isDirectory) {
      router.push(`/(tabs)/shared/${item.id}?storageId=${item.storageId}`);
      return;
    }

    if (!item.fileId) {
      Alert.alert("Ошибка", "У файла нет fileId");
      return;
    }

    try {
      const response = await downloadSharedFile({
        resourceId: item.id,
        fileIds: [item.fileId],
      }).unwrap();
      const uploader = createUploader(UploadProvider.MINIO);
      for (const { url } of response) {
        await uploader.download(url);
      }
      Alert.alert("Успешно", "Файл загружен");
    } catch (e) {
      console.log("Shared download failed", e);
      Alert.alert("Ошибка", "Не удалось скачать файл");
    }
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
              onPress={() =>
                handleItemPress({
                  id: item.id,
                  storageId: item.storageId,
                  isDirectory: item.isDirectory,
                  fileId: item.fileId,
                })
              }
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


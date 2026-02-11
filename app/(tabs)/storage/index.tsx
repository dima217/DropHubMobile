import { useGetFavoritesQuery } from "@/api/favorites";
import {
  useCreateStorageFolderMutation,
  useGetStorageInfoQuery,
  useGetStorageStructureQuery,
  useRemoveStorageTagsMutation,
} from "@/api/storageApi";
import { ResourceType } from "@/api/types/shared";
import { StorageItem } from "@/api/types/storage";
import { Colors } from "@/constants/design-tokens";
import Header from "@/shared/Header";
import GrantAccessModal from "@/shared/Modals/StorageModals/GrantAccessModal";
import ItemInfoModal from "@/shared/Modals/StorageModals/ItemInfoModal";
import MoveItemModal from "@/shared/Modals/StorageModals/MoveItemModal";
import PermissionsModal from "@/shared/Modals/StorageModals/PermissionsModal";
import RenameItemModal from "@/shared/Modals/StorageModals/RenameItemModal";
import TagsModal from "@/shared/Modals/StorageModals/TagsModal";
import UploadPreviewModal from "@/shared/Modals/UploadPreviewModal";
import SearchButton from "@/shared/SearchButton";
import View from "@/shared/View";
import PreviewToggleSwitch from "@/shared/ui/PreviewToggleSwitch";
import { StorageFAB } from "@/widgets/storage/components/StorageFAB";
import { StorageItemList } from "@/widgets/storage/components/StorageItemList";
import { useStorageActions } from "@/widgets/storage/hooks/useStorageActions";
import { useStorageFileUpload } from "@/widgets/storage/hooks/useStorageFileUpload";
import { useStoragePreviewUrls } from "@/widgets/storage/hooks/useStoragePreviewUrls";
import { useStorageScreenHandlers } from "@/widgets/storage/hooks/useStorageScreenHandlers";
import { useSelectedItemState } from "@/widgets/storage/hooks/useTagsState";
import { Feather } from "@expo/vector-icons";
import { skipToken } from "@reduxjs/toolkit/query";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  View as RNView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

const StorageScreen = () => {
  const { targetParentId } = useLocalSearchParams<{ targetParentId?: string }>();
  const [currentParentId, setCurrentParentId] = useState<string | null>(null);
  const [previewEnabled, setPreviewEnabled] = useState(false);
  const [path, setPath] = useState<{ id: string | null; name: string }[]>([
    { id: null, name: "Root" },
  ]);
  const hasNavigatedRef = useRef(false);

  // Modal states
  const [tagsModalVisible, setTagsModalVisible] = useState(false);
  const [globalTagsModalVisible, setGlobalTagsModalVisible] = useState(false);
  const [grantAccessModalVisible, setGrantAccessModalVisible] = useState(false);
  const [permissionsModalVisible, setPermissionsModalVisible] = useState(false);
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [moveModalVisible, setMoveModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StorageItem | null>(null);

  const {
    data: storageInfo,
    isLoading: isStorageInfoLoading,
    isError: isStorageInfoError,
  } = useGetStorageInfoQuery();

  const storageId = storageInfo?.id || "";

  
useEffect(() => {
  console.log("STORAGE INFO ID CHANGED:", storageInfo?.id);
  console.log("STORAGE INFO CHANGED:", storageInfo);

}, [storageInfo]);

  const {
    data: structure,
    isLoading: isStructureLoading,
    refetch: refetchStructure,
    isError: isStructureError,
  } = useGetStorageStructureQuery(storageId ? { storageId, parentId: currentParentId ?? undefined } : skipToken);

  // Handle navigation from favorites
  useEffect(() => {
    if (targetParentId && structure && !hasNavigatedRef.current) {
      hasNavigatedRef.current = true;
      const targetId = targetParentId === "" ? null : targetParentId;

      // Build path from root to target folder
      const buildPath = (folderId: string | null): { id: string | null; name: string }[] => {
        const segments: { id: string | null; name: string }[] = [{ id: null, name: "Root" }];
        if (!folderId) return segments;
        const chain: StorageItem[] = [];
        let currentId: string | null = folderId;
        while (currentId) {
          const item = structure.find((s) => s.id === currentId);
          if (!item) break;
          chain.unshift(item);
          currentId = item.parentId;
        }
        for (const item of chain) {
          segments.push({ id: item.id, name: item.name });
        }
        return segments;
      };

      const newPath = buildPath(targetId);
      setCurrentParentId(targetId);
      setPath(newPath);
    }
  }, [targetParentId, structure]);

  const { data: favorites } = useGetFavoritesQuery(undefined, {
    skip: !storageId,
  });

  const favoriteItemIds = useMemo(() => {
    if (!favorites?.items) return new Set<string>();
    return new Set(
      favorites.items
        .filter((fav) => fav.resourceType === ResourceType.STORAGE)
        .map((fav) => fav.id)
    );
  }, [favorites]);

  const [createFolder, { isLoading: isCreatingFolder }] =
    useCreateStorageFolderMutation();
  const [removeStorageTags] = useRemoveStorageTagsMutation();

  const {
    uploadingFiles,
    isUploadPreviewModalVisible,
    pickFiles,
    uploadFiles,
    clearUploads,
  } = useStorageFileUpload(storageId, currentParentId || undefined, undefined);

  const actions = useStorageActions({
    storageId,
    currentParentId,
    refetchStructure,
    setSelectedItem,
    setTagsModalVisible,
    setGrantAccessModalVisible,
    setPermissionsModalVisible,
    setRenameModalVisible,
    setInfoModalVisible,
    setMoveModalVisible,
  });

  // currentParent can be derived from path if needed in the future

  const itemsInCurrentFolder: StorageItem[] = useMemo(() => {
    console.log("structure", structure);
    if (!structure) return [];
    return structure
      .filter((item) => item.parentId === currentParentId && !item.deletedAt)
      .sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
      });
  }, [structure, currentParentId]);

  const previewUrls = useStoragePreviewUrls(
    storageId,
    itemsInCurrentFolder,
    previewEnabled
  );

  const { globalTags, itemTags, selectedItemState, removeGlobalTag, addItemTag, removeItemTag } = useSelectedItemState({
    storageTags: storageInfo?.tags || [],
    selectedItemFromProps: selectedItem,
  });

  const {
    handleCreateFolder,
    handleRemoveGlobalTag,
    handleConfirmRename,
    handleConfirmMove,
    handleAddItemTag,
    handleRemoveItemTag,
    handleGrantAccess,
  } = useStorageScreenHandlers({
    storageId,
    currentParentId,
    createFolder: (args: any) => createFolder(args).unwrap(),
    removeStorageTags: (args: any) => removeStorageTags(args).unwrap(),
    refetchStructure,
    selectedItem: selectedItemState,
    actions,
  });

  const isLoading =
    isStorageInfoLoading || (storageId && isStructureLoading) || false;

  if (isStorageInfoError || isStructureError) {
    return (
      <View>
        <Header title="Storage" />
        <RNView style={styles.center}>
          <Text style={styles.errorText}>
            Не удалось загрузить хранилище. Попробуйте позже.
          </Text>
        </RNView>
      </View>
    );
  }

  return (
    <View>
      <Header
        title="Storage"
        rightAction={
          <RNView style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity
              onPress={() => setGlobalTagsModalVisible(true)}
              style={styles.tagButton}
            >
              <Feather name="tag" size={20} color={Colors.primary} />
            </TouchableOpacity>
            <SearchButton />
          </RNView>
        }
      />

      {isLoading && (
        <RNView style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </RNView>
      )}

      {!isLoading && (
        <>
          <RNView style={styles.headerRow}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.breadcrumbContainer}
            >
              {path.map((segment, index) => {
                const isLast = index === path.length - 1;
                return (
                  <RNView
                    key={`${segment.id ?? "root"}_${index}`}
                    style={styles.breadcrumbItemWrapper}
                  >
                    <TouchableOpacity
                      disabled={isLast}
                      onPress={() => {
                        setCurrentParentId(segment.id);
                        setPath((prev) => prev.slice(0, index + 1));
                      }}
                    >
                      <Text
                        style={[
                          styles.breadcrumbText,
                          isLast && styles.breadcrumbTextActive,
                        ]}
                      >
                        {segment.name}
                      </Text>
                      {isLast && <RNView style={styles.breadcrumbUnderline} />}
                    </TouchableOpacity>
                    {index < path.length - 1 && (
                      <Text style={styles.breadcrumbSeparator}>/</Text>
                    )}
                  </RNView>
                );
              })}
            </ScrollView>
            <PreviewToggleSwitch
              isEnabled={previewEnabled}
              onToggle={setPreviewEnabled}
            />
          </RNView>

          <StorageItemList
            items={itemsInCurrentFolder}
            previewEnabled={previewEnabled}
            favoriteItemIds={favoriteItemIds}
            previewUrls={previewUrls}
            onFolderPress={(folder) => {
              setCurrentParentId(folder.id);
              setPath((prev) => [...prev, { id: folder.id, name: folder.name }]);
            }}
            onDownload={actions.handleDownloadFile}
            onRename={actions.handleRename}
            onCopy={actions.handleCopy}
            onMove={actions.handleMove}
            onAddToFavorites={actions.handleAddToFavorites}
            onRemoveFromFavorites={actions.handleRemoveFromFavorites}
            onAddTag={actions.handleAddTag}
            onShare={actions.handleShare}
            onViewPermissions={actions.handleViewPermissions}
            onInfo={actions.handleInfo}
            onDelete={actions.handleMoveToTrash}
          />
        </>
      )}

      <StorageFAB
        onCreateFolder={handleCreateFolder}
        onUploadFiles={pickFiles}
        isCreatingFolder={isCreatingFolder}
        isStorageReady={!!storageId}
      />

      <UploadPreviewModal
        visible={isUploadPreviewModalVisible}
        files={uploadingFiles}
        onClose={clearUploads}
        onUpload={async (files) => {
          await uploadFiles(files);
          refetchStructure();
        }}
      />

      <TagsModal
        visible={tagsModalVisible}
        tags={itemTags}
        onClose={() => {
          setTagsModalVisible(false);
          setSelectedItem(null);
        }}
        onAddTag={(tag) => {
          addItemTag(tag);
          handleAddItemTag(tag);           
        }}
        onRemoveTag={(tag) => {
          removeItemTag(tag);
          handleRemoveItemTag(tag);
        }}
        title="Теги элемента"
        canAdd={true}
        allStorageTags={storageInfo?.tags || []}
      />

      <TagsModal
        visible={globalTagsModalVisible}
        tags={globalTags}
        onClose={() => setGlobalTagsModalVisible(false)}
        onRemoveTag={(tag) => {
          removeGlobalTag(tag);
          handleRemoveGlobalTag(tag);
        }}
        title="Теги хранилища"
        canAdd={false}
      />

      <GrantAccessModal
        visible={grantAccessModalVisible}
        onClose={() => {
          setGrantAccessModalVisible(false);
          setSelectedItem(null);
        }}
        onSelectFriend={handleGrantAccess}
      />

      <PermissionsModal
        visible={permissionsModalVisible}
        itemId={selectedItem?.id || ""}
        storageId={storageId}
        onClose={() => {
          setPermissionsModalVisible(false);
          setSelectedItem(null);
        }}
      />

      <RenameItemModal
        visible={renameModalVisible}
        currentName={selectedItem?.name || ""}
        onClose={() => {
          setRenameModalVisible(false);
          setSelectedItem(null);
        }}
        onConfirm={handleConfirmRename}
      />

      <ItemInfoModal
        visible={infoModalVisible}
        item={selectedItem}
        onClose={() => {
          setInfoModalVisible(false);
          setSelectedItem(null);
        }}
      />

      <MoveItemModal
        visible={moveModalVisible}
        itemId={selectedItem?.id || ""}
        storageId={storageId}
        currentParentId={currentParentId}
        onClose={() => {
          setMoveModalVisible(false);
          setSelectedItem(null);
        }}
        onConfirm={handleConfirmMove}
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

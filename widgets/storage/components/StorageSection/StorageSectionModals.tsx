import { StorageItem } from "@/api/types/storage";
import { ArchiveRoomBar } from "@/shared/Modals/RoomModals/ArchiveRoomBar";
import CreateFolderModal from "@/shared/Modals/StorageModals/CreateFolderModal";
import GrantAccessModal from "@/shared/Modals/StorageModals/GrantAccessModal";
import ItemInfoModal from "@/shared/Modals/StorageModals/ItemInfoModal";
import MoveItemModal from "@/shared/Modals/StorageModals/MoveItemModal";
import PermissionsModal from "@/shared/Modals/StorageModals/PermissionsModal";
import RenameItemModal from "@/shared/Modals/StorageModals/RenameItemModal";
import TagsModal from "@/shared/Modals/StorageModals/TagsModal";
import UploadPreviewModal from "@/shared/Modals/UploadPreviewModal";
import type { PendingUploadFile } from "@/shared/types/pendingUpload";
import React from "react";
import { UploadingFile } from "../../hooks/useStorageFileUpload";

export interface StorageSectionModalsState {
  tagsModalVisible: boolean;
  globalTagsModalVisible: boolean;
  grantAccessModalVisible: boolean;
  permissionsModalVisible: boolean;
  renameModalVisible: boolean;
  infoModalVisible: boolean;
  createFolderModalVisible: boolean;
  moveModalVisible: boolean;
  uploadPreviewModalVisible: boolean;
  selectedItem: StorageItem | null;
  archiveRoomModalVisible: boolean;
}

export interface StorageSectionModalsProps {
  state: StorageSectionModalsState;
  setSelectedItem: (item: StorageItem | null) => void;
  setters: {
    setTagsModalVisible: (v: boolean) => void;
    setGlobalTagsModalVisible: (v: boolean) => void;
    setGrantAccessModalVisible: (v: boolean) => void;
    setPermissionsModalVisible: (v: boolean) => void;
    setRenameModalVisible: (v: boolean) => void;
    setInfoModalVisible: (v: boolean) => void;
    setCreateFolderModalVisible: (v: boolean) => void;
    setMoveModalVisible: (v: boolean) => void;
    setArchiveRoomModalVisible: (v: boolean) => void;
  };
  storageId: string;
  currentParentId: string | null;
  storageTags: string[];
  itemTags: string[];
  globalTags: string[];
  handlers: {
    handleCreateFolder: (name: string) => void;
    handleConfirmRename: (newName: string) => void;
    handleConfirmMove: (newParentId: string | null) => void;
    handleAddItemTag: (tag: string) => void;
    handleRemoveItemTag: (tag: string) => void;
    handleRemoveGlobalTag: (tag: string) => void;
    handleGrantAccess: (friendId: number) => void;
    handleConfirmArchiveRoom: () => void;
  };
  /** When set (e.g. redirect from room with archiveRoomId), show archive bar and use this onCancel */
  archiveMode?: { onCancel: () => void };
  /** Description for archive bar when in archiveMode (e.g. "Выберите папку...") */
  archiveModeDescription?: string;
  isArchivingRoom?: boolean;
  upload: {
    uploadingFiles: UploadingFile[];
    isUploadPreviewModalVisible: boolean;
    clearUploads: () => void;
    uploadFiles: (files: PendingUploadFile[]) => Promise<boolean>;
    refetchStructure: () => void;
    quota?: { usedBytes: number; maxBytes: number } | null;
  };
}

export const StorageSectionModals: React.FC<StorageSectionModalsProps> = ({
  state,
  setSelectedItem,
  setters,
  storageId,
  currentParentId,
  storageTags,
  itemTags,
  globalTags,
  handlers,
  archiveMode,
  archiveModeDescription,
  isArchivingRoom = false,
  upload,
}) => {
  const {
    tagsModalVisible,
    globalTagsModalVisible,
    grantAccessModalVisible,
    permissionsModalVisible,
    renameModalVisible,
    infoModalVisible,
    createFolderModalVisible,
    moveModalVisible,
    uploadPreviewModalVisible,
    selectedItem,
    archiveRoomModalVisible,
  } = state;

  return (
    <>
      <TagsModal
        visible={tagsModalVisible}
        tags={itemTags}
        onClose={() => {
          setters.setTagsModalVisible(false);
          setSelectedItem(null);
        }}
        onAddTag={handlers.handleAddItemTag}
        onRemoveTag={handlers.handleRemoveItemTag}
        title="Теги элемента"
        canAdd={true}
        allStorageTags={storageTags}
      />

      <TagsModal
        visible={globalTagsModalVisible}
        tags={globalTags}
        onClose={() => setters.setGlobalTagsModalVisible(false)}
        onRemoveTag={handlers.handleRemoveGlobalTag}
        title="Теги хранилища"
        canAdd={false}
      />

      <GrantAccessModal
        visible={grantAccessModalVisible}
        onClose={() => {
          setters.setGrantAccessModalVisible(false);
          setSelectedItem(null);
        }}
        onSelectFriend={handlers.handleGrantAccess}
      />

      <CreateFolderModal
        visible={createFolderModalVisible}
        onClose={() => {
          setters.setCreateFolderModalVisible(false);
          setSelectedItem(null);
        }}
        onConfirm={handlers.handleCreateFolder}
      />

      <PermissionsModal
        visible={permissionsModalVisible}
        itemId={selectedItem?.id || ""}
        storageId={storageId}
        onClose={() => {
          setters.setPermissionsModalVisible(false);
          setSelectedItem(null);
        }}
      />

      <RenameItemModal
        visible={renameModalVisible}
        currentName={selectedItem?.name || ""}
        onClose={() => {
          setters.setRenameModalVisible(false);
          setSelectedItem(null);
        }}
        onConfirm={handlers.handleConfirmRename}
      />

      <ItemInfoModal
        visible={infoModalVisible}
        item={selectedItem}
        onClose={() => {
          setters.setInfoModalVisible(false);
          setSelectedItem(null);
        }}
      />

      <MoveItemModal
        visible={moveModalVisible}
        currentParentId={currentParentId}
        onClose={() => {
          setters.setMoveModalVisible(false);
          setSelectedItem(null);
        }}
        onConfirm={handlers.handleConfirmMove}
      />

      <UploadPreviewModal
        visible={uploadPreviewModalVisible}
        files={upload.uploadingFiles}
        onClose={upload.clearUploads}
        quota={upload.quota}
        onUpload={async (files) => {
          const ok = await upload.uploadFiles(files);
          if (ok) upload.refetchStructure();
          return ok;
        }}
      />

      <ArchiveRoomBar
        visible={archiveRoomModalVisible || !!archiveMode}
        description={archiveMode ? archiveModeDescription : undefined}
        onClose={
          archiveMode
            ? archiveMode.onCancel
            : () => {
                setters.setArchiveRoomModalVisible(false);
                setSelectedItem(null);
              }
        }
        onConfirm={() => {
          handlers.handleConfirmArchiveRoom();
          setters.setArchiveRoomModalVisible(false);
          setSelectedItem(null);
        }}
        isLoading={isArchivingRoom}
      />
    </>
  );
};

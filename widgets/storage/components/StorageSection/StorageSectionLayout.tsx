import { Colors } from "@/constants/design-tokens";
import ConversionPickerModal from "@/shared/Modals/ConversionPickerModal";
import MultiSelectBar from "@/shared/ui/MultiSelectBar";
import PreviewToggleSwitch from "@/shared/ui/PreviewToggleSwitch";
import React from "react";
import {
  ActivityIndicator,
  View as RNView,
  View,
} from "react-native";
import { StorageBreadcrumbs } from "../Path";
import { StorageFAB } from "../StorageFAB";
import { StorageItemList } from "../StorageItemList";
import { StorageQuotaBar } from "../StorageQuotaBar";
import { StorageSectionModals } from "./StorageSectionModals";
import { StorageBatchDestinationBanner } from "./components/StorageBatchDestinationBanner";
import { StorageBatchTagsModal } from "./components/StorageBatchTagsModal";
import type { StorageSectionViewModel } from "./hooks/useStorageSectionController";
import { storageSectionStyles as styles } from "./styles";

type Props = { vm: StorageSectionViewModel };

export function StorageSectionLayout({ vm }: Props) {
  const {
    options,
    isLoading,
    isMultiSelectMode,
    isDestinationPick,
    batchDestination,
    selectedIds,
    multiSelectMenuItems,
    resetMultiSelect,
    confirmBatchDestination,
    isBatchMoveDestinationInvalid,
    previewEnabled,
    setPreviewEnabled,
    path,
    externalData,
    handleNavigateWithBatchGuard,
    renderHeaderActions,
    setGlobalTagsModalVisible,
    sharedContext,
    storageInfo,
    itemsInCurrentFolder,
    favoriteItemIds,
    previewUrls,
    disabledFolderIds,
    handleFolderPressWithBatchGuard,
    getMenuItems,
    showAuthorship,
    getItemAuthor,
    multiSelectEnabled,
    toggleSelection,
    setCreateFolderModalVisible,
    pickFiles,
    isCreatingFolder,
    storageId,
    convertItem,
    storageConversionOptions,
    convertSubmitting,
    setConvertItem,
    handleStorageConvertSelect,
    modalsState,
    setSelectedItem,
    modalsSetters,
    navigationParentId,
    storageTags,
    itemTags,
    globalTags,
    handleCreateFolder,
    handleConfirmRename,
    handleConfirmMove,
    handleAddItemTag,
    handleRemoveItemTag,
    handleRemoveGlobalTag,
    handleGrantAccess,
    handleConfirmArchiveRoom,
    archiveMode,
    isArchivingRoom,
    moveIntoSelfBlocked,
    uploadingFiles,
    isUploadPreviewModalVisible,
    clearUploads,
    uploadFiles,
    currentFolderFileNames,
    refetchStructure,
    batchTagsModalVisible,
    batchTagsInput,
    setBatchTagsModalVisible,
    setBatchTagsInput,
    handleBatchTagsSubmit,
  } = vm;

  return (
    <View style={styles.container}>
      {isLoading && (
        <RNView style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </RNView>
      )}

      {!isLoading && (
        <>
          {isMultiSelectMode && (
            <MultiSelectBar
              selectedCount={selectedIds.size}
              menuItems={multiSelectMenuItems}
            />
          )}

          {isDestinationPick && batchDestination && (
            <StorageBatchDestinationBanner
              batchDestination={batchDestination}
              isBatchMoveDestinationInvalid={isBatchMoveDestinationInvalid}
              onCancel={resetMultiSelect}
              onConfirm={confirmBatchDestination}
            />
          )}

          <View style={styles.headerRow}>
            {options.showBreadcrumbs && (
              <StorageBreadcrumbs
                path={externalData?.path ?? path}
                onNavigate={handleNavigateWithBatchGuard}
              />
            )}
            {options.showPreviewToggle && (
              <PreviewToggleSwitch
                isEnabled={previewEnabled}
                onToggle={setPreviewEnabled}
              />
            )}
            {options.showGlobalTagsButton && renderHeaderActions?.({
              onOpenGlobalTags: () => setGlobalTagsModalVisible(true),
            })}
          </View>

          {(sharedContext?.quota && sharedContext.quota.maxBytes > 0) ||
          (!sharedContext && storageInfo && storageInfo.maxBytes > 0) ? (
            <StorageQuotaBar
              usedBytes={
                sharedContext?.quota
                  ? sharedContext.quota.usedBytes
                  : storageInfo?.usedBytes ?? 0
              }
              maxBytes={
                sharedContext?.quota
                  ? sharedContext.quota.maxBytes
                  : storageInfo?.maxBytes ?? 0
              }
            />
          ) : null}

          <StorageItemList
            items={itemsInCurrentFolder}
            previewEnabled={previewEnabled}
            favoriteItemIds={favoriteItemIds}
            previewUrls={previewUrls}
            disabledFolderIds={disabledFolderIds}
            onFolderPress={handleFolderPressWithBatchGuard}
            getMenuItems={getMenuItems}
            showAuthorship={showAuthorship}
            getItemAuthor={getItemAuthor}
            multiSelect={
              multiSelectEnabled && !batchDestination
                ? {
                    active: selectedIds.size > 0,
                    selectedIds,
                    onToggle: toggleSelection,
                  }
                : undefined
            }
            suppressMenus={isDestinationPick}
          />
        </>
      )}

      {((!sharedContext && options.showFAB) ||
        (!!sharedContext && sharedContext.fabVisible)) &&
        !isMultiSelectMode &&
        !isDestinationPick && (
        <StorageFAB
          onCreateFolder={() => setCreateFolderModalVisible(true)}
          onUploadFiles={pickFiles}
          isCreatingFolder={isCreatingFolder}
          isStorageReady={!!storageId}
        />
      )}

      <ConversionPickerModal
        visible={convertItem !== null}
        fileName={convertItem?.name ?? ""}
        options={storageConversionOptions}
        isSubmitting={convertSubmitting}
        onClose={() => !convertSubmitting && setConvertItem(null)}
        onSelect={handleStorageConvertSelect}
      />

      <StorageSectionModals
        state={modalsState}
        setSelectedItem={setSelectedItem}
        setters={modalsSetters}
        storageId={storageId}
        currentParentId={navigationParentId}
        storageTags={storageTags}
        itemTags={itemTags}
        globalTags={globalTags}
        handlers={{
          handleCreateFolder,
          handleConfirmRename,
          handleConfirmMove,
          handleAddItemTag,
          handleRemoveItemTag,
          handleRemoveGlobalTag,
          handleGrantAccess,
          handleConfirmArchiveRoom,
          onPermissionsChanged: refetchStructure,
        }}
        archiveMode={archiveMode ? { onCancel: archiveMode.onCancel } : undefined}
        archiveModeDescription={
          archiveMode
            ? "Выберите папку в хранилище, затем нажмите «Архивировать»."
            : undefined
        }
        isArchivingRoom={isArchivingRoom}
        moveIntoSelfBlocked={moveIntoSelfBlocked}
        upload={{
          uploadingFiles,
          isUploadPreviewModalVisible,
          clearUploads,
          uploadFiles,
          existingNames: currentFolderFileNames,
          refetchStructure,
          quota:
            sharedContext?.quota && sharedContext.quota.maxBytes > 0
              ? {
                  usedBytes: sharedContext.quota.usedBytes,
                  maxBytes: sharedContext.quota.maxBytes,
                }
              : !sharedContext && storageInfo && storageInfo.maxBytes > 0
                ? {
                    usedBytes: storageInfo.usedBytes ?? 0,
                    maxBytes: storageInfo.maxBytes,
                  }
                : null,
        }}
      />

      <StorageBatchTagsModal
        visible={batchTagsModalVisible}
        selectedCount={selectedIds.size}
        batchTagsInput={batchTagsInput}
        onChangeBatchTagsInput={setBatchTagsInput}
        onClose={() => {
          setBatchTagsModalVisible(false);
          setBatchTagsInput("");
        }}
        onSubmit={handleBatchTagsSubmit}
      />
    </View>
  );
}

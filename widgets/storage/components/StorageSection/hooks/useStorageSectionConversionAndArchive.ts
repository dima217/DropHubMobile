import { useConvertStorageFileMutation, useCreateStorageFolderMutation } from "@/api";
import { useArchiveRoomToStorageMutation } from "@/api/storageApi";
import type { FileConversionType } from "@/api/types/file";
import { StorageItem } from "@/api/types/storage";
import { getConversionOptions } from "@/shared/fileConversion/getConversionOptions";
import { useCallback, useMemo } from "react";
import { Alert } from "react-native";
import {
  getStorageQuotaAlertMessage,
  isStorageQuotaExceededError,
} from "../../../utils/storageQuota";
import type { StorageSectionProps } from "../types";

type Params = {
  storageId: string;
  navigationParentId: string | null;
  sharedContext: StorageSectionProps["sharedContext"];
  sharedResourceId?: string;
  archiveMode: StorageSectionProps["archiveMode"];
  convertItem: StorageItem | null;
  setConvertItem: (v: StorageItem | null) => void;
  setConvertSubmitting: (v: boolean) => void;
};

export function useStorageSectionConversionAndArchive(params: Params) {
  const {
    storageId,
    navigationParentId,
    sharedContext,
    sharedResourceId,
    archiveMode,
    convertItem,
    setConvertItem,
    setConvertSubmitting,
  } = params;

  const [archiveRoomToStorage, { isLoading: isArchivingRoom }] =
    useArchiveRoomToStorageMutation();
  const [convertStorageFile] = useConvertStorageFileMutation();
  const [createStorageFolder] = useCreateStorageFolderMutation();

  const storageConversionOptions = useMemo(
    () =>
      convertItem && !convertItem.isDirectory && convertItem.fileId
        ? getConversionOptions(
            convertItem.fileMeta?.mimeType ?? "",
            convertItem.name
          )
        : [],
    [convertItem]
  );

  const handleStorageConvertSelect = useCallback(
    async (conversion: FileConversionType) => {
      if (!storageId || !convertItem?.fileId) return;
      setConvertSubmitting(true);
      try {
        let targetParentId = convertItem.parentId ?? undefined;

        // This conversion always produces multiple files; create a dedicated folder upfront.
        if (conversion === "pdf_to_images") {
          const folder = await createStorageFolder({
            storageId,
            ...(sharedResourceId ? { resourceId: sharedResourceId } : {}),
            name: `${convertItem.name} (converted)`,
            parentId: convertItem.parentId ?? undefined,
            isDirectory: true,
          }).unwrap();

          targetParentId =
            (folder.item as { id?: string; _id?: string }).id ??
            (folder.item as { id?: string; _id?: string })._id ??
            targetParentId;
        }

        const result = await convertStorageFile({
          storageId,
          ...(sharedResourceId ? { resourceId: sharedResourceId } : {}),
          fileId: convertItem.fileId,
          parentId: targetParentId,
          conversion,
        }).unwrap();
        const n = result.createdFiles?.length ?? 0;

        Alert.alert(
          "Готово",
          n > 1 ? `Создано файлов: ${n}` : "Файл сконвертирован и сохранён"
        );
        setConvertItem(null);
      } catch (e: unknown) {
        const err = e as { data?: { message?: string }; message?: string };
        Alert.alert(
          "Ошибка",
          String(
            err?.data?.message ?? err?.message ?? "Не удалось конвертировать"
          )
        );
      } finally {
        setConvertSubmitting(false);
      }
    },
    [
      storageId,
      convertItem,
      convertStorageFile,
      createStorageFolder,
      sharedResourceId,
      setConvertItem,
      setConvertSubmitting,
    ]
  );

  const handleConfirmArchiveRoom = useCallback(async () => {
    if (!archiveMode || !storageId) return;
    try {
      await archiveRoomToStorage({
        storageId,
        roomId: archiveMode.roomId,
        fileIds: archiveMode.fileIds,
        parentId: navigationParentId ?? undefined,
      }).unwrap();
      archiveMode.onComplete();
    } catch (e) {
      console.error("Archive room to storage failed:", e);
      if (isStorageQuotaExceededError(e)) {
        const detail = getStorageQuotaAlertMessage(e);
        Alert.alert(
          "Недостаточно места",
          detail
            ? `${detail}\n\nОсвободите место в хранилище или уменьшите объём архива.`
            : "В хранилище не хватает места для архива. Освободите место и повторите попытку."
        );
      } else {
        Alert.alert("Ошибка", "Не удалось архивировать комнату в хранилище.");
      }
    }
  }, [archiveMode, storageId, navigationParentId, archiveRoomToStorage]);

  return {
    storageConversionOptions,
    handleStorageConvertSelect,
    handleConfirmArchiveRoom,
    isArchivingRoom,
  };
}

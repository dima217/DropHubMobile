import {
    useDeleteRoomFilesMutation,
    useLazyDownloadRoomFilesQuery,
} from "@/api/fileApi";
import { roomApi } from "@/api/roomApi";
import { useI18n } from "@/shared/localization";
import { createUploader, UploadProvider } from "@/services/upload/UploaderFactory";
import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";

export const useRoomFileManipulations = (
  roomId?: string,
  onAfterDelete?: () => void
) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useI18n();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);

  const [deleteRoomFiles] = useDeleteRoomFilesMutation();
  const [downloadRoomFiles] = useLazyDownloadRoomFilesQuery();

  const incrementDownloadCountInRoomCache = useCallback(
    (fileId: string) => {
      if (!roomId) return;
      dispatch(
        roomApi.util.updateQueryData("getRoomDetails", roomId, (draft) => {
          const hit = draft.files?.find((file) => file._id === fileId);
          if (!hit) return;
          hit.downloadCount = (hit.downloadCount ?? 0) + 1;
        })
      );
    },
    [dispatch, roomId]
  );

  /* ---------- helpers ---------- */

  const resetSelection = useCallback(() => {
    setSelectedIds(new Set());
    setIsMultiSelectMode(false);
  }, []);

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
  
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
  
      setIsMultiSelectMode(next.size > 0);
      return next;
    });
  }, []);
  

  /* ---------- actions ---------- */

  const handleDownloadFiles = useCallback(
    async (fileIds: string[]) => {
      if (!roomId) return;

      try {
        const response = await downloadRoomFiles({ fileIds, roomId }).unwrap();
        const uploader = createUploader(UploadProvider.MINIO);

        for (const { fileId, url } of response) {
          await uploader.download(url);
          incrementDownloadCountInRoomCache(fileId);
          Alert.alert(
            t("rooms.download.success"),
            t("rooms.file.downloaded", { fileId })
          );
        }
      } catch (e) {
        console.error(e);
        Alert.alert(t("common.error"), t("rooms.download.failed"));
      }
    },
    [roomId, downloadRoomFiles, incrementDownloadCountInRoomCache, t]
  );

  const handleShareFiles = useCallback(
    async (fileIds: string[]) => {
      if (!roomId) return;

      try {
        const response = await downloadRoomFiles({ fileIds, roomId }).unwrap();
        const uploader = createUploader(UploadProvider.MINIO);

        for (const { url } of response) {
          await uploader.share(url);
        }
      } catch (e) {
        console.error(e);
        Alert.alert("Error", "Failed to share files");
      }
    },
    [roomId, downloadRoomFiles]
  );

  const handleDeleteFiles = useCallback(
    async (fileIds: string[]) => {
      if (!roomId) return;

      try {
        await deleteRoomFiles({ fileIds, roomId }).unwrap();
        resetSelection();
        onAfterDelete?.();
      } catch {
        Alert.alert("Error", "Failed to delete files");
      }
    },
    [roomId, deleteRoomFiles, resetSelection, onAfterDelete]
  );

  /* ---------- press handlers ---------- */

  const handleFilePress = useCallback(
    (id: string) => {
      if (isMultiSelectMode) toggleSelection(id);
    },
    [isMultiSelectMode, toggleSelection]
  );

  const handleFileLongPress = useCallback(
    (id: string) => toggleSelection(id),
    [toggleSelection]
  );

  return {
    selectedIds,
    isMultiSelectMode,

    resetSelection,
    toggleSelection, 


    handleDownloadFiles,
    handleShareFiles,
    handleDeleteFiles,

    handleFilePress,
    handleFileLongPress,
  };
};

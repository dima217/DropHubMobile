import { useUploadSharedConfirmMutation, useUploadSharedInitMutation } from "@/api/fileApi";
import { FileItem, FileUploadStatus } from "@/api/types/file";
import { UploadProgress } from "@/services/upload/AbstractUploader";
import { createUploader, UploadProvider } from "@/services/upload/UploaderFactory";
import { useResourcePicker } from "@/shared/MediaUploader/hooks/useMediaPicker";
import type { PendingUploadFile } from "@/shared/types/pendingUpload";
import {
  getStorageQuotaAlertMessage,
  isStorageQuotaExceededError,
} from "@/widgets/storage/utils/storageQuota";
import { useI18n } from "@/shared/localization";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

export interface UploadingFile {
  id: string;
  fileUri: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  progress: number;
  status: "uploading" | "confirming" | "completed" | "failed";
  fileItem?: FileItem;
}

/**
 * Shared upload pipeline:
 * - init: /upload/auth/storage/init-shared
 * - upload: PUT to returned uploadUrl(s)
 * - confirm: /upload/auth/storage/confirm-shared
 *
 * Note: backend expects `sharedId` in init/confirm and `resourceId` in confirm.
 * In this app, we pass:
 * - sharedId: storageId (shared container)
 * - resourceId: shared root id (route param)
 * - parentId: current folder within shared structure
 */
export const useSharedFileUpload = (
  storageId: string,
  sharedResourceId: string,
  parentId: string,
  currentUserId?: number
) => {
  const { tl } = useI18n();
  const [uploadSharedInit] = useUploadSharedInitMutation();
  const [uploadSharedConfirm] = useUploadSharedConfirmMutation();
  const { pickResource } = useResourcePicker();
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isUploadPreviewModalVisible, setIsUploadPreviewModalVisible] =
    useState(false);

  const pickFiles = useCallback(async () => {
    const selectedFiles = await pickResource("file");
    if (!selectedFiles || selectedFiles.length === 0) return;

    const filesToUpload: UploadingFile[] = await Promise.all(
      selectedFiles.map(async (media) => {
        const res = await fetch(media.uri);
        const blob = await res.blob();
        const contentType =
          res.headers.get("content-type") || "application/octet-stream";
        const fileName =
          media.name || media.uri.split("/").pop() || `file_${Date.now()}`;

        return {
          id: `upload_${Date.now()}_${Math.random()}`,
          fileUri: media.uri,
          fileName,
          fileSize: blob.size,
          mimeType: contentType,
          progress: 0,
          status: "uploading",
        };
      })
    );

    setUploadingFiles(filesToUpload);
    setIsUploadPreviewModalVisible(true);

    return filesToUpload;
  }, [pickResource]);

  const uploadFiles = useCallback(
    async (files: PendingUploadFile[]): Promise<boolean> => {
      const batch: UploadingFile[] = files.map((f) => ({
        ...f,
        status: f.status as UploadingFile["status"],
      }));
      try {
        const initResponse = await uploadSharedInit({
          storageId: storageId,
          files: batch.map((file) => ({
            originalName: file.fileName,
            fileSize: file.fileSize,
            mimeType: file.mimeType,
            uploaderIp: "",
          })),
        }).unwrap();

        if (!initResponse.success) {
          throw new Error("Failed to initialize shared upload");
        }

        const uploader = createUploader(UploadProvider.MINIO);

        await Promise.all(
          initResponse.result.map(async (res, index) => {
            const file = batch[index];

            const onProgress = (progress: UploadProgress) => {
              setUploadingFiles((prev) => {
                const updated = [...prev];
                updated[index] = {
                  ...file,
                  progress: Math.min(progress.percentage, 100),
                };
                return updated;
              });
            };

            await uploader.uploadWithProgress(res.uploadUrl, file.fileUri, onProgress);

            setUploadingFiles((prev) => {
              const updated = [...prev];
              updated[index] = {
                ...file,
                progress: 100,
                status: "confirming",
              };
              return updated;
            });

            const confirmResp = await uploadSharedConfirm({
              uploadId: res.uploadId,
              storageId: storageId,
              resourceId: sharedResourceId,
              parentId,
            }).unwrap();

            if (!confirmResp.success) {
              throw new Error("Failed to confirm shared upload");
            }

            setUploadingFiles((prev) => {
              const updated = [...prev];
              updated[index] = {
                ...file,
                status: "completed",
                fileItem: {
                  _id: confirmResp.fileId,
                  originalName: file.fileName,
                  key: "",
                  size: file.fileSize,
                  mimeType: file.mimeType,
                  uploadTime: new Date().toISOString(),
                  downloadCount: 0,
                  uploadedParts: 0,
                  expiresAt: null,
                  creatorId: currentUserId || 0,
                  storedName: file.fileName,
                  uploadSession: { status: FileUploadStatus.COMPLETE },
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  __v: 0,
                },
              };
              return updated;
            });
          })
        );

        setTimeout(() => {
          setUploadingFiles((prev) => prev.filter((f) => f.status !== "completed"));
        }, 100);

        return true;
      } catch (error) {
        setUploadingFiles((prev) => prev.map((f) => ({ ...f, status: "failed" })));
        if (isStorageQuotaExceededError(error)) {
          const detail = getStorageQuotaAlertMessage(error);
          Alert.alert(
            tl("Недостаточно места"),
            detail
              ? `${detail}\n\n${tl("Удалите ненужные файлы из хранилища или обратитесь за увеличением квоты.")}`
              : tl("Удалите ненужные файлы из хранилища или обратитесь за увеличением квоты.")
          );
        } else {
          Alert.alert(tl("Ошибка"), tl("Не удалось загрузить файлы."));
        }
        return false;
      }
    },
    [
      storageId,
      sharedResourceId,
      parentId,
      currentUserId,
      uploadSharedInit,
      uploadSharedConfirm,
    ]
  );

  const clearUploads = useCallback(() => {
    setUploadingFiles([]);
    setIsUploadPreviewModalVisible(false);
  }, []);

  return {
    uploadingFiles,
    isUploadPreviewModalVisible,
    setIsUploadPreviewModalVisible,
    pickFiles,
    uploadFiles,
    clearUploads,
  };
};

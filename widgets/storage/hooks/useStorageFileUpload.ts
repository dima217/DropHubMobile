import { useUploadStorageConfirmMutation, useUploadStorageInitMutation } from "@/api/fileApi";
import { FileItem, FileUploadStatus } from "@/api/types/file";
import { UploadProgress } from "@/services/upload/AbstractUploader";
import { createUploader, UploadProvider } from "@/services/upload/UploaderFactory";
import { useResourcePicker } from "@/shared/MediaUploader/hooks/useMediaPicker";
import { useCallback, useState } from "react";

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

export const useStorageFileUpload = (
  storageId: string,
  parentId: string | undefined,
  currentUserId?: number
) => {
  const [uploadStorageInit] = useUploadStorageInitMutation();
  const [uploadStorageConfirm] = useUploadStorageConfirmMutation();
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
    async (files: UploadingFile[]) => {
      try {
        const initResponse = await uploadStorageInit({
          storageId,
          files: files.map((file) => ({
            originalName: file.fileName,
            fileSize: file.fileSize,
            mimeType: file.mimeType,
            uploaderIp: "",
          })),
        }).unwrap();

        if (!initResponse.success) {
          throw new Error("Failed to initialize storage upload");
        }

        const uploader = createUploader(UploadProvider.MINIO);

        await Promise.all(
          initResponse.result.map(async (res, index) => {
            const file = files[index];

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

            await uploader.uploadWithProgress(
              res.uploadUrl,
              file.fileUri,
              onProgress
            );

            setUploadingFiles((prev) => {
              const updated = [...prev];
              updated[index] = {
                ...file,
                progress: 100,
                status: "confirming",
              };
              return updated;
            });

            const confirmResp = await uploadStorageConfirm({
              uploadId: res.uploadId,
              storageId,
              parentId,
            }).unwrap();

            if (!confirmResp.success) {
              throw new Error("Failed to confirm storage upload");
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
          setUploadingFiles((prev) =>
            prev.filter((f) => f.status !== "completed")
          );
        }, 100);

        return files.map((f) => f.fileItem?._id);
      } catch (error) {
        setUploadingFiles((prev) =>
          prev.map((f) => ({ ...f, status: "failed" }))
        );
        throw error;
      }
    },
    [storageId, parentId, currentUserId, uploadStorageInit, uploadStorageConfirm]
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



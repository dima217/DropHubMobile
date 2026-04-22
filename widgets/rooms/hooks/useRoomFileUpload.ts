import { useUploadRoomConfirmMutation, useUploadRoomFileMutation } from '@/api';
import { FileItem, FileUploadStatus } from '@/api/types/file';
import { UploadProgress } from '@/services/upload/AbstractUploader';
import { createUploader, UploadProvider } from '@/services/upload/UploaderFactory';
import { useResourcePicker } from '@/shared/MediaUploader/hooks/useMediaPicker';
import type { PendingUploadFile } from '@/shared/types/pendingUpload';
import { ensureUniqueUploadNames } from '@/shared/utils/uploadFileNames';
import { useI18n } from '@/shared/localization';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

export interface UploadingFile {
  id: string;
  fileUri: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  progress: number;
  status: 'uploading' | 'confirming' | 'completed' | 'failed';
  fileItem?: FileItem;
}

export const useRoomFileUpload = (
  roomId: string,
  currentUserId?: number,
  existingFileNames: string[] = []
) => {
  const { tl } = useI18n();
  const [uploadRoomFile] = useUploadRoomFileMutation();
  const [uploadRoomConfirm] = useUploadRoomConfirmMutation();
  const { pickResource } = useResourcePicker();
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isUploadPreviewModalVisible, setIsUploadPreviewModalVisible] = useState(false);

  // ================= Step 1: Pick files =================
  const pickFiles = useCallback(async () => {
    const selectedFiles = await pickResource("file");
    if (!selectedFiles || selectedFiles.length === 0) return;

    const filesToUpload: UploadingFile[] = await Promise.all(
      selectedFiles.map(async (media) => {
        const res = await fetch(media.uri);
        const blob = await res.blob();
        const contentType = res.headers.get('content-type') || 'application/octet-stream';
        const fileName = media.name || media.uri.split('/').pop() || `file_${Date.now()}`;

        return {
          id: `upload_${Date.now()}_${Math.random()}`,
          fileUri: media.uri,
          fileName,
          fileSize: blob.size,
          mimeType: contentType,
          progress: 0,
          status: 'uploading',
        };
      })
    );

    const filesPrepared =
      filesToUpload.length > 1
        ? ensureUniqueUploadNames(filesToUpload, existingFileNames)
        : filesToUpload;

    // Показываем модалку после выбора
    setUploadingFiles(filesPrepared);
    setIsUploadPreviewModalVisible(true);

    return filesPrepared;
  }, [pickResource, existingFileNames]);

  // ================= Step 2: Upload files =================
  const uploadFiles = useCallback(async (files: PendingUploadFile[]): Promise<boolean> => {
    const batch: UploadingFile[] = files.map((f) => ({
      ...f,
      status: f.status as UploadingFile['status'],
    }));
    try {
      const initResponse = await uploadRoomFile({
        roomId,
        files: batch.map(file => ({
          originalName: file.fileName,
          fileSize: file.fileSize,
          storedName: file.fileName,
          mimeType: file.mimeType,
          uploaderIp: '',
        })),
      }).unwrap();

      if (!initResponse.success) throw new Error('Failed to initialize upload');

      const uploader = createUploader(UploadProvider.MINIO);

      await Promise.all(initResponse.result.map(async (res, index) => {
        const file = batch[index];

        const onProgress = (progress: UploadProgress) => {
          setUploadingFiles(prev => {
            const updated = [...prev];
            updated[index] = { ...file, progress: Math.min(progress.percentage, 100) };
            return updated;
          });
        };

        await uploader.uploadWithProgress(res.uploadUrl, file.fileUri, onProgress);

        setUploadingFiles(prev => {
          const updated = [...prev];
          updated[index] = { ...file, progress: 100, status: 'confirming' };
          return updated;
        });

        const confirmResp = await uploadRoomConfirm({ roomId, uploadId: res.uploadId }).unwrap();
        if (!confirmResp.success) throw new Error('Failed to confirm upload');

        setUploadingFiles(prev => {
          const updated = [...prev];
          updated[index] = {
            ...file,
            status: 'completed',
            fileItem: {
              _id: confirmResp.fileId,
              originalName: file.fileName,
              key: '',
              size: file.fileSize,
              mimeType: file.mimeType,
              uploadTime: new Date().toISOString(),
              downloadCount: 0,
              uploadedParts: 0,
              expiresAt: null,
              creatorId: currentUserId || 0,
              storedName: '',
              uploadSession: { status: FileUploadStatus.COMPLETE },
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              __v: 0,
            },
          };
          return updated;
        });
      }));

      // Убираем завершённые файлы через небольшой delay
      setTimeout(() => {
        setUploadingFiles(prev => prev.filter(f => f.status !== 'completed'));
      }, 100);

      return true;
    } catch {
      setUploadingFiles(prev => prev.map(f => ({ ...f, status: 'failed' })));
      Alert.alert(tl("Ошибка"), tl("Не удалось загрузить файлы."));
      return false;
    }
  }, [roomId, currentUserId, uploadRoomFile, uploadRoomConfirm]);

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

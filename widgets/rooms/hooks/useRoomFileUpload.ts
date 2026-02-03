import { useUploadRoomConfirmMutation, useUploadRoomFileMutation } from '@/api';
import { FileItem, FileUploadStatus } from '@/api/types/file';
import { UploadProgress } from '@/services/upload/AbstractUploader';
import { createUploader, UploadProvider } from '@/services/upload/UploaderFactory';
import { useResourcePicker } from '@/shared/MediaUploader/hooks/useMediaPicker';
import { useCallback, useState } from 'react';

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

export const useRoomFileUpload = (roomId: string, currentUserId?: number) => {
  const [uploadRoomFile] = useUploadRoomFileMutation();
  const [uploadRoomConfirm] = useUploadRoomConfirmMutation();
  const { pickResource } = useResourcePicker();
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isUploadPreviewModalVisible, setIsUploadPreviewModalVisible] = useState(false);

  const uploadFiles = useCallback(async (files: { fileUri: string, fileName: string, fileSize: number, mimeType: string }[]) => {
    const filesWithStatus: UploadingFile[] = files.map(file => ({
      id: `upload_${Date.now()}_${Math.random()}`,
      ...file,
      progress: 0,
      status: 'uploading',
    }));

    setUploadingFiles(filesWithStatus);
    setIsUploadPreviewModalVisible(true);

    try {
      const initResponse = await uploadRoomFile({
        roomId,
        files: filesWithStatus.map(file => ({
          originalName: file.fileName,
          fileSize: file.fileSize,
          mimeType: file.mimeType,
          uploaderIp: '', 
        })),
      }).unwrap();

      if (!initResponse.success) throw new Error('Failed to initialize upload');

      const uploader = createUploader(UploadProvider.MINIO);

      await Promise.all(initResponse.result.map(async (res, index) => {
        const file = filesWithStatus[index];
        const onProgress = (progress: UploadProgress) => {
          setUploadingFiles(prev => {
            const updated = [...prev];
            updated[index] = { ...file, progress: progress.percentage };
            return updated;
          });
        };

        await uploader.uploadWithProgress(res.uploadUrl, file.fileUri, onProgress);

        setUploadingFiles(prev => {
          const updated = [...prev];
          updated[index] = { ...file, progress: 100, status: 'confirming' };
          return updated;
        });

        const confirmResp = await uploadRoomConfirm({
          roomId,
          uploadId: res.uploadId,
        }).unwrap();

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

      setTimeout(() => {
        setUploadingFiles(prev =>
          prev.filter(f => f.status !== 'completed')
        );
      }, 100);

      return filesWithStatus.map(f => f.fileItem?._id);
    } catch (error) {
      setUploadingFiles(prev => prev.map(f => ({ ...f, status: 'failed' })));
      throw error;
    }
  }, [roomId, currentUserId, uploadRoomFile, uploadRoomConfirm]);

  const pickAndUpload = useCallback(async () => {
    const selectedFiles = await pickResource("file");
    if (!selectedFiles || selectedFiles.length === 0) return;
  
    const filesToUpload = await Promise.all(
      selectedFiles.map(async (media) => {
        const res = await fetch(media.uri);
        const blob = await res.blob();
        const contentType = res.headers.get('content-type') || 'application/octet-stream';
        const fileName = media.name || media.uri.split('/').pop() || `file_${Date.now()}`;
  
        return {
          fileUri: media.uri,
          fileName,
          fileSize: blob.size,
          mimeType: contentType,
        };
      })
    );
  
    await uploadFiles(filesToUpload);
  }, [pickResource, uploadFiles]);
  

  return {
    uploadingFiles,
    isUploadPreviewModalVisible,
    setIsUploadPreviewModalVisible,
    uploadFiles,
    pickAndUpload,
  };
};

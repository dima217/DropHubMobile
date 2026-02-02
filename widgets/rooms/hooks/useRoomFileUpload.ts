import { useUploadRoomConfirmMutation, useUploadRoomFileMutation } from '@/api';
import { FileItem, FileUploadStatus } from '@/api/types/file';
import { UploadProgress } from '@/services/upload/AbstractUploader';
import { createUploader, UploadProvider } from '@/services/upload/UploaderFactory';
import { useMediaPicker } from '@/shared/MediaUploader/hooks/useMediaPicker';
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
  const { pickMedia } = useMediaPicker();
  const [uploadingFiles, setUploadingFiles] = useState<Map<string, UploadingFile>>(new Map());

  const uploadFile = useCallback(async (fileUri: string, fileName: string, fileSize: number, mimeType: string) => {
    const uploadId = `upload_${Date.now()}_${Math.random()}`;
    
    const uploadingFile: UploadingFile = {
      id: uploadId,
      fileUri,
      fileName,
      fileSize,
      mimeType,
      progress: 0,
      status: 'uploading',
    };

    setUploadingFiles(prev => new Map(prev).set(uploadId, uploadingFile));

    try {
      // Step 1: Initialize upload
      const initResponse = await uploadRoomFile({
        roomId,
        files: [{
          originalName: fileName,
          fileSize,
          mimeType,
          uploaderIp: '', // Will be set by backend
        }],
      }).unwrap();

      if (!initResponse.success || !initResponse.result[0]) {
        throw new Error('Failed to initialize upload');
      }

      const { uploadId: serverUploadId, uploadUrl } = initResponse.result[0];

      // Step 2: Upload file with progress
      const uploader = createUploader(UploadProvider.MINIO);
      const onProgress = (progress: UploadProgress) => {
        setUploadingFiles(prev => {
          const updated = new Map(prev);
          const file = updated.get(uploadId);
          if (file) {
            updated.set(uploadId, { ...file, progress: progress.percentage });
          }
          return updated;
        });
      };

      await uploader.uploadWithProgress(uploadUrl, fileUri, onProgress);

      // Step 3: Confirm upload
      setUploadingFiles(prev => {
        const updated = new Map(prev);
        const file = updated.get(uploadId);
        if (file) {
          updated.set(uploadId, { ...file, status: 'confirming', progress: 100 });
        }
        return updated;
      });

      const confirmResponse = await uploadRoomConfirm({
        roomId,
        uploadId: serverUploadId,
      }).unwrap();

      if (!confirmResponse.success) {
        throw new Error('Failed to confirm upload');
      }

      // Step 4: Mark as completed
      setUploadingFiles(prev => {
        const updated = new Map(prev);
        const file = updated.get(uploadId);
        if (file) {
          updated.set(uploadId, {
            ...file,
            status: 'completed',
            fileItem: {
              _id: confirmResponse.fileId,
              originalName: fileName,
              key: '',
              size: fileSize,
              mimeType,
              uploadTime: new Date().toISOString(),
              downloadCount: 0,
              uploadedParts: 0,
              expiresAt: null,
              creatorId: currentUserId || 0,
              storedName: '',
              uploadSession: {
                status: FileUploadStatus.COMPLETE,
              },
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              __v: 0,
            },
          });
        }
        return updated;
      });

      // Remove from uploading files after a delay
      setTimeout(() => {
        setUploadingFiles(prev => {
          const updated = new Map(prev);
          updated.delete(uploadId);
          return updated;
        });
      }, 2000);

      return confirmResponse.fileId;
    } catch (error) {
      setUploadingFiles(prev => {
        const updated = new Map(prev);
        const file = updated.get(uploadId);
        if (file) {
          updated.set(uploadId, { ...file, status: 'failed' });
        }
        return updated;
      });
      throw error;
    }
  }, [roomId, currentUserId, uploadRoomFile, uploadRoomConfirm]);

  const pickAndUpload = useCallback(async () => {
    const media = await pickMedia();
    if (!media) return;

    const fileInfo = await fetch(media.uri).then(res => {
      const contentType = res.headers.get('content-type') || 'application/octet-stream';
      return {
        uri: media.uri,
        fileName: media.uri.split('/').pop() || 'file',
        fileSize: 0, // Will be determined from file
        mimeType: contentType,
      };
    });

    // Get actual file size
    const fileResponse = await fetch(media.uri);
    const blob = await fileResponse.blob();
    fileInfo.fileSize = blob.size;

    await uploadFile(fileInfo.uri, fileInfo.fileName, fileInfo.fileSize, fileInfo.mimeType);
  }, [pickMedia, uploadFile]);

  return {
    uploadingFiles: Array.from(uploadingFiles.values()),
    uploadFile,
    pickAndUpload,
  };
};


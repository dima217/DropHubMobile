import { FileItem, FileUploadStatus } from "@/api/types/file";
import { RoomDetails } from "@/api/types/room";
import { User } from "@/store/slices/authSlice";
import { ResourceItem } from "@/widgets/rooms/components/ResourcesSection";
import { UploadingFile } from "../hooks/useRoomFileUpload";

export const mapUploadingFilesToResources = (
  uploadingFiles: UploadingFile[],
  user: User | null
): ResourceItem[] =>
  uploadingFiles.map((uploadingFile) => {
    return {
      id: uploadingFile.id,
      type: "file",
      file: uploadingFile.fileItem ?? {
        _id: uploadingFile.id,
        originalName: uploadingFile.fileName,
        key: "",
        size: uploadingFile.fileSize,
        mimeType: uploadingFile.mimeType,
        uploadTime: new Date().toISOString(),
        downloadCount: 0,
        uploadedParts: 0,
        expiresAt: null,
        creatorId: user?.id ? parseInt(user.id) : 0,
        storedName: "",
        uploadSession: {
          status:
            uploadingFile.status === "completed"
              ? FileUploadStatus.COMPLETE
              : FileUploadStatus.IN_PROGRESS,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        __v: 0,
      },
      authorAvatarUrl: user?.avatarUrl,
      authorFirstName: user?.firstName,
      authorUserId: user?.id ? parseInt(user.id) : undefined,
      uploadProgress: uploadingFile.progress,
    };
  });

export const mapRoomFilesToResources = (
  roomDetails: RoomDetails | undefined
): ResourceItem[] =>
  roomDetails?.files?.map((file: FileItem) => {
    const author = roomDetails.participantsDetails?.find(
      (p) => p.userId === file.creatorId
    );

    return {
      id: file._id,
      type: "file",
      file,
      authorAvatarUrl: author?.profile?.avatarUrl,
      authorFirstName: author?.profile?.firstName,
      authorUserId: file.creatorId,
    };
  }) ?? [];

export const combineRoomResources = (
  uploadingFiles: UploadingFile[],
  roomDetails: RoomDetails | undefined,
  user: User | null
): ResourceItem[] => {
  const uploadingResources = mapUploadingFilesToResources(uploadingFiles, user);
  const roomResources = mapRoomFilesToResources(roomDetails);

  // Combine resources, prioritizing uploading files (they should appear first)
  // and avoiding duplicates (if a file is already in room files, don't add uploading version)
  const roomFileIds = new Set(roomResources.map((r) => r.id));
  const filteredUploadingResources = uploadingResources.filter(
    (r) => !roomFileIds.has(r.id)
  );

  return [...filteredUploadingResources, ...roomResources];
};
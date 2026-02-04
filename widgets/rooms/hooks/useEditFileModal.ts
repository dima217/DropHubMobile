import { useUpdateRoomFileMutation } from "@/api/fileApi";
import { useCallback, useState } from "react";

export const useEditFileModal = (roomId: string) => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [newFileName, setNewFileName] = useState<string>('');

  const [updateRoomFile] = useUpdateRoomFileMutation();

  const openEditFileModal = useCallback((fileId: string, currentName: string) => {
    setEditingFileId(fileId);
    setNewFileName(currentName);
    setIsEditModalVisible(true);
  }, []);

  const saveFileName = useCallback((storedName?: string) => {
    if (editingFileId && (storedName || newFileName).trim()) {
      updateRoomFile({
        fileId: editingFileId,
        roomId,
        storedName: (storedName || newFileName).trim(),
      });
      setIsEditModalVisible(false);
      setEditingFileId(null);
      setNewFileName('');
    }
  }, [editingFileId, newFileName, roomId, updateRoomFile]);
  

  const cancelEdit = useCallback(() => {
    setIsEditModalVisible(false);
    setEditingFileId(null);
    setNewFileName('');
  }, []);

  return {
    isEditModalVisible,
    editingFileId,
    newFileName,
    openEditFileModal,
    saveFileName,
    cancelEdit,
  };
};

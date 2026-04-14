/**
 * Файл, выбранный для загрузки (превью-модалка и хуки upload).
 * Статус — строка, чтобы не дублировать union из разных экранов.
 */
export type PendingUploadFile = {
  id: string;
  fileUri: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  progress: number;
  status: string;
};

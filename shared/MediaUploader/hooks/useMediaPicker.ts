import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import * as VideoThumbnails from "expo-video-thumbnails";
import { useState } from "react";
import { Alert } from "react-native";

export type MediaType = "image" | "video" | "file" | "audio";

export interface MediaFile {
  uri: string;
  type: MediaType;
  name?: string;
  size?: number;
  thumbnail?: string | null;
}

const MAX_FILE_MB = 100;

export const useResourcePicker = () => {
  const [media, setMedia] = useState<MediaFile[]>([]);

  const showError = (title: string, message: string) => {
    Alert.alert(title, message);
  };

  const validateSize = (bytes?: number) => {
    const sizeMB = (bytes ?? 0) / (1024 * 1024);
    if (sizeMB > MAX_FILE_MB) {
      showError(
        "Слишком большой файл",
        `Максимальный размер — ${MAX_FILE_MB}MB`
      );
      return false;
    }
    return true;
  };

  /* ================= IMAGE / VIDEO ================= */

  const pickMedia = async (type?: "image" | "video") => {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      showError("Нет доступа", "Разреши доступ к галерее");
      return [];
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        type === "image"
          ? ImagePicker.MediaTypeOptions.Images
          : type === "video"
          ? ImagePicker.MediaTypeOptions.Videos
          : ImagePicker.MediaTypeOptions.All,
      quality: 1,
      allowsMultipleSelection: true, 
    });

    if (result.canceled) return [];

    const pickedFiles: MediaFile[] = [];

    for (const asset of result.assets) {
      if (!validateSize(asset.fileSize)) continue;

      let thumbnail: string | null = null;

      if (asset.type === "video") {
        try {
          const res = await VideoThumbnails.getThumbnailAsync(asset.uri, {
            time: 1000,
          });
          thumbnail = res.uri;
        } catch (e) {
          console.warn("[thumbnail] failed:", e);
        }
      }

      pickedFiles.push({
        uri: asset.uri,
        type: asset.type as MediaType,
        size: asset.fileSize,
        thumbnail,
      });
    }

    setMedia((prev) => [...prev, ...pickedFiles]);
    return pickedFiles;
  };

  /* ================= FILE / AUDIO ================= */

  const pickDocument = async (type: "file" | "audio") => {
    const result = await DocumentPicker.getDocumentAsync({
      type: type === "audio" ? "audio/*" : "*/*",
      copyToCacheDirectory: true,
      multiple: true, // <--- Включаем множественный выбор
    });

    if (result.canceled) return [];

    const pickedFiles: MediaFile[] = [];

    for (const file of result.assets) {
      if (!validateSize(file.size)) continue;

      pickedFiles.push({
        uri: file.uri,
        type,
        name: file.name,
        size: file.size,
      });
    }

    setMedia((prev) => [...prev, ...pickedFiles]);
    return pickedFiles;
  };

  /* ================= PUBLIC API ================= */

  const pickResource = async (type?: MediaType) => {
    if (type === "image" || type === "video" || !type) {
      return pickMedia(type);
    }

    if (type === "file" || type === "audio") {
      return pickDocument(type);
    }

    return [];
  };

  const clearMedia = () => {
    setMedia([]);
  };

  const labelByType =
    media.length > 0
      ? `${media.length} файл${media.length > 1 ? "ов" : ""} выбрано`
      : "Добавить файл";

  return {
    media,
    pickResource,
    clearMedia,
    labelByType,
  };
};

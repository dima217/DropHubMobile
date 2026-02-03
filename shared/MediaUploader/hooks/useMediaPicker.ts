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
  const [media, setMedia] = useState<MediaFile | null>(null);

  const showError = (title: string, message: string) => {
    Alert.alert(title, message);
  };

  const validateSize = (bytes?: number) => {
    const sizeMB = (bytes ?? 0) / (1024 * 1024);
    console.log("[validateSize] sizeMB:", sizeMB);

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
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        type === "image"
          ? ImagePicker.MediaTypeOptions.Images
          : type === "video"
            ? ImagePicker.MediaTypeOptions.Videos
            : ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });

    if (result.canceled) return;

    const asset = result.assets[0];

    if (!validateSize(asset.fileSize)) return;

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

    const picked: MediaFile = {
      uri: asset.uri,
      type: asset.type as MediaType,
      size: asset.fileSize,
      thumbnail,
    };

    setMedia(picked);
    return picked;
  };

  /* ================= FILE / AUDIO ================= */

  const pickDocument = async (type: "file" | "audio") => {
    const result = await DocumentPicker.getDocumentAsync({
      type: type === "audio" ? "audio/*" : "*/*",
      copyToCacheDirectory: true,
    });

    if (result.canceled) return;

    const file = result.assets[0];

    if (!validateSize(file.size)) return;

    const picked: MediaFile = {
      uri: file.uri,
      type,
      name: file.name,
      size: file.size,
    };

    setMedia(picked);
    return picked;
  };

  /* ================= PUBLIC API ================= */

  const pickResource = async (type?: MediaType) => {
    console.log("[pickResource] type:", type);

    if (type === "image" || type === "video" || !type) {
      return pickMedia(type);
    }

    if (type === "file" || type === "audio") {
      return pickDocument(type);
    }
  };

  const clearMedia = () => {
    setMedia(null);
  };

  const labelByType = media
    ? media.type === "image"
      ? "Фото выбрано"
      : media.type === "video"
        ? "Видео выбрано"
        : media.type === "audio"
          ? "Аудио выбрано"
          : "Файл выбран"
    : "Добавить файл";

  return {
    media,
    pickResource,
    clearMedia,
    labelByType,
  };
};

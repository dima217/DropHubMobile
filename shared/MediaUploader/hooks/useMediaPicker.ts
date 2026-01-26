import * as ImagePicker from "expo-image-picker";
import * as VideoThumbnails from "expo-video-thumbnails";
import { useState } from "react";
import { Alert } from "react-native";

export type MediaType = "image" | "video";

export interface MediaFile {
  uri: string;
  type: MediaType;
  thumbnail?: string | null;
}

const MAX_FILE_MB = 100;

export const useMediaPicker = () => {
  const [media, setMedia] = useState<MediaFile | null>(null);

  const showError = (title: string, message: string) => {
    Alert.alert(title, message);
  };

  const validateFile = (asset: ImagePicker.ImagePickerAsset) => {
    const sizeMB = (asset.fileSize ?? 0) / (1024 * 1024);
    console.log("[validateFile] sizeMB:", sizeMB);
    if (sizeMB > MAX_FILE_MB) {
      showError(
        "Слишком большой файл",
        `Максимальный размер — ${MAX_FILE_MB}MB.`
      );
      return false;
    }
    return true;
  };

  const requestPermissions = async () => {
    try {
      console.log("[requestPermissions] Requesting permissions...");
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log("[requestPermissions] Permissions status:", status);
      if (status !== "granted") {
        showError(
          "No permission",
          "Please allow access to your media library."
        );
        return false;
      }
      return true;
    } catch (e) {
      console.error("[requestPermissions] Failed to request permissions:", e);
      showError("Error", "Failed to request permissions.");
      return false;
    }
  };

  const getVideoThumbnail = async (uri: string): Promise<string | null> => {
    try {
      console.log("[getVideoThumbnail] Creating thumbnail for video:", uri);
      const { uri: thumbnail } = await VideoThumbnails.getThumbnailAsync(uri, {
        time: 1000,
      });
      console.log("[getVideoThumbnail] Thumbnail created:", thumbnail);
      return thumbnail;
    } catch (e) {
      console.warn("[getVideoThumbnail] Failed to create video thumbnail:", e);
      return null;
    }
  };

  const pickMedia = async (allowedType?: MediaType) => {
    console.log("[pickMedia] Start picking media...");
    const granted = await requestPermissions();
    if (!granted) {
      console.log("[pickMedia] Permissions not granted, aborting");
      return;
    }

    try {
      console.log("[pickMedia] Opening media library...");

      const mediaTypes =
        allowedType === "image"
          ? ["images"]
          : allowedType === "video"
            ? ["videos"]
            : ["images", "videos"];

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: mediaTypes as any,
        quality: 1,
      });

      console.log("[pickMedia] Media picker result:", result);

      if (result.canceled) {
        console.log("[pickMedia] User canceled media picking");
        return;
      }

      const asset = result.assets[0];
      console.log("[pickMedia] Picked asset:", asset);

      if (allowedType && asset.type !== allowedType) {
        console.log(
          "[pickMedia] Picked media type does not match expected type"
        );
        showError(
          "Invalid media type",
          `Expected ${allowedType === "image" ? "image" : "video"}, but got ${
            asset.type === "image" ? "image" : "video"
          }.`
        );
        return;
      }

      if (!validateFile(asset)) {
        console.log("[pickMedia] File did not pass validation");
        return;
      }

      let thumbnail: string | null = null;
      if (asset.type === "video") {
        thumbnail = await getVideoThumbnail(asset.uri);
      }

      console.log("[pickMedia] Saving media to state:", {
        uri: asset.uri,
        type: asset.type,
        thumbnail,
      });

      const picked = {
        uri: asset.uri,
        type: asset.type as MediaType,
        thumbnail,
      };

      setMedia(picked);
      return picked;
    } catch (e) {
      console.error("[pickMedia] Error while picking media:", e);
      showError("Error", "Failed to open media library");
    }
  };

  const clearMedia = () => {
    console.log("[clearMedia] Clearing media");
    setMedia(null);
  };

  const labelByType = media
    ? media.type === "image"
      ? "Photo uploaded"
      : "Video uploaded"
    : "Add media";

  return {
    media,
    pickMedia,
    clearMedia,
    labelByType,
  };
};

import { downloadToDownloads } from "@/native/downloader";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { NativeModules } from "react-native";
import { AbstractUploader, UploadProgress } from "./AbstractUploader";

export class MinioUploader extends AbstractUploader {
  async upload(uploadUrl: string, fileUri: string): Promise<string> {
    return this.uploadWithProgress(uploadUrl, fileUri);
  }

  async uploadWithProgress(
    uploadUrl: string,
    fileUri: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<string> {
    const fileResponse = await fetch(fileUri);
    const blob = await fileResponse.blob();

    await this.uploadWithXhr(uploadUrl, blob, onProgress);

    return this.getDownloadUrl(uploadUrl);
  }

  // ===========================
  // НАДЁЖНЫЙ DOWNLOAD → SHARE
  // ===========================
  async download(downloadUrl: string): Promise<string> {
    const fileName =
      downloadUrl.split("/").pop() ?? `download_${Date.now()}`;

    // sandbox приложения
    const fileUri = FileSystem.documentDirectory + fileName;

    const { uri } = await FileSystem.downloadAsync(
      downloadUrl,
      fileUri
    );

    // Диагностика: проверяем доступность нативного модуля
    console.log("NativeModules:", Object.keys(NativeModules));
    console.log("NativeModules.Downloader:", NativeModules.Downloader);
    if (NativeModules.Downloader) {
      console.log("Downloader module methods:", Object.keys(NativeModules.Downloader));
    } else {
      console.warn("Downloader module is not available. Make sure to rebuild the app.");
    }

    await downloadToDownloads(downloadUrl, fileName);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    }

    return uri;
  }

  private uploadWithXhr(
    uploadUrl: string,
    blob: Blob,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open("PUT", uploadUrl, true);
      xhr.setRequestHeader(
        "Content-Type",
        blob.type || "application/octet-stream"
      );

      if (onProgress) {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            onProgress({
              loaded: event.loaded,
              total: event.total,
              percentage: (event.loaded / event.total) * 100,
            });
          }
        };
      }

      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve();
        } else {
          reject(
            new Error(`MinIO upload failed: ${xhr.status}`)
          );
        }
      };

      xhr.onerror = () => {
        reject(new Error("MinIO upload failed: network error"));
      };

      xhr.send(blob);
    });
  }
}

import { downloadToDownloads } from "@/native/downloader";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
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

  async download(downloadUrl: string): Promise<string> {
    const fileName = (() => {
      const lastPart = downloadUrl.split("/").pop() ?? `download_${Date.now()}`;
      return lastPart.split("?")[0];
    })();

    console.log('downloading file', downloadUrl, fileName);
    await downloadToDownloads(downloadUrl, fileName);
    return fileName;
  }

  async share(downloadUrl: string): Promise<void> {
    const fileName = (() => {
      const lastPart = downloadUrl.split("/").pop() ?? `download_${Date.now()}`;
      return lastPart.split("?")[0];
    })();

    const fileUri = FileSystem.documentDirectory + fileName;

    const { uri } = await FileSystem.downloadAsync(downloadUrl, fileUri);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    }
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
            const percentage = Math.min((event.loaded / event.total) * 100, 100);
            onProgress({
              loaded: event.loaded,
              total: event.total,
              percentage,
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

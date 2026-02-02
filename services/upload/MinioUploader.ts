import * as FileSystem from "expo-file-system";
import { AbstractUploader, DownloadProgress, UploadProgress } from "./AbstractUploader";

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

  async download(
    downloadUrl: string,
    onProgress?: (progress: DownloadProgress) => void
  ): Promise<string> {
    const fileName = downloadUrl.split("/").pop() || `download_${Date.now()}`;
    const fileUri = `${FileSystem.Directory}${fileName}`;

    const downloadResumable = FileSystem.createDownloadResumable(
      downloadUrl,
      fileUri,
      {},
      (downloadProgress) => {
        const total = downloadProgress.totalBytesExpectedToWrite || 0;
        const loaded = downloadProgress.totalBytesWritten || 0;
        const percentage = total > 0 ? (loaded / total) * 100 : 0;

        if (onProgress) {
          onProgress({
            loaded,
            total,
            percentage,
          });
        }
      }
    );

    const result = await downloadResumable.downloadAsync();
    
    if (!result) {
      throw new Error("Download failed: no result");
    }

    return result.uri;
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
        blob.type || "image/jpeg"
      );

      if (onProgress) {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentage = (event.loaded / event.total) * 100;
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

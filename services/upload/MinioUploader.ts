import { AbstractUploader } from "./AbstractUploader";

export class MinioUploader extends AbstractUploader {
  async upload(uploadUrl: string, fileUri: string): Promise<string> {
    const fileResponse = await fetch(fileUri);
    const blob = await fileResponse.blob();

    await this.uploadWithXhr(uploadUrl, blob);

    console.log("uploadUrl123: ", uploadUrl);

    return this.getDownloadUrl(uploadUrl);
  }

  private uploadWithXhr(uploadUrl: string, blob: Blob): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open("PUT", uploadUrl, true);
      xhr.setRequestHeader(
        "Content-Type",
        blob.type || "image/jpeg"
      );

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

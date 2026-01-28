import { AbstractUploader } from "./AbstractUploader";

export class MinioUploader extends AbstractUploader {
  async upload(uploadUrl: string, fileUri: string): Promise<string> {

    const fileResponse = await fetch(fileUri);
    const blob = await fileResponse.blob();

    const res = await fetch(uploadUrl, {
      method: "PUT",
      body: blob,
      headers: {
        "Content-Type": blob.type || "image/jpeg",
      },
    });

    if (!res.ok) {
      throw new Error(`MinIO upload failed: ${res.status}`);
    }

    return this.getDownloadUrl(uploadUrl);
  }
}
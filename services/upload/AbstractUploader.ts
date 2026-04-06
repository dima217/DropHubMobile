export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface DownloadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export abstract class AbstractUploader {
    /**
     * Uploads a file and returns the download URL
     */
    abstract upload(
      uploadUrl: string,
      fileUri: string
    ): Promise<string>;

    /**
     * Uploads a file with progress tracking
     */
    abstract uploadWithProgress(
      uploadUrl: string,
      fileUri: string,
      onProgress?: (progress: UploadProgress) => void
    ): Promise<string>;

    /**
     * Downloads a file and tracks progress
     */
    abstract download(
      downloadUrl: string,
      onProgress?: (progress: DownloadProgress) => void
    ): Promise<string>;

    /**
     * Get the download URL from the upload URL
     * (by default, remove query params)
     */
    protected getDownloadUrl(uploadUrl: string): string {
      return uploadUrl.split("?")[0];
    }

    abstract share(downloadUrl: string): Promise<void>;
  }
  
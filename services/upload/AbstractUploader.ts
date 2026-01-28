export abstract class AbstractUploader {
    /**
     * Uploads a file and returns the download URL
     */
    abstract upload(
      uploadUrl: string,
      fileUri: string
    ): Promise<string>;

    /**
     * Get the download URL from the upload URL
     * (by default, remove query params)
     */
    protected getDownloadUrl(uploadUrl: string): string {
      return uploadUrl.split("?")[0];
    }
  }
  
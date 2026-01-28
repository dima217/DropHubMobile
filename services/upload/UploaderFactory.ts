import { AbstractUploader } from "./AbstractUploader";
import { MinioUploader } from "./MinioUploader";

export enum UploadProvider {
  MINIO = "minio",
}

export const createUploader = (
  provider: UploadProvider
): AbstractUploader => {
  switch (provider) {
    case UploadProvider.MINIO:
    default:
      return new MinioUploader();
  }
};

import { NativeModules, Platform } from "react-native";

const { Downloader } = NativeModules;

if (Platform.OS === "android" && !Downloader) {
  console.warn(
    "Downloader native module is not available. Make sure you have rebuilt the app after adding the native module."
  );
}

export async function downloadToDownloads(
  url: string,
  fileName?: string
): Promise<boolean> {
  if (Platform.OS !== "android") {
    throw new Error("Android only");
  }

  if (!Downloader) {
    throw new Error(
      "Downloader native module is not available. Please rebuild the app."
    );
  }

  if (!Downloader.download) {
    throw new Error(
      "Downloader.download method is not available. Please check the native module implementation."
    );
  }
  console.log("Downloader.download:", "fdfdfd");

  const name =
    fileName ?? url.split("/").pop() ?? `file_${Date.now()}`;

  const result: boolean = await Downloader.download(url, name);
  console.log("Native result:", result);

  return result;
}

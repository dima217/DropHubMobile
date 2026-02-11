import { useLazyDownloadStorageFileQuery } from "@/api/fileApi";
import { StorageItem } from "@/api/types/storage";
import { useCallback, useEffect, useRef, useState } from "react";

const PREVIEWABLE_MIME_PREFIXES = ["image/", "video/"];

const isPreviewable = (item: StorageItem): boolean => {
  const mime = item.fileMeta?.mimeType || "";
  return PREVIEWABLE_MIME_PREFIXES.some((prefix) => mime.startsWith(prefix));
};

export const useStoragePreviewUrls = (
  storageId: string,
  items: StorageItem[],
  previewEnabled: boolean
) => {
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});
  const [fetchDownloadUrls] = useLazyDownloadStorageFileQuery();
  const fetchedRef = useRef<Set<string>>(new Set());

  const fetchUrls = useCallback(async () => {
    if (!storageId || !previewEnabled) return;

    const previewableItems = items.filter(
      (item) =>
        !item.isDirectory &&
        item.fileId &&
        isPreviewable(item) &&
        !fetchedRef.current.has(item.fileId)
    );

    if (previewableItems.length === 0) return;

    const fileIds = previewableItems
      .map((item) => item.fileId!)
      .filter(Boolean);

    try {
      const response = await fetchDownloadUrls({
        storageId,
        fileIds,
      }).unwrap();

      const urlMap: Record<string, string> = {};
      for (const entry of response) {
        urlMap[entry.fileId] = entry.url;
        fetchedRef.current.add(entry.fileId);
      }

      setPreviewUrls((prev) => ({ ...prev, ...urlMap }));
    } catch {
      // silently fail — previews are not critical
    }
  }, [storageId, items, previewEnabled, fetchDownloadUrls]);

  useEffect(() => {
    fetchUrls();
  }, [fetchUrls]);

  // Clear cache when preview is disabled
  useEffect(() => {
    if (!previewEnabled) {
      setPreviewUrls({});
      fetchedRef.current.clear();
    }
  }, [previewEnabled]);

  return previewUrls;
};


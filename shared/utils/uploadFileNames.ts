import type { PendingUploadFile } from "@/shared/types/pendingUpload";

const FALLBACK_FILE_NAME = "file";

export const normalizeFileName = (name: string): string =>
  (name || "").trim().toLocaleLowerCase();

const splitFileName = (name: string): { stem: string; ext: string } => {
  const trimmed = name.trim();
  if (!trimmed) return { stem: FALLBACK_FILE_NAME, ext: "" };
  const lastDot = trimmed.lastIndexOf(".");
  if (lastDot <= 0 || lastDot === trimmed.length - 1) {
    return { stem: trimmed, ext: "" };
  }
  return {
    stem: trimmed.slice(0, lastDot),
    ext: trimmed.slice(lastDot),
  };
};

export const makeUniqueFileName = (
  desiredName: string,
  occupiedNormalizedNames: Set<string>
): string => {
  const initial = desiredName.trim() || FALLBACK_FILE_NAME;
  const initialKey = normalizeFileName(initial);
  if (!occupiedNormalizedNames.has(initialKey)) {
    occupiedNormalizedNames.add(initialKey);
    return initial;
  }

  const { stem, ext } = splitFileName(initial);
  let n = 1;
  while (true) {
    const candidate = `${stem} (${n})${ext}`;
    const key = normalizeFileName(candidate);
    if (!occupiedNormalizedNames.has(key)) {
      occupiedNormalizedNames.add(key);
      return candidate;
    }
    n += 1;
  }
};

export const ensureUniqueUploadNames = <T extends PendingUploadFile>(
  files: T[],
  existingNames: string[]
): T[] => {
  const occupied = new Set(existingNames.map(normalizeFileName));
  return files.map((file) => ({
    ...file,
    fileName: makeUniqueFileName(file.fileName, occupied),
  }));
};

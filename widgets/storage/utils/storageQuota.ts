const UNITS = ["Б", "КиБ", "МиБ", "ГиБ", "ТиБ"] as const;

/** Форматирует размер в байтах (двоичные единицы, как у `maxBytes` на бэкенде).
 *  Передайте `tl` из `useI18n()` для перевода единиц измерения. */
export function formatBytes(bytes: number, tl?: (text: string) => string): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    const unit = tl ? tl("Б") : "Б";
    return `0 ${unit}`;
  }
  const i = Math.min(
    UNITS.length - 1,
    Math.floor(Math.log(bytes) / Math.log(1024))
  );
  const value = bytes / 1024 ** i;
  const rounded = i === 0 ? Math.round(value) : Math.round(value * 10) / 10;
  const unit = tl ? tl(UNITS[i]) : UNITS[i];
  return `${rounded} ${unit}`;
}

export function storageFreeBytes(maxBytes: number, usedBytes: number): number {
  return Math.max(0, maxBytes - usedBytes);
}

export function storageUsedFraction(
  usedBytes: number,
  maxBytes: number
): number {
  if (!Number.isFinite(maxBytes) || maxBytes <= 0) return 0;
  return Math.min(1, Math.max(0, usedBytes / maxBytes));
}

function messageFromUnknownData(data: unknown): string {
  if (data == null) return "";
  if (typeof data === "string") return data;
  if (typeof data === "object" && "message" in data) {
    const m = (data as { message?: unknown }).message;
    if (typeof m === "string") return m;
    if (Array.isArray(m)) return m.filter((x) => typeof x === "string").join(" ");
  }
  return "";
}

/** HTTP 413 / текст квоты от Nest / RPC-код в сообщении. */
export function isStorageQuotaExceededError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const e = error as {
    status?: number | string;
    data?: unknown;
    message?: string;
  };
  if (e.status === 413) return true;
  const msg = `${messageFromUnknownData(e.data)} ${e.message ?? ""}`;
  return (
    /quota exceeded/i.test(msg) ||
    /STORAGE_QUOTA_EXCEEDED/i.test(msg) ||
    /storage quota/i.test(msg)
  );
}

export function getStorageQuotaAlertMessage(error: unknown): string {
  const fromData = messageFromUnknownData(
    error && typeof error === "object" && "data" in error
      ? (error as { data?: unknown }).data
      : undefined
  );
  if (fromData.trim()) return fromData.trim();
  return "Квота хранилища исчерпана.";
}

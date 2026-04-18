import { useSharedFileUpload } from "@/widgets/shared/hooks/useSharedFileUpload";
import { useStorageFileUpload } from "@/widgets/storage/hooks/useStorageFileUpload";

const UNUSED = "__unused__";

/**
 * Один вызов для экрана: внутри всегда оба upload-хука (правила React),
 * наружу отдаётся только активный пайплайн по `variant`.
 */
export function useStorageOrSharedUpload(options: {
  variant: "storage" | "shared";
  storageId: string;
  /** Текущая папка (storage) */
  storageParentId: string | undefined;
  /** Корень shared + текущая папка для confirm-shared */
  sharedResourceId: string;
  sharedParentId: string;
  existingFileNames: string[];
  currentUserId?: number;
}) {
  const storageUpload = useStorageFileUpload(
    options.variant === "storage" ? options.storageId : UNUSED,
    options.variant === "storage" ? options.storageParentId : undefined,
    options.currentUserId,
    options.variant === "storage" ? options.existingFileNames : []
  );

  const sharedUpload = useSharedFileUpload(
    options.variant === "shared" ? options.storageId : UNUSED,
    options.variant === "shared" ? options.sharedResourceId : UNUSED,
    options.variant === "shared" ? options.sharedParentId : UNUSED,
    options.currentUserId
  );

  return options.variant === "shared" ? sharedUpload : storageUpload;
}

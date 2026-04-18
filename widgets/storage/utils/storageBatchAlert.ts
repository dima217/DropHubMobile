import type { StorageBatchResponse } from "@/api/types/storage";
import { Alert } from "react-native";

const MAX_LINES = 8;

/**
 * Показывает итог batch-операции: «успешно N из M» и при ошибках — первые строки из `results`.
 */
export function showStorageBatchResultAlert(
  result: StorageBatchResponse,
  titleOk: string
): void {
  const { total, succeeded, failed, results } = result;
  const lines: string[] = [];
  if (failed > 0) {
    const errs = results.filter((r) => !r.success && r.error);
    for (const r of errs.slice(0, MAX_LINES)) {
      lines.push(`• ${r.itemId}: ${r.error ?? "ошибка"}`);
    }
    if (errs.length > MAX_LINES) {
      lines.push(`… и ещё ${errs.length - MAX_LINES}`);
    }
  }
  const summary =
    failed === 0
      ? `${titleOk}\n\nОбработано: ${succeeded} из ${total}.`
      : `Готово: ${succeeded} из ${total}, ошибок: ${failed}.${lines.length ? `\n\n${lines.join("\n")}` : ""}`;
  Alert.alert(failed === 0 ? "Готово" : "Частично выполнено", summary);
}

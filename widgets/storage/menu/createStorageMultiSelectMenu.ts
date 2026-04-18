import { ActionMenuItemData } from "@/shared/ui/ActionMenu/ActionMenuItem";

export interface StorageMultiSelectActions {
  onMove: () => void;
  onCopy: () => void;
  onMoveToTrash: () => void;
  onAddToFavorites: () => void;
  onSetTags: () => void;
  onCancel: () => void;
}

/** Пункты меню для {@link MultiSelectBar} на экране хранилища (RU). */
export function createStorageMultiSelectMenuItems(
  selectedCount: number,
  actions: StorageMultiSelectActions,
  opts?: { hideBatchCopy?: boolean }
): ActionMenuItemData[] {
  const disabled = selectedCount === 0;
  const items: ActionMenuItemData[] = [
    {
      id: "batch-move",
      icon: "move",
      label: "Переместить",
      disabled,
      onPress: actions.onMove,
    },
  ];
  if (!opts?.hideBatchCopy) {
    items.push({
      id: "batch-copy",
      icon: "copy",
      label: "Копировать",
      disabled,
      onPress: actions.onCopy,
    });
  }
  return [
    ...items,
    {
      id: "batch-trash",
      icon: "trash-2",
      label: "В корзину",
      destructive: true,
      disabled,
      onPress: actions.onMoveToTrash,
    },
    {
      id: "batch-fav",
      icon: "star",
      label: "В избранное",
      disabled,
      onPress: actions.onAddToFavorites,
    },
    {
      id: "batch-tags",
      icon: "tag",
      label: "Теги",
      disabled,
      onPress: actions.onSetTags,
    },
    {
      id: "batch-cancel",
      icon: "x",
      label: "Отмена",
      onPress: actions.onCancel,
    },
  ];
}

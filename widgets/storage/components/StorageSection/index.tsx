import React from "react";
import { View as RNView } from "react-native";
import { useStorageSectionController } from "./hooks/useStorageSectionController";
import { storageSectionStyles as styles } from "./styles";
import { StorageSectionLayout } from "./StorageSectionLayout";
import type { StorageSectionProps } from "./types";

export type {
  ResolvedStorageSectionOptions,
  StorageSectionOptions,
  StorageSectionProps,
} from "./types";

/**
 * Universal storage section component that manages storage data, navigation,
 * modals, and item actions. Use wherever you need a self-contained storage
 * browser (main storage tab, shared storage view, etc.).
 *
 * - Fetches storage info, structure, and favorites via API hooks
 * - Manages modal state (rename, move, tags, permissions, etc.) via StorageSectionModals
 * - Supports optional breadcrumbs, preview toggle, FAB, and header actions
 * - Parent must pass `menuOptions`; optional `getMenuItems` overrides default menu building
 */
export const StorageSection: React.FC<StorageSectionProps> = (props) => {
  const vm = useStorageSectionController(props);

  if (vm.isStorageInfoError || vm.isStructureError) {
    return (
      <RNView style={styles.center}>
        <RNView style={styles.errorContainer}>
          {/* Текст ошибки можно вынести в options или i18n */}
        </RNView>
      </RNView>
    );
  }

  return <StorageSectionLayout vm={vm} />;
};

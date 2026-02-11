import { Colors } from "@/constants/design-tokens";
import { TagColorMap, setTagColor } from "@/store/slices/tagColorsSlice";
import { RootState } from "@/store/store";
import React, { useMemo, useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ModalHeader } from "../../shared/ModalHeader";
import { AddTagSection } from "./components/AddTagSection";
import { ExistingTagsSelector } from "./components/ExistingTagsSelector";
import { TagList } from "./components/TagList";

interface TagsModalProps {
  visible: boolean;
  tags: string[];
  onClose: () => void;
  onRemoveTag: (tag: string) => void;
  onAddTag?: (tag: string) => void;
  title?: string;
  canAdd?: boolean;
  allStorageTags?: string[];
}

const TagsModal: React.FC<TagsModalProps> = ({
  visible,
  tags,
  onClose,
  onRemoveTag,
  onAddTag,
  title = "Теги",
  canAdd = true,
  allStorageTags = [],
}) => {
  const [newTag, setNewTag] = useState("");
  const [editingTag, setEditingTag] = useState<string | null>(null);

  const dispatch = useDispatch();
  const tagColors = useSelector(
    (state: RootState) => (state.tagColors as { colors: TagColorMap }).colors
  );

  const availableTags = useMemo(() => {
    const currentTagSet = new Set(tags);
    return allStorageTags.filter((t) => !currentTagSet.has(t));
  }, [allStorageTags, tags]);

  const handleSelectColor = (tag: string, color: string) => {
    dispatch(setTagColor({ tag, color }));
    setEditingTag(null);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>

          <ModalHeader title={title} onClose={onClose} />

          {canAdd && (
            <>
              <AddTagSection
                value={newTag}
                onChange={setNewTag}
                onAdd={onAddTag}
                existingTags={tags}
              />

              <ExistingTagsSelector
                availableTags={availableTags}
                tagColors={tagColors}
                onSelect={onAddTag}
              />
            </>
          )}

          <TagList
            tags={tags}
            tagColors={tagColors}
            editingTag={editingTag}
            onEditToggle={setEditingTag}
            onRemoveTag={onRemoveTag}
            onSelectColor={handleSelectColor}
          />

        </View>
      </View>
    </Modal>
  );
};

export default TagsModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    padding: 20,
  },
});
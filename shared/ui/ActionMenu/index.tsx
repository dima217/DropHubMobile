import { Colors } from "@/constants/design-tokens";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import ActionMenuItem, { ActionMenuItemData } from "./ActionMenuItem";
import BottomActionSheet from "./BottomActionSheet";

interface ActionMenuProps {
  items: ActionMenuItemData[];
  title?: string;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ items, title }) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleOpen = () => {
    setIsVisible(true);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleItemPress = (item: ActionMenuItemData) => {
    if (!item.disabled) {
      item.onPress();
      handleClose();
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={handleOpen}
        style={styles.button}
        activeOpacity={0.7}
      >
        <Feather name="more-vertical" size={20} color={Colors.brightText} />
      </TouchableOpacity>

      <BottomActionSheet
        isVisible={isVisible}
        onClose={handleClose}
        title={title}
      >
        <View style={styles.itemsContainer}>
          {items.map((item) => (
            <ActionMenuItem
              key={item.id}
              item={item}
              onPress={() => handleItemPress(item)}
            />
          ))}
        </View>
      </BottomActionSheet>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  itemsContainer: {
    width: "100%",
    gap: 8,
  },
});

export default ActionMenu;


import D from "@/assets/images/D.svg";
import { useRouter } from "expo-router";
import { ReactNode, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import ExitConfirmationModal from "../Modals/ExitConfirmationModal";
import { ThemedText } from "../core/ThemedText";

type HeaderProps = {
  title?: string;
  confirmOnExit?: boolean;
  onBackPress?: () => void;
  rightAction?: ReactNode;
};

const Header = ({ title, confirmOnExit = false, onBackPress, rightAction }: HeaderProps) => {
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const goBack = () => {
    if (onBackPress) {
      onBackPress();
      return;
    }

    if (router.canGoBack?.()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  const handleBackPress = () => {
    if (confirmOnExit) {
      setIsModalVisible(true);
    } else {
      goBack();
    }
  };

  const handleConfirmExit = () => {
    setIsModalVisible(false);
    goBack();
  };

  const handleCancelExit = () => {
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container} pointerEvents="box-none">
      <Pressable onPress={handleBackPress}>
        <ThemedText type="link">Back</ThemedText>
      </Pressable>

      {title && (
        <ThemedText
          type="subtitle"
          style={styles.title}
          pointerEvents="none"
        >
          {title}
        </ThemedText>
      )}

      {rightAction || (
        <Pressable onPress={() => {}}>
          <D width={22} height={22} />
        </Pressable>
      )}

      {confirmOnExit && (
        <ExitConfirmationModal
          isVisible={isModalVisible}
          onConfirmExit={handleConfirmExit}
          onCancel={handleCancelExit}
        />
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    textAlign: "center",
  },
});

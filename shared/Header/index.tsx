import D from "@/assets/images/D.svg";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useI18n } from "@/shared/localization";
import { useRouter } from "expo-router";
import { ReactNode, useState } from "react";
import { Pressable, View } from "react-native";
import ExitConfirmationModal from "../Modals/ExitConfirmationModal";
import { ThemedText } from "../core/ThemedText";
import createHeaderStyles from "./styles";

type HeaderProps = {
  title?: string;
  confirmOnExit?: boolean;
  onBackPress?: () => void;
  rightAction?: ReactNode;
};

const Header = ({
  title,
  confirmOnExit = false,
  onBackPress,
  rightAction,
}: HeaderProps) => {
  const { tl } = useI18n();
  const router = useRouter();

  const colors = useThemeColors();
  const styles = createHeaderStyles(colors);

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
        <ThemedText type="subtitle" style={styles.title} pointerEvents="none">
          {tl(title)}
        </ThemedText>
      )}

      {rightAction || (
        <Pressable onPress={() => {}}>
          <D width={22} height={22} fill="#AAAA" />
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

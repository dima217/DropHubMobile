import { Colors } from "@/constants/design-tokens";
import Button from "@/shared/Button";
import { ThemedText } from "@/shared/core/ThemedText";
import GradientView from "@/shared/Gradient";
import React, { ReactNode } from "react";
import { Modal, StyleSheet, View, ViewStyle } from "react-native";

export interface BaseModalButton {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textColor?: string;
  variant?: "primary" | "secondary";
}

export interface BaseModalProps {
  isVisible: boolean;
  title?: string;
  message?: string;
  children?: ReactNode;
  buttons?: BaseModalButton[];
  onClose?: () => void;
  width?: string | number;
  height?: string | number;
  titleType?: "title" | "subtitle" | "default" | "mini" | "notion" | "s" | "xs";
  messageType?:
    | "title"
    | "subtitle"
    | "default"
    | "mini"
    | "notion"
    | "s"
    | "xs";
}

const BaseModal: React.FC<BaseModalProps> = ({
  isVisible,
  title,
  message,
  children,
  buttons,
  onClose,
  width = "85%",
  height = "32%",
  titleType = "subtitle",
  messageType = "default",
}) => {
  const handleRequestClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const defaultButtons: BaseModalButton[] = buttons || [
    {
      title: "Close",
      onPress: handleRequestClose,
      variant: "primary",
    },
  ];

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleRequestClose}
    >
      <View style={styles.centeredView}>
        <View
          style={[
            styles.innerContainer,
            {
              width:
                typeof width === "number"
                  ? width
                  : typeof width === "string"
                  ? (width as `${number}%`)
                  : undefined,
              height:
                typeof height === "number"
                  ? height
                  : typeof height === "string"
                  ? (height as `${number}%`)
                  : undefined,
            },
          ]}
        >
          <GradientView style={styles.modalView}>
            {title && (
              <ThemedText style={styles.modalTitle}>{title}</ThemedText>
            )}
            {message && (
              <ThemedText style={styles.modalText}>{message}</ThemedText>
            )}
            {children && (
              <View style={styles.childrenContainer}>{children}</View>
            )}
            <View style={styles.buttonContainer}>
              {defaultButtons.map((button, index) => (
                <Button
                  key={index}
                  title={button.title}
                  onPress={button.onPress}
                  style={[
                    styles.button,
                    button.variant === "primary" && styles.buttonPrimary,
                    button.variant === "secondary" && styles.buttonSecondary,
                    button.style,
                  ]}
                  textColor={
                    button.textColor ||
                    (button.variant === "secondary"
                      ? Colors.primary
                      : undefined)
                  }
                />
              ))}
            </View>
          </GradientView>
        </View>
      </View>
    </Modal>
  );
};

export default BaseModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  innerContainer: {
    width: "85%",
    height: "32%",
  },
  modalView: {
    borderRadius: 12,
    justifyContent: "center",
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    marginBottom: 10,
  },
  modalText: {
    marginBottom: 20,
    textAlign: "center",
  },
  childrenContainer: {
    width: "100%",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    gap: 10,
  },
  button: {
    elevation: 2,
    marginHorizontal: 5,
  },
  buttonPrimary: {
    backgroundColor: Colors.primary,
  },
  buttonSecondary: {
    backgroundColor: Colors.text,
    borderWidth: 1,
  },
});

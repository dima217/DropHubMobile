import { ThemedText } from "@/shared/core/ThemedText";
import { useThemeColors } from "@/hooks/useThemeColors";
import GradientView from "@/shared/Gradient";
import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import CreateSupportTicketFormFields from "./components/CreateSupportTicketFormFields";
import CreateSupportTicketModalFooter from "./components/CreateSupportTicketModalFooter";
import { createSupportTicketModalStyles } from "./styles";

export type CreateSupportTicketPayload = {
  title: string;
  details: string;
  contactEmail?: string;
};

export type CreateSupportTicketModalProps = {
  visible: boolean;
  mode: "auth" | "anonymous";
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateSupportTicketPayload) => void;
};

const CreateSupportTicketModal: React.FC<CreateSupportTicketModalProps> = ({
  visible,
  mode,
  isSubmitting,
  onClose,
  onSubmit,
}) => {
  const colors = useThemeColors();
  const styles = useMemo(
    () => createSupportTicketModalStyles(colors),
    [colors]
  );
  const { height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  useEffect(() => {
    if (visible) {
      setTitle("");
      setDetails("");
      setContactEmail("");
    }
  }, [visible]);

  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withTiming(visible ? 1 : 0, { duration: 260 });
  }, [visible, progress]);

  const overlayStyle = useAnimatedStyle(() => ({ opacity: progress.value }));
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(progress.value, [0, 1], [480, 0]) }],
  }));

  const submit = () => {
    const t = title.trim();
    const d = details.trim();
    const e = contactEmail.trim();
    if (!t || !d) return;
    if (mode === "anonymous" && !e) return;
    onSubmit(
      mode === "anonymous"
        ? { title: t, details: d, contactEmail: e }
        : { title: t, details: d }
    );
  };

  const canSubmit =
    title.trim().length > 0 &&
    details.trim().length > 0 &&
    (mode === "auth" || contactEmail.trim().length > 0);

  const sheetPaddingBottom = 16 + insets.bottom;
  const reservedOutsideScroll = 260;
  const scrollMaxHeight = Math.max(
    140,
    Math.min(
      340,
      Math.round(windowHeight * 0.88) - reservedOutsideScroll - insets.bottom
    )
  );
  const sheetMaxHeight = Math.round(windowHeight * 0.88) - insets.bottom;

  if (!visible) return null;

  const subtitle =
    mode === "anonymous"
      ? "Опишите проблему. После отправки доступ к тикету сохранится на устройстве."
      : "Мы ответим на обращение в разделе «Мои обращения».";

  return (
    <Modal visible transparent animationType="none" onRequestClose={isSubmitting ? undefined : onClose}>
      <View style={styles.fill}>
        <View style={styles.modalRoot}>
          <TouchableWithoutFeedback onPress={isSubmitting ? undefined : onClose}>
            <Animated.View style={[styles.backdrop, overlayStyle]} />
          </TouchableWithoutFeedback>

          <Animated.View
            style={[
              styles.sheetWrap,
              sheetStyle,
              { maxHeight: sheetMaxHeight },
            ]}
          >
            <GradientView
              style={StyleSheet.flatten([
                styles.sheet,
                { paddingBottom: sheetPaddingBottom },
              ])}
            >
              <View style={styles.handleRow}>
                <View style={styles.handle} />
              </View>
              <ThemedText style={styles.title}>Новое обращение</ThemedText>
              <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>

              <CreateSupportTicketFormFields
                mode={mode}
                title={title}
                details={details}
                contactEmail={contactEmail}
                onTitle={setTitle}
                onDetails={setDetails}
                onContactEmail={setContactEmail}
                disabled={isSubmitting}
                scrollMaxHeight={scrollMaxHeight}
              />

              <CreateSupportTicketModalFooter
                isSubmitting={isSubmitting}
                canSubmit={canSubmit}
                onCancel={onClose}
                onSubmit={submit}
              />
            </GradientView>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
};

export default CreateSupportTicketModal;

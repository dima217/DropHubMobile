import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import GradientView from "@/shared/Gradient";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type Props = {
  onOpenForm: () => void;
};

const SupportAnonymousEmptyCTA: React.FC<Props> = ({ onOpenForm }) => (
  <GradientView style={styles.card}>
    <View style={styles.iconWrap}>
      <Feather name="life-buoy" size={36} color={Colors.primary} />
    </View>
    <ThemedText style={styles.title}>Поддержка без входа</ThemedText>
    <ThemedText style={styles.text}>
      Если нет доступа к аккаунту, создайте обращение — связь с вами будет по email.
      Доступ к тикету сохранится только на этом устройстве.
    </ThemedText>
    <TouchableOpacity style={styles.btn} onPress={onOpenForm} activeOpacity={0.85}>
      <Feather name="edit-3" size={20} color={Colors.brightText} style={styles.btnIcon} />
      <ThemedText style={styles.btnText}>Написать в поддержку</ThemedText>
    </TouchableOpacity>
  </GradientView>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.inactive,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.brightText,
    textAlign: "center",
    marginBottom: 10,
  },
  text: {
    color: Colors.text,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginBottom: 20,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 14,
  },
  btnIcon: { marginRight: 10 },
  btnText: { color: Colors.brightText, fontWeight: "600", fontSize: 16 },
});

export default SupportAnonymousEmptyCTA;

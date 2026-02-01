import { useGetRoomDetailsQuery } from "@/api/roomApi";
import { Colors } from "@/constants/design-tokens";
import Header from "@/shared/Header";
import View from "@/shared/View";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import RoomPlaceholder from "./room-placeholder";

const RoomDetails = () => {
  const router = useRouter();
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const { data: roomDetails, isLoading } = useGetRoomDetailsQuery(roomId || "", {
    skip: !roomId,
  });

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title="Room Details" />
        <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
      </View>
    );
  }

  if (!roomDetails?.participantsDetails) {
    return (
      <View style={styles.container}>
        <Header title="Room Not Found" />
      </View>
    );
  }

  const hasFiles = roomDetails.files && roomDetails.files.length > 0;

  // Если нет файлов, показываем placeholder
  if (!hasFiles) {
    return <RoomPlaceholder />;
  }

  // TODO: Реализовать экран с реальными деталями комнаты
  return (
    <View style={styles.container}>
      <Header title={roomDetails.owner || "Room Details"} />
      <View style={styles.content}>
        {/* Болванка для деталей комнаты */}
        {/* Здесь будет список файлов, участники и т.д. */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loader: {
    marginTop: 50,
  },
});

export default RoomDetails;


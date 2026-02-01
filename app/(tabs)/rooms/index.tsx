import { useGetFriendsQuery } from "@/api/friendApi";
import { useGetByRoomsListQuery } from "@/api/roomApi";
import { Colors } from "@/constants/design-tokens";
import Button from "@/shared/Button";
import Header from "@/shared/Header";
import CreateRoomModal from "@/shared/Modals/RoomModals/CreateRoomModal";
import View from "@/shared/View";
import RoomCard from "@/widgets/rooms/components/RoomCard";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet } from "react-native";

const Rooms = () => {
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { data: rooms, isLoading, refetch } = useGetByRoomsListQuery();
  const { data: friends, isLoading: isGettingFriends } = useGetFriendsQuery();

  const handleAddRoom = () => {
    setShowCreateModal(true);
  };

  const handleCreateSuccess = (roomId: string) => {
    refetch();
  };

  const handleRoomPress = (roomId: string) => {
    router.push(`/rooms/${roomId}?roomId=${roomId}`);
  };

  return (
    <View>
      <Header title="Rooms" />
      
      <Button
        title="Add New Room"
        onPress={handleAddRoom}
        style={styles.addButton}
      />

      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={rooms || []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RoomCard
              room={item}
              friends={friends || []}
              onPress={() => handleRoomPress(item.id)}
              notificationCount={0} // TODO: Получать из WebSocket или состояния
              onRefresh={refetch}
            />
          )}
          contentContainerStyle={styles.listContainer}
          refreshing={isLoading}
          onRefresh={refetch}
        />
      )}

      <CreateRoomModal
        isVisible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  addButton: {
    marginTop: 20,
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  loader: {
    marginTop: 50,
  },
});

export default Rooms;

import { useGetFriendsQuery } from "@/api/friendApi";
import { roomApi, useGetByRoomsListQuery } from "@/api/roomApi";
import { RoomDetails } from "@/api/types/room";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useThemeColors } from "@/hooks/useThemeColors";

import { useAddedToRoom } from "@/hooks/data/useAddedToRoom";
import { useRemovedFromRoom } from "@/hooks/data/useRemovedFromRoom";
import { secureStore } from "@/services/secureStore";
import Button from "@/shared/Button";
import Header from "@/shared/Header";
import SearchButton from "@/shared/SearchButton";
import CreateRoomModal from "@/shared/Modals/RoomModals/CreateRoomModal";
import View from "@/shared/View";
import RoomCard from "@/widgets/rooms/components/RoomCard";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";

const Rooms = () => {
  const themeColors = useThemeColors();
  const styles = useThemedStyles((c) => ({

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

}));

  const router = useRouter();
  const dispatch = useDispatch();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const { data: rooms, isLoading, refetch } = useGetByRoomsListQuery();
  const { data: friends, isLoading: isGettingFriends } = useGetFriendsQuery();

  React.useEffect(() => {
    secureStore.getAccessToken().then(setAccessToken);
  }, []);

  // Handle WebSocket updates for room additions
  useAddedToRoom(
    accessToken || '',
    useCallback((room: RoomDetails) => {
      // Invalidate and refetch rooms list
      dispatch(roomApi.util.invalidateTags(['Room']));
      refetch();
    }, [dispatch, refetch]),
    !!accessToken
  );

  // Handle WebSocket updates for room removals
  useRemovedFromRoom(
    accessToken || '',
    useCallback((roomId: string) => {
      // Invalidate and refetch rooms list
      dispatch(roomApi.util.invalidateTags(['Room']));
      refetch();
    }, [dispatch, refetch]),
    !!accessToken
  );

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
      <Header title="Rooms" rightAction={<SearchButton />} />
      
      <Button
        title="Add New Room"
        onPress={handleAddRoom}
        style={styles.addButton}
      />

      {isLoading ? (
        <ActivityIndicator size="large" color={themeColors.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={rooms || []}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <RoomCard
              room={item}
              friends={friends || []}
              onPress={() => handleRoomPress(item.id)}
              notificationCount={0}
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

export default Rooms;

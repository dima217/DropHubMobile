import { useGetByRoomsListQuery } from "@/api/roomApi";
import { RoomItem } from "@/api/types/room";
import { Colors } from "@/constants/design-tokens";
import AccountDetails from "@/shared/AccountDetails";
import View from "@/shared/View";
import SearchButton from "@/shared/SearchButton";
import Header from "@/shared/Header";
import ConnectionCard from "@/widgets/home/components/ConnectionCard";
import StorageCard from "@/widgets/home/components/StorageCard";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  ScrollView,
  View as RNView,
  StyleSheet,
} from "react-native";

// Helper function to check if room is active
const isRoomActive = (room: RoomItem): boolean => {
  if (!room.expiresAt) return true;
  return new Date(room.expiresAt) > new Date();
};

const Home = () => {
  const { data: rooms, isLoading } = useGetByRoomsListQuery();
  
  const activeRoomsCount = useMemo(() => {
    if (!rooms) return 0;
    return rooms.filter(isRoomActive).length;
  }, [rooms]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Home" rightAction={<SearchButton />} />
      <RNView style={styles.accountDetailsContainer}>
      <AccountDetails />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <StorageCard activeRoomsCount={activeRoomsCount} />

        <ConnectionCard />
      </ScrollView>
      </RNView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  accountDetailsContainer: {
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingBottom: 100,
  },
});

export default Home;

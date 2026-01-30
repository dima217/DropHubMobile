// screens/Connections.tsx
import {
  useAcceptFriendRequestMutation,
  useGetFriendRequestsQuery,
  useGetFriendsQuery,
  useRejectFriendRequestMutation,
} from "@/api/friendApi";
import { FriendRequestDirection, FriendRequestResponse } from "@/api/types/friend";
import { useFriendRequestUpdate } from "@/hooks/data/useFriendRequestUpdate";
import { ThemedText } from "@/shared/core/ThemedText";
import GradientButton from "@/shared/GradientButton";
import Header from "@/shared/Header";
import SearchInput from "@/shared/SearchInput";
import Toogle from "@/shared/Toogle";
import View from "@/shared/View";
import { RootState } from "@/store/store";
import ConnectionsList, {
  FriendItem,
  FriendRequestItem,
} from "@/widgets/profile/Screens/Connections/components/ConnectionsList";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { View as RNView, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

const Connections = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("Friends");
  const [friendRequests, setFriendRequests] = useState<FriendRequestResponse[]>([]);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [updatesEnabled, setUpdatesEnabled] = useState(false);

  const initialFriendRequests = useGetFriendRequestsQuery(undefined, {
    skip: selectedTab !== "Requests",
  });

  useEffect(() => {
    if (initialFriendRequests && !updatesEnabled) {
      setFriendRequests(initialFriendRequests.data || []);
      setUpdatesEnabled(true);
    }
  }, [initialFriendRequests, updatesEnabled]);

  const handleFriendRequestUpdate = useCallback((updatedMatch: FriendRequestResponse) => {
    setFriendRequests((prev) =>
      prev.map((request) => (request.requestId === updatedMatch.requestId ? updatedMatch : request))
    );
  }, []);

  useFriendRequestUpdate(accessToken ?? "", handleFriendRequestUpdate, updatesEnabled);

  const friends = useGetFriendsQuery(undefined, {
    skip: selectedTab !== "Friends",
  });

  const [acceptFriendRequest, { isLoading: isAccepting }] =
    useAcceptFriendRequestMutation();
  const [rejectFriendRequest, { isLoading: isRejecting }] =
    useRejectFriendRequestMutation();

  const handleAcceptRequest = async (item: FriendRequestItem) => {
    try {
      await acceptFriendRequest({ requestId: item.requestId }).unwrap();
      setFriendRequests((prev) =>
        prev.filter((req) => req.requestId !== item.requestId)
      );
    } catch (error) {
      console.error("Failed to accept friend request:", error);
    }
  };

  const handleRejectRequest = async (item: FriendRequestItem) => {
    try {
      await rejectFriendRequest({ requestId: item.requestId }).unwrap();
      setFriendRequests((prev) =>
        prev.filter((req) => req.requestId !== item.requestId)
      );
    } catch (error) {
      console.error("Failed to reject friend request:", error);
    }
  };

  const handleShareResource = (item: FriendItem) => {
    console.log("Share resource with:", item);
  };

  const friendsData: FriendItem[] =
    friends.data?.friends
      .map((friend) => ({
        id: friend.friendProfile.id,
        firstName: friend.friendProfile.firstName,
        avatarUrl: friend.friendProfile.avatarUrl,
        friendshipId: friend.friendshipId,
      }))
      .filter(
        (friend) =>
          !search ||
          friend.firstName.toLowerCase().includes(search.toLowerCase())
      ) || [];

  const requestsData: FriendRequestItem[] =
    friendRequests
      .filter((request) => request.direction === FriendRequestDirection.INCOMING)
      .map((request) => ({
        id: request.profile.id,
        firstName: request.profile.firstName,
        avatarUrl: request.profile.avatarUrl,
        requestId: request.requestId,
      }))
      .filter(
        (request) =>
          !search ||
          request.firstName.toLowerCase().includes(search.toLowerCase())
      ) || [];

  return (
    <View>
      <Header title="Connections" />

      <RNView style={styles.topRow}>
        <ThemedText type="link" style={styles.connectionsText}>
          Connections ({friends.data?.friends?.length || 0})
        </ThemedText>
        <GradientButton
          style={styles.addButton}
          title="New Connection"
          onPress={() => router.push("/search/connections-search")}
        />
      </RNView>

      <Toogle
        options={["Friends", "Requests"]}
        selected={selectedTab}
        onSelect={setSelectedTab}
      />

      <SearchInput value={search} onChange={setSearch} />

      <ConnectionsList
        data={selectedTab === "Friends" ? friendsData : requestsData}
        type={selectedTab === "Friends" ? "friend" : "friendRequest"}
        onAcceptRequest={handleAcceptRequest}
        onRejectRequest={handleRejectRequest}
        onShareResource={handleShareResource}
        isLoading={isAccepting || isRejecting}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  topRow: {
    marginTop: "12%",
    gap: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  addButton: {
    width: "40%",
  },
  connectionsText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Connections;

// screens/Connections.tsx
import {
  useAcceptFriendRequestMutation,
  useGetFriendRequestsQuery,
  useGetFriendsQuery,
  useRejectFriendRequestMutation,
} from "@/api/friendApi";
import { FriendRequestResponse } from "@/api/types/friend";
import { useFriendRequestUpdate } from "@/hooks/data/useFriendRequestUpdate";
import { ThemedText } from "@/shared/core/ThemedText";
import GradientButton from "@/shared/GradientButton";
import Header from "@/shared/Header";
import SearchInput from "@/shared/SearchInput";
import Toogle from "@/shared/Toogle";
import View from "@/shared/View";
import { RootState } from "@/store/store";
import { mapFriendsToFriendItems, mapRequestsToFriendRequestItems } from "@/widgets/connections/utils/mapper";
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
    skip: false,
  });
  
  const friends = useGetFriendsQuery(undefined, {
    skip: false,
  });

  useEffect(() => {
    if (initialFriendRequests.data && !updatesEnabled) {
      setFriendRequests(initialFriendRequests.data || []);
      setUpdatesEnabled(true);
    }
  }, [initialFriendRequests, updatesEnabled]);

  const handleFriendRequestUpdate = useCallback((updatedRequest: FriendRequestResponse) => {
    setFriendRequests((prev) =>
      prev.map((request) => (request.requestId === updatedRequest.requestId ? updatedRequest : request))
    );
  }, []);

  useFriendRequestUpdate(accessToken!, handleFriendRequestUpdate, updatesEnabled);

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
      initialFriendRequests.refetch();
      friends.refetch();
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
      initialFriendRequests.refetch();
      friends.refetch();
    } catch (error) {
      console.error("Failed to reject friend request:", error);
    }
  };

  const handleShareResource = (item: FriendItem) => {
    console.log("Share resource with:", item);
  };

  const friendsData = mapFriendsToFriendItems(friends.data, search);
  const requestsData = mapRequestsToFriendRequestItems(friendRequests, search);

  return (
    <View>
      <Header title="Connections" />

      <RNView style={styles.topRow}>
        <ThemedText type="link" style={styles.connectionsText}>
          Connections ({friends.data?.length || 0})
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
    marginBottom: 20,
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

import { FriendRequestDirection, FriendRequestResponse, RequestStatus } from "@/api/types/friend";
import { FriendItem, FriendRequestItem } from "@/widgets/profile/Screens/Connections/components/ConnectionsList";

export const mapFriendsToFriendItems = (
  friends: any[] | undefined,
  search: string
): FriendItem[] => {
  if (!friends) return [];

  return friends
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
    );
};

export const mapRequestsToFriendRequestItems = (
  requests: FriendRequestResponse[],
  search: string
): FriendRequestItem[] => {
  return requests
    .filter(
      (request) =>
        request.direction === FriendRequestDirection.INCOMING &&
        request.status === RequestStatus.PENDING
    )
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
    );
};

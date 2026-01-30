export interface Friend {
  friendshipId: number;
  friendProfile: {
    id: number;
    firstName: string;
    avatarUrl: string;
  };
}

export interface AcceptFriendRequestRequest {
  requestId: number;
}

export interface AcceptFriendRequestResponse {
  message: string;
}

export interface RejectFriendRequestRequest {
  requestId: number;
}

export interface RejectFriendRequestResponse {
  message: string;
}

export interface CancelFriendRequestRequest {
  requestId: number;
}

export interface CancelFriendRequestResponse {
  message: string;
}

export interface RemoveFriendRequest {
  friendshipId: number;
}

export interface RemoveFriendResponse {
  message: string;
}

export interface AddFriendRequest {
  profileId: number;
}

export interface AddFriendResponse {
  requestId: number;
  message: string;
}


export enum RequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  CANCELED = 'CANCELED',
}

export enum FriendRequestDirection {
  INCOMING = 'INCOMING',
  OUTGOING = 'OUTGOING',
}

export interface FriendRequestResponse {
  requestId: number;
  direction: FriendRequestDirection;
  status: RequestStatus;
  profile: {
    id: number;
    firstName: string;
    avatarUrl: string;
  };
}
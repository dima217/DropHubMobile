import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "./baseApi";
import { AddUserToRoomRequest, AddUserToRoomResponse, CreateRoomRequest, CreateRoomResponse, DeleteRoomRequest, DeleteRoomResponse, RemoveUsersFromRoomRequest, RemoveUsersFromRoomResponse, Room, RoomDetails, RoomItem } from "./types/room";

export const roomApi = createApi({
  reducerPath: "roomApi",
  baseQuery: baseQueryWithRefresh,
  endpoints: (build) => ({
    createRoom: build.mutation<CreateRoomResponse, CreateRoomRequest>({
      query: (body) => ({ url: "/room", method: "POST", body, auth: true }),
    }),
    getByRoomsList: build.query<RoomItem[], void>({
      query: () => ({ url: "/room/my-list", method: "POST", auth: true }),
      transformResponse: (response: Room) => response.rooms || [],
    }),
    getRoomDetails: build.query<RoomDetails, string>({
      query: (roomId) => ({ url: `/room/${roomId}/details`, method: "GET", auth: true }),
    }),
    addUsersToRoom: build.mutation<AddUserToRoomResponse, AddUserToRoomRequest>({
      query: (body) => ({ url: `/room/add-users`, method: "POST", body, auth: true }),
    }),
    removeUsersFromRoom: build.mutation<RemoveUsersFromRoomResponse, RemoveUsersFromRoomRequest>({
      query: (body) => ({ url: `/room/remove-users`, method: "POST", body, auth: true }),
    }),
    deleteRoom: build.mutation<DeleteRoomResponse, DeleteRoomRequest>({
      query: (body) => ({ url: `/room`, method: "DELETE", body, auth: true }),
    }),
  }),
});

export const { 
    useCreateRoomMutation, 
    useGetByRoomsListQuery, 
    useGetRoomDetailsQuery, 
    useAddUsersToRoomMutation, 
    useRemoveUsersFromRoomMutation, 
    useDeleteRoomMutation 
} = roomApi;
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "./baseApi";
import type {
  CreateAnonymousSupportRequest,
  CreateAnonymousSupportResponse,
  CreateSupportTicketRequest,
  SupportTicket,
} from "./types/support";

export const supportApi = createApi({
  reducerPath: "supportApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["SupportTickets", "SupportTicket"],
  endpoints: (build) => ({
    createSupportTicket: build.mutation<SupportTicket, CreateSupportTicketRequest>({
      query: (body) => ({
        url: "/support",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "SupportTickets", id: "LIST" }],
    }),
    getMySupportTickets: build.query<SupportTicket[], void>({
      query: () => "/support/my",
      providesTags: [{ type: "SupportTickets", id: "LIST" }],
    }),
    getMySupportTicket: build.query<SupportTicket, string>({
      query: (id) => `/support/my/${id}`,
      providesTags: (_result, _err, id) => [{ type: "SupportTicket", id }],
    }),
    createAnonymousSupportTicket: build.mutation<
      CreateAnonymousSupportResponse,
      CreateAnonymousSupportRequest
    >({
      query: (body) => ({
        url: "/support/anonymous",
        method: "POST",
        body,
        auth: false,
      }),
    }),
    getAnonymousSupportTicket: build.query<
      SupportTicket,
      { id: string; token: string }
    >({
      query: ({ id, token }) => ({
        url: `/support/anonymous/${encodeURIComponent(id)}?token=${encodeURIComponent(token)}`,
        auth: false,
      }),
    }),
  }),
});

export const {
  useCreateSupportTicketMutation,
  useGetMySupportTicketsQuery,
  useGetMySupportTicketQuery,
  useLazyGetMySupportTicketQuery,
  useCreateAnonymousSupportTicketMutation,
  useGetAnonymousSupportTicketQuery,
  useLazyGetAnonymousSupportTicketQuery,
} = supportApi;

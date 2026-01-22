import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "./baseApi";
import { Match } from "./types/match";

export const matchApi = createApi({
  reducerPath: "matchApi",
  baseQuery: baseQueryWithRefresh,
  endpoints: (build) => ({
    getMatches: build.query<Match[], void>({
      query: () => ({ url: "/matches", method: "GET", auth: true }),
    }),
  }),
});

export const { useGetMatchesQuery } = matchApi;

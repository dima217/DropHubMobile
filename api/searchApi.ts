import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "./baseApi";
import { SearchResponse, SearchRequest } from "./types/search";

export const searchApi = createApi({
  reducerPath: "searchApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["Search"],
  endpoints: (build) => ({
    search: build.query<SearchResponse, SearchRequest>({
      query: (body) => ({
        url: "/search",
        method: "POST",
        body,
        auth: true,
      }),
      providesTags: ["Search"],
    }),
  }),
});

export const { useSearchQuery } = searchApi;
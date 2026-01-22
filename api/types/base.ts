import type { FetchArgs } from "@reduxjs/toolkit/query";

export type FetchArgsWithAuth = FetchArgs & {
  auth?: boolean;
};

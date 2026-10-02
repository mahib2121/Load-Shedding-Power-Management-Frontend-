import { ofetch } from "ofetch";

import { ApiError } from "./errors";

export const api = ofetch.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,

  credentials: "include",

  headers: {
    "Content-Type": "application/json",
  },

  onResponseError({ response }) {
    const data = response._data as {
      message?: string;
      data?: unknown;
    };

    throw new ApiError(
      data?.message ?? "Something went wrong",
      response.status,
      data?.data ?? null,
    );
  },
});
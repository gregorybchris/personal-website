import { apiClient } from "./api-client";

const GET = async <T = unknown>(path: string): Promise<T> => {
  return apiClient.get<T>(path);
};

const POST = async <T = unknown>(
  path: string,
  body: object = {},
): Promise<T> => {
  return apiClient.post<object, T>(path, body);
};

// Build endpoint path with query params (does not include base URL)
const makeQuery = (endpoint: string, params: Record<string, string> = {}) => {
  const paramKeys = Object.keys(params);
  if (paramKeys.length === 0) {
    return endpoint;
  }
  const searchParams = new URLSearchParams(params).toString();
  return `${endpoint}?${searchParams}`;
};

const getSearchParams = (url: string = ""): URLSearchParams => {
  const fullUrl = url ? new URL(url) : window.location;
  return new URLSearchParams(fullUrl.search);
};

export { GET, getSearchParams, makeQuery, POST };

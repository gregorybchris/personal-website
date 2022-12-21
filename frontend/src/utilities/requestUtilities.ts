import { isDevEnvironment } from "./environmentUtilities";

const DEV_BACKEND_ROOT = "http://localhost:8000/";
const PROD_BACKEND_ROOT = "https://api.chrisgregory.me/";
const FRONTEND_ROOT = window.location.origin;

const getBackendRoot = () => {
  return isDevEnvironment() ? DEV_BACKEND_ROOT : PROD_BACKEND_ROOT;
};

const GET = async (url: string, enable_cors: boolean = true) => {
  const fetchOptions: RequestInit = {};
  if (enable_cors) {
    fetchOptions.mode = "cors";
  }
  const response = await fetch(url, fetchOptions);
  const data = await response.json();
  return data;
};

const POST = async (url: string, body: Object = {}) => {
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  });
  const data = await response.json();
  return data;
};

const makeQuery = (endpoint: string, params = {}) => {
  return appendParams(`${getBackendRoot()}${endpoint}`, params);
};

const makeURL = (params = {}, page = "") => {
  const noParamURL = page ? `${FRONTEND_ROOT}/${page}` : FRONTEND_ROOT;
  return appendParams(noParamURL, params);
};

const appendParams = (url: string, params: Record<string, string>) => {
  const fullUrl = new URL(url);
  fullUrl.search = new URLSearchParams(params).toString();
  return fullUrl.href;
};

const getSearchParams = (url: string = ""): URLSearchParams => {
  const fullUrl = url ? new URL(url) : window.location;
  return new URLSearchParams(fullUrl.search);
};

export { makeQuery, makeURL, GET, POST, getSearchParams };

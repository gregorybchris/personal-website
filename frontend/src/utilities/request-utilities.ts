import { isDevEnvironment } from "./environment-utilities";

const DEV_BACKEND_ROOT = "http://localhost:8000/";
const PROD_BACKEND_ROOT = "https://api.chrisgregory.me/";
const FRONTEND_ROOT = window.location.origin;

const getBackendRoot = () => {
  return isDevEnvironment() ? DEV_BACKEND_ROOT : PROD_BACKEND_ROOT;
};

const GET = async (url: string) => {
  try {
    const fetchOptions: RequestInit = {};
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("GET request failed:", url, error);
    throw error;
  }
};

const POST = async (url: string, body: object = {}) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("POST request failed:", url, error);
    throw error;
  }
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

export { GET, getSearchParams, makeQuery, makeURL, POST };

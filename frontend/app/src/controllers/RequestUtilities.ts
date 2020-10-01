const API_ROOT = "http://localhost:5000";
const FRONTEND_ROOT = window.location.origin;

const GET = async (url: string) => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

const POST = async (url: string, body: Object) => {
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
  return appendParams(API_ROOT + endpoint, params);
};

const makeURL = (params = {}, page = "") => {
  console.log();
  const noParamURL = page ? `${FRONTEND_ROOT}$/{page}` : FRONTEND_ROOT;
  return appendParams(noParamURL, params);
};

const appendParams = (url: string, params: Record<string, string>) => {
  const fullUrl = new URL(url);
  fullUrl.search = new URLSearchParams(params).toString();
  return fullUrl.href;
};

const getSearchParams = (url: string): URLSearchParams => {
  const fullUrl = new URL(url);
  return new URLSearchParams(fullUrl.search);
};

const getCurrentSearchParams = (): URLSearchParams => {
  return new URLSearchParams(window.location.search);
};

export {
  makeQuery,
  makeURL,
  GET,
  POST,
  getSearchParams,
  getCurrentSearchParams,
};

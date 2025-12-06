import fetchRefreshToken from "./fetchRefreshToken";
import { JWT_TOKEN } from "../constants";

export const fetchWithAuth = async (
  url,
  options = {},
  { dispatch, getState }
) => {
  const state = getState();
  const token = state.userDetails?.token || localStorage.getItem(JWT_TOKEN);

  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const firstRes = await fetch(url, { ...options, headers });

  if (firstRes.status !== 401) return firstRes;

  try {
    await dispatch(fetchRefreshToken()).unwrap();
  } catch {
    return firstRes;
  }

  const newToken =
    getState().userDetails?.token || localStorage.getItem(JWT_TOKEN);

  const retryHeaders = {
    ...(options.headers || {}),
    ...(newToken ? { Authorization: `Bearer ${newToken}` } : {}),
  };

  return fetch(url, { ...options, headers: retryHeaders });
};

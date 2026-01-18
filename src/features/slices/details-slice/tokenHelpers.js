import { JWT_TOKEN, JWT_REFRESH_TOKEN } from "../../constants";

/**
 * Helper to update token in state and localStorage
 */
export const updateToken = (state, token) => {
  state.token = token || null;
  if (token) {
    localStorage.setItem(JWT_TOKEN, token);
  } else {
    localStorage.removeItem(JWT_TOKEN);
  }
};

/**
 * Helper to update refresh token in state and localStorage
 */
export const updateRefreshToken = (state, refreshToken) => {
  state.refreshToken = refreshToken || null;
  if (refreshToken) {
    localStorage.setItem(JWT_REFRESH_TOKEN, refreshToken);
  } else {
    localStorage.removeItem(JWT_REFRESH_TOKEN);
  }
};

/**
 * Helper to update both tokens
 */
export const updateTokens = (state, token, refreshToken) => {
  updateToken(state, token);
  updateRefreshToken(state, refreshToken);
};

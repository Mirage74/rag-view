import {
  USER_NAME_UNDEFINED,
  USER_EMAIL_UNDEFINED,
  JWT_TOKEN,
  JWT_REFRESH_TOKEN,
  TYPE_WINDOW_UNDEFINED,
  TOKEN_UNDEFINED,
} from "../../constants";

const getInitialToken = () => {
  if (typeof window === TYPE_WINDOW_UNDEFINED) return null;

  const token = localStorage.getItem(JWT_TOKEN);
  if (!token || token === TOKEN_UNDEFINED) return null;
  return token;
};

const getInitialRefreshToken = () => {
  if (typeof window === TYPE_WINDOW_UNDEFINED) return null;
  return localStorage.getItem(JWT_REFRESH_TOKEN);
};

export const initialState = {
  userId: null,
  userName: USER_NAME_UNDEFINED,
  userEmail: USER_EMAIL_UNDEFINED,
  loadedFiles: [],
  maxFilesToLoad: 0,
  token: getInitialToken(),
  refreshToken: getInitialRefreshToken(),
  loading: false,
  deleting: false,
  deleteSuccess: false,
  deletedCount: 0,
  error: null,
};

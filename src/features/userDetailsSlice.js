import { createSlice } from "@reduxjs/toolkit";
import fetchLoginUser from "./fetch-async/fetchLoginUser";
import fetchRegisterUser from "./fetch-async/fetchRegisterUser";
import fetchRefreshToken from "./fetch-async/fetchRefreshToken";
import fetchUserProfile from "./fetch-async/fetchUserProfile";
import fetchDeleteUploaded from "./fetch-async/fetchDeleteUploaded";

import {
  USER_NAME_UNDEFINED,
  USER_EMAIL_UNDEFINED,
  JWT_TOKEN,
  JWT_REFRESH_TOKEN,
  TYPE_WINDOW_UNDEFINED,
  TOKEN_UNDEFINED,
  UNKNOWN_ERROR,
} from "./constants";

const getInitialToken = () => {
  if (typeof window === TYPE_WINDOW_UNDEFINED) return null;

  const token = localStorage.getItem(JWT_TOKEN);
  if (!token || token === TOKEN_UNDEFINED) return null;
  return token;
};

const initialState = {
  userId: null,
  userName: USER_NAME_UNDEFINED,
  userEmail: USER_EMAIL_UNDEFINED,
  loadedFiles: [],
  maxFilesToLoad: 0,
  token: getInitialToken(),
  refreshToken: localStorage.getItem(JWT_REFRESH_TOKEN),
  loading: false,
  deleting: false,
  deleteSuccess: false,
  deletedCount: 0,
  error: null,
};

const userDetailsSlice = createSlice({
  name: "userDetails",
  initialState,
  reducers: {
    logoutUser(state) {
      state.userId = null;
      state.userName = USER_NAME_UNDEFINED;
      state.userEmail = USER_EMAIL_UNDEFINED;
      state.loadedFiles = [];
      state.maxFilesToLoad = 0;
      state.token = null;
      state.refreshToken = null;
      state.loading = false;
      state.deleting = false;
      state.deleteSuccess = false;
      state.deletedCount = 0;
      state.error = null;
      localStorage.removeItem(JWT_TOKEN);
      localStorage.removeItem(JWT_REFRESH_TOKEN);
    },
    clearError(state) {
      state.error = null;
    },
    clearDeleteStatus(state) {
      state.deleteSuccess = false;
      state.deletedCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRegisterUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchRegisterUser.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.userName = action.payload.payload.username;
      state.userEmail = action.payload.payload.email;
      const token = action.payload.payload.token;
      state.token = token || null;
      if (token) {
        localStorage.setItem(JWT_TOKEN, token);
      } else {
        localStorage.removeItem(JWT_TOKEN);
      }
      const refreshToken = action.payload.payload.refreshToken;
      state.refreshToken = refreshToken || null;
      if (refreshToken) {
        localStorage.setItem(JWT_REFRESH_TOKEN, refreshToken);
      } else {
        localStorage.removeItem(JWT_REFRESH_TOKEN);
      }
    });
    builder.addCase(fetchRegisterUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.status ?? 500;
    });

    builder.addCase(fetchLoginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchLoginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.userName = action.payload.payload.username;
      state.userEmail = action.payload.payload.email;

      const token = action.payload.payload.token;
      state.token = token || null;
      if (token) {
        localStorage.setItem(JWT_TOKEN, token);
      } else {
        localStorage.removeItem(JWT_TOKEN);
      }

      const refreshToken = action.payload.payload.refreshToken;
      state.refreshToken = refreshToken || null;
      if (refreshToken) {
        localStorage.setItem(JWT_REFRESH_TOKEN, refreshToken);
      } else {
        localStorage.removeItem(JWT_REFRESH_TOKEN);
      }
    });
    builder.addCase(fetchLoginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? { status: 500, message: "Unknown error" };
    });

    builder.addCase(fetchRefreshToken.fulfilled, (state, action) => {
      const token = action.payload?.payload?.token;
      const refreshToken = action.payload?.payload?.refreshToken;

      state.token = token || null;
      state.refreshToken = refreshToken || null;

      if (token) localStorage.setItem(JWT_TOKEN, token);
      else localStorage.removeItem(JWT_TOKEN);

      if (refreshToken) localStorage.setItem(JWT_REFRESH_TOKEN, refreshToken);
      else localStorage.removeItem(JWT_REFRESH_TOKEN);
    });

    builder.addCase(fetchRefreshToken.rejected, (state, action) => {
      state.error = action.payload ?? { status: 500, message: UNKNOWN_ERROR };
    });

    builder.addCase(fetchUserProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;

      const p = action.payload?.payload;

      if (p?.id) state.userId = p.id;
      if (p?.username) state.userName = p.username;
      if (p?.email) state.userEmail = p.email;
      if (p?.loadedFiles) state.loadedFiles = p.loadedFiles;
      if (p?.maxLoadedFiles != null) state.maxFilesToLoad = p.maxLoadedFiles;
    });

    builder.addCase(fetchUserProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? { status: 500, message: "Unknown error" };
    });

    // Delete uploaded files
    builder.addCase(fetchDeleteUploaded.pending, (state) => {
      state.deleting = true;
      state.deleteSuccess = false;
      state.deletedCount = 0;
      state.error = null;
    });

    builder.addCase(fetchDeleteUploaded.fulfilled, (state, action) => {
      state.deleting = false;
      state.deleteSuccess = true;
      state.deletedCount = action.payload?.payload ?? 0;
      state.loadedFiles = [];
      state.error = null;
    });

    builder.addCase(fetchDeleteUploaded.rejected, (state, action) => {
      state.deleting = false;
      state.deleteSuccess = false;
      state.error = action.payload ?? { status: 500, message: "Unknown error" };
    });
  },
});

export const { logoutUser, clearError, clearDeleteStatus } =
  userDetailsSlice.actions;
export default userDetailsSlice.reducer;

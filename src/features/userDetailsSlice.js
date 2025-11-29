import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "./constants";
import {
  METHOD_POST_QUERY,
  HEADER_CONTENT_TYPE,
  USER_NAME_UNDEFINED,
  USER_EMAIL_UNDEFINED,
  JWT_TOKEN,
  JWT_REFRESH_TOKEN,
  PREFIX_AUTH,
  PREFIX_REGISTER,
  APPLICATION_JSON,
  ERROR_RESPONSE_NOT_OK,
  TYPE_WINDOW_UNDEFINED,
  TOKEN_UNDEFINED,
  ERROR_NO_RESPONSE} from "./constants";

  const getInitialToken = () => {
    if (typeof window === TYPE_WINDOW_UNDEFINED) return null;

    const token = localStorage.getItem(JWT_TOKEN);
    if (!token || token === TOKEN_UNDEFINED) return null;
    return token;
};

const initialState = {
  userName: USER_NAME_UNDEFINED,
  userEmail: USER_EMAIL_UNDEFINED,
  token: getInitialToken(),
  refreshToken: localStorage.getItem(JWT_REFRESH_TOKEN),
  loading: false,
  error: null
};

export const fetchRegisterUser = createAsyncThunk(
  "userDetails/fetchRegisterUser",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await fetch(BASE_URL + PREFIX_AUTH + PREFIX_REGISTER, {
        method: METHOD_POST_QUERY,
        headers: { [HEADER_CONTENT_TYPE]: APPLICATION_JSON },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        return rejectWithValue({
          status: res.status,
          message: ERROR_RESPONSE_NOT_OK,
        });
      }

      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue({
        status: 500,
        message: `${ERROR_NO_RESPONSE}: ${err}`,
      });
    }
  }
);

const userDetailsSlice = createSlice({
  name: "userDetails",
  initialState,
 reducers: {
    logoutUser(state) {
      state.userName = USER_NAME_UNDEFINED;
      state.userEmail = USER_EMAIL_UNDEFINED;
      state.token = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem(JWT_TOKEN);
      localStorage.removeItem(JWT_REFRESH_TOKEN);
    }
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

      localStorage.setItem(JWT_TOKEN, action.payload.payload.token);
      localStorage.setItem(JWT_REFRESH_TOKEN, action.payload.payload.refreshToken);
    });
    builder.addCase(fetchRegisterUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.status ?? 500;
    });
  },
});

export const { logoutUser } = userDetailsSlice.actions;
export default userDetailsSlice.reducer;